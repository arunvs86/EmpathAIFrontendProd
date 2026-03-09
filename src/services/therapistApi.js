// frontend/src/services/therapistApi.js
const API = "https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net";

function authHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) data = await res.json().catch(() => ({}));
  else data = await res.text().catch(() => "");
  return { res, data };
}

/* ---------- therapists (general) ---------- */
export async function fetchTherapists() {
  const { res, data } = await fetchJson(`${API}/therapists`);
  if (!res.ok) throw new Error((data && data.error) || res.statusText || "Failed to fetch therapists");
  return data;
}

export async function fetchTherapistById(id) {
  const { res, data } = await fetchJson(`${API}/therapists/${id}`);
  if (!res.ok) throw new Error((data && data.error) || res.statusText || "Failed to fetch therapist details");
  return data;
}

export async function fetchTherapistByUserId(id) {
  const { res, data } = await fetchJson(`${API}/therapists/therapistByUser/${id}`);
  if (!res.ok) throw new Error((data && data.error) || res.statusText || "Failed to fetch therapist details");
  return data;
}

/* ---------- availability (smart routing) ---------- */
/**
 * Tries these, in order:
 *   1) /therapists/:id/availability                  (clean, preferred)
 *   2) /therapists/therapists/:id/availability       (if router is mounted at /therapists AND route also includes /therapists)
 *   3) /therapists/therapist/:id                     (legacy route)
 */
export async function fetchTherapistAvailability(therapistId) {
  const hdrs = { method: "GET", headers: authHeaders() };

  // 1) preferred
  // let { res, data } = await fetchJson(`${API}/therapists/${therapistId}/availability`, hdrs);
  // console.log("avail data:", data)
  // if (res.ok) return data;

const { res, data } = await fetchJson(`${API}/therapists/${therapistId}/availability`, hdrs);
console.log("avail data:", data);

if (!res.ok || !Array.isArray(data)) return data;

// Helpers
const now = new Date();
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const isToday = (d) => d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
const parseLocalDate = (yyyyMMdd) => {
  // Avoid timezone issues from Date("YYYY-MM-DD")
  const [y, m, d] = String(yyyyMMdd).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

const filtered = data
  .map(item => {
    const selectedDates = Array.isArray(item.selected_dates) ? item.selected_dates : [];
    const timeSlotsMap = item.selected_time_slots && typeof item.selected_time_slots === "object"
      ? item.selected_time_slots
      : {};

    // keep only today or future dates
    const futureDates = selectedDates.filter(ds => parseLocalDate(ds) >= startOfToday);

    // filter slots
    const filteredSlots = {};
    for (const [dateStr, slots] of Object.entries(timeSlotsMap)) {
      const dateObj = parseLocalDate(dateStr);
      if (dateObj < startOfToday) continue; // skip past dates entirely

      const kept = (Array.isArray(slots) ? slots : []).filter(slot => {
        // slot format "HH:MM-HH:MM"
        if (!isToday(dateObj)) return true; // future date → keep all
        const [start] = String(slot).split("-");
        const [h, m] = start.split(":").map(Number);
        const slotTime = new Date(now);
        slotTime.setHours(h || 0, m || 0, 0, 0);
        return slotTime > now; // keep only times later today
      });

      if (kept.length) filteredSlots[dateStr] = kept;
    }

    // Also prune selected_dates that no longer have slots for that day
    const prunedDates = futureDates.filter(ds => {
      const d = parseLocalDate(ds);
      if (!filteredSlots[ds]) return false; // no slots left for this date
      return true;
    });

    return {
      ...item,
      selected_dates: prunedDates,
      selected_time_slots: filteredSlots,
    };
  })
  // Drop availability entries that have no dates/slots left
  .filter(item =>
    Array.isArray(item.selected_dates) && item.selected_dates.length > 0 &&
    item.selected_time_slots && Object.keys(item.selected_time_slots).length > 0
  );

return filtered;
  


  // 2) double "/therapists" fallback (when route path includes it AND router is mounted at /therapists)
  let tried2 = false;
  if (res.status === 404 || typeof data === "string") {
    tried2 = true;
    ({ res, data } = await fetchJson(`${API}/therapists/therapists/${therapistId}/availability`, hdrs));
    if (res.ok) {
      console.warn("[availability] Using fallback route: /therapists/therapists/:id/availability");
      return data;
    }
  }

  // 3) legacy route
  if (res.status === 404 || tried2) {
    ({ res, data } = await fetchJson(`${API}/therapists/therapist/${therapistId}`, hdrs));
    if (res.ok) {
      console.warn("[availability] Using legacy route: /therapists/therapist/:id");
      return data;
    }
  }

  const msg =
    (data && data.error) ||
    (typeof data === "string" && data) ||
    res.statusText ||
    "Failed to fetch availability";
  throw new Error(msg);
}

/* ---------- availability mutations ---------- */
// Merge-add availability (single request)
export async function saveAvailability({ selected_dates, selected_time_slots, availability_type }) {
  const { res, data } = await fetchJson(`${API}/therapists`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ selected_dates, selected_time_slots, availability_type }),
  });
  if (!res.ok) throw new Error((data && data.error) || res.statusText || "Failed to save availability");
  return data;
}

export async function editAvailabilitySlot({ date, oldSlot, newSlot, policy = "cancel_and_delete", alternatives = [] }) {
  const { res, data } = await fetchJson(
    `${API}/therapists/availability/slot`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ date, oldSlot, newSlot, policy, alternatives }),
    }
  );
  if (!res.ok) throw new Error((data && data.error) || res.statusText || "Failed to edit slot");
  return data;
}

export async function deleteAvailabilitySlot({ date, timeSlot, policy = "cancel_and_delete", alternatives = [] }) {
  const params = new URLSearchParams({ date, timeSlot, policy });
  if (alternatives?.length) params.set("alternatives", JSON.stringify(alternatives));

  const { res, data } = await fetchJson(
    `${API}/therapists/availability/slot?${params.toString()}`,
    { method: "DELETE", headers: authHeaders() }
  );
  if (!res.ok) throw new Error((data && data.error) || res.statusText || "Failed to delete slot");
  return data;
}

export async function deleteAvailabilityDate({ date, policy = "cancel_and_delete", alternatives = [] }) {
  const params = new URLSearchParams({ date, policy });
  if (alternatives?.length) params.set("alternatives", JSON.stringify(alternatives));

  const { res, data } = await fetchJson(
    `${API}/therapists/availability/date?${params.toString()}`,
    { method: "DELETE", headers: authHeaders() }
  );
  if (!res.ok) throw new Error((data && data.error) || res.statusText || "Failed to delete date");
  return data;
}