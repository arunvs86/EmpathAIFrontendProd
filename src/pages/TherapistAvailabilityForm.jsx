import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTherapistAppointments,
  handleAppointmentDecision,
} from "../services/appointmentApi";

// 🔽 NEW: availability APIs with edit/delete
import {
  fetchTherapistByUserId,
  fetchTherapistById, // (still available if you need elsewhere)
} from "../services/therapistApi";

import {
  fetchTherapistAvailability,
  saveAvailability,
  editAvailabilitySlot,
  deleteAvailabilitySlot,
  deleteAvailabilityDate,
} from "../services/therapistApi";

import { DateTime } from "luxon";

/** Format an ISO datetime in UK time (handles BST/GMT) */
function formatUK(isoOrDate, durationMins = 30) {
  // Accept ISO string or Date
  const dt = (isoOrDate instanceof Date)
    ? DateTime.fromJSDate(isoOrDate, { zone: 'utc' }).setZone('Europe/London')
    : DateTime.fromISO(String(isoOrDate), { setZone: true }).setZone('Europe/London');

  if (!dt.isValid) return String(isoOrDate);

  const end = dt.plus({ minutes: durationMins });
  // e.g. "21 Oct 2025, 15:00–15:30 BST"
  return `${dt.toFormat('dd LLL yyyy, HH:mm')}–${end.toFormat('HH:mm z')}`;
}

/** Normalize slot (handle hyphen/en dash/em dash + pad) */
function normalizeSlot(slot = "") {
  const parts = String(slot).split(/-|–|—/);
  if (parts.length !== 2) return slot.trim();
  const [s, e] = parts.map((x) => x.trim());
  const pad = (n) => String(n).padStart(2, "0");
  const [h1, m1] = s.split(":").map((n) => pad(n));
  const [h2, m2] = e.split(":").map((n) => pad(n));
  return `${h1}:${m1}-${h2}:${m2}`;
}

function TherapistAvailabilityForm() {
  const navigate = useNavigate();

  // logged-in user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  // --- local ids (Therapist PK kept for future needs if you want it)
  const [therapist, setTherapist] = useState(null);

  // --- Tabs ---
  const [activeTab, setActiveTab] = useState("availability");
  const today = new Date().toISOString().split("T")[0];

  // --- Availability state ---
  const [dateInput, setDateInput] = useState("");
  const [selectedDates, setSelectedDates] = useState([]); // array of YYYY-MM-DD
  const [timeSlotInputs, setTimeSlotInputs] = useState({}); // per-date input
  const [timeSlotsMap, setTimeSlotsMap] = useState({}); // { date: [slots] }
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Per-item loading keys (e.g., `2025-08-21|09:00-09:30|del`, `2025-08-21|edit`)
  const [loadingKey, setLoadingKey] = useState(null);

  // Inline edit state: { date, oldSlot } → new select value
  const [editKey, setEditKey] = useState(null); // {date, oldSlot} or null
  const [editValue, setEditValue] = useState("");

  // 30-minute options
  const slotOptions = useMemo(() => {
    const slots = [];
    const pad = (n) => String(n).padStart(2, "0");
    for (let mins = 0; mins < 24 * 60; mins += 30) {
      const h1 = Math.floor(mins / 60),
        m1 = mins % 60;
      const end = mins + 30,
        h2 = Math.floor(end / 60) % 24,
        m2 = end % 60;
      slots.push(`${pad(h1)}:${pad(m1)}-${pad(h2)}:${pad(m2)}`);
    }
    return slots;
  }, []);

  // ===== Load initial therapist + availability on Availability tab =====
  useEffect(() => {
    if (activeTab !== "availability") return;

    (async () => {
      try {
        setError("");
        // 1) Map user → therapist
        const tData = await fetchTherapistByUserId(userId);
        setTherapist(tData);

        // 2) Fetch availability by Therapist PK
        // const availArr = await fetchTherapistAvailability(tData.id);
        let availArr = await fetchTherapistAvailability(tData.id);
        if (!Array.isArray(availArr)) {
                    if (availArr?.data && Array.isArray(availArr.data)) {
                      availArr = availArr.data;
                    } else if (availArr == null) {
                      availArr = [];
                    } else {
                      availArr = [availArr];
                    }
                  }
        // 3) Merge all records -> { date: [slots...] }
        const master = {};
        availArr.forEach((rec) => {
          const sm = rec.selected_time_slots || {};
          Object.entries(sm).forEach(([date, slots]) => {
            master[date] = master[date] || new Set();
            (Array.isArray(slots) ? slots : []).forEach((slot) => {
              master[date].add(normalizeSlot(slot));
            });
          });
        });

        // 4) Convert to arrays + sort
        const finalMap = {};
        Object.keys(master)
          .sort((a, b) => new Date(a) - new Date(b))
          .forEach((date) => {
            finalMap[date] = Array.from(master[date]).sort();
          });

        setSelectedDates(Object.keys(finalMap));
        setTimeSlotsMap(finalMap);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load availability");
      }
    })();
  }, [activeTab, userId]);

  // Date picker: add on change
  const handleDateChange = (e) => {
    const d = e.target.value;
    if (d && !selectedDates.includes(d)) {
      setSelectedDates((arr) => [...arr, d]);
      if (!timeSlotsMap[d]) {
        setTimeSlotsMap((m) => ({ ...m, [d]: [] }));
      }
    }
    setDateInput("");
  };

  // Add slot to a date
  const addTimeSlot = (date) => {
    const raw = timeSlotInputs[date];
    if (!raw) return;
    const slot = normalizeSlot(raw);

    const existing = timeSlotsMap[date] || [];
    if (existing.includes(slot)) {
      setError("You have already added that slot.");
      return;
    }

    setTimeSlotsMap((m) => ({
      ...m,
      [date]: [...existing, slot].sort(),
    }));
    setTimeSlotInputs((m) => ({ ...m, [date]: "" }));
    setError("");
  };

  // Save (merge) all changes in one go
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Build payload
      const selected_time_slots = {};
      selectedDates.forEach((d) => {
        selected_time_slots[d] = (timeSlotsMap[d] || []).map((s) => normalizeSlot(s));
      });

      await saveAvailability({
        selected_dates: selectedDates,
        selected_time_slots,
        availability_type: "manual",
      });

      setSuccess("Availability saved.");
    } catch (err) {
      setError(err.message || "Failed to save availability");
    }
  };

  // Delete a single slot
  const handleDeleteSlot = async (date, slot) => {
    setError("");
    const key = `${date}|${slot}|del`;
    setLoadingKey(key);

    // optimistic update
    const prev = timeSlotsMap[date] || [];
    setTimeSlotsMap((m) => ({
      ...m,
      [date]: prev.filter((s) => s !== slot),
    }));

    try {
      await deleteAvailabilitySlot({ date, timeSlot: slot });
      // if no slots remain, auto-remove date locally
      setTimeSlotsMap((m) => {
        const next = { ...m };
        if (!next[date] || next[date].length === 0) {
          delete next[date];
          setSelectedDates((ds) => ds.filter((d) => d !== date));
        }
        return next;
      });
    } catch (err) {
      // revert on error
      setTimeSlotsMap((m) => ({
        ...m,
        [date]: prev,
      }));
      setError(err.message || "Failed to delete slot");
    } finally {
      setLoadingKey(null);
    }
  };

  // Remove entire date
  const handleDeleteDate = async (date) => {
    setError("");
    const key = `${date}|delete-day`;
    setLoadingKey(key);

    // optimistic update
    const prevMap = { ...timeSlotsMap };
    const prevDates = [...selectedDates];

    setTimeSlotsMap((m) => {
      const next = { ...m };
      delete next[date];
      return next;
    });
    setSelectedDates((ds) => ds.filter((d) => d !== date));

    try {
      await deleteAvailabilityDate({ date });
    } catch (err) {
      // revert
      setTimeSlotsMap(prevMap);
      setSelectedDates(prevDates);
      setError(err.message || "Failed to delete date");
    } finally {
      setLoadingKey(null);
    }
  };

  // Enter edit mode for a slot
  const beginEdit = (date, oldSlot) => {
    setEditKey({ date, oldSlot });
    setEditValue(oldSlot);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditKey(null);
    setEditValue("");
  };

  // Save edit
  const saveEdit = async () => {
    if (!editKey) return;
    const { date, oldSlot } = editKey;
    const newSlot = normalizeSlot(editValue);
    const opKey = `${date}|${oldSlot}|edit`;
    setLoadingKey(opKey);
    setError("");

    const prev = timeSlotsMap[date] || [];

    // optimistic: replace old with new (dedupe)
    const next = prev.filter((s) => s !== oldSlot);
    if (!next.includes(newSlot)) next.push(newSlot);
    next.sort();

    setTimeSlotsMap((m) => ({ ...m, [date]: next }));

    try {
      await editAvailabilitySlot({ date, oldSlot, newSlot });
      setEditKey(null);
      setEditValue("");
    } catch (err) {
      // revert
      setTimeSlotsMap((m) => ({ ...m, [date]: prev }));
      setError(err.message || "Failed to edit slot");
    } finally {
      setLoadingKey(null);
    }
  };

  // ===== Appointments state =====
  const [appointments, setAppointments] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appsError, setAppsError] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null); // "accept" | "reject" | null

  useEffect(() => {
    if (activeTab !== "appointments") return;
    const fetchApps = async () => {
      setLoadingApps(true);
      setAppsError("");
      try {
        // You said id is fine; keeping your original call
        const data = await getTherapistAppointments(userId);
        console.log("TherapistAppointmetns", data)
        setAppointments(data.filter((a) => a.status === "pending"));
      } catch (err) {
        setAppsError(err.message);
      } finally {
        setLoadingApps(false);
      }
    };
    fetchApps();
  }, [activeTab, userId]);

  const onDecision = async (id, decision) => {
    setLoadingId(id);
    setLoadingAction(decision); // "accept" or "reject"
    try {
      await handleAppointmentDecision(id, decision);
      setAppointments((list) => list.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingId(null);
      setLoadingAction(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      {/* Tabs */}
      <div className="flex border-b border-white/20 mb-6">
        {["availability", "appointments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-center transition ${
              activeTab === tab
                ? "border-b-2 border-amber-400 font-semibold text-amber-300"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab === "availability" ? "Availability" : "Appointments"}
          </button>
        ))}
      </div>

      {activeTab === "availability" ? (
        <form onSubmit={handleSave}>
          {error && <p className="text-red-300 mb-2">{error}</p>}
          {success && <p className="text-green-300 mb-2">{success}</p>}

          {/* Date picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-white">
              Add Date
            </label>
            <input
              type="date"
              min={today}
              value={dateInput}
              onChange={handleDateChange}
              className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            />
          </div>

          {/* Dates + slots */}
          {selectedDates.map((date) => {
            const slots = timeSlotsMap[date] || [];
            const dayLoading = loadingKey === `${date}|delete-day`;
            return (
              <div key={date} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{date}</div>
                  <button
                    type="button"
                    onClick={() => handleDeleteDate(date)}
                    disabled={dayLoading}
                    className={`text-sm px-3 py-1 rounded border ${
                      dayLoading
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    {dayLoading ? "Removing…" : "Remove day"}
                  </button>
                </div>

                {/* Slot chips */}
                <div className="flex flex-wrap gap-2">
                  {slots.length === 0 && (
                    <span className="text-gray-400 text-sm">No slots yet.</span>
                  )}
                  {slots.map((slot) => {
                    const isEditing =
                      editKey &&
                      editKey.date === date &&
                      editKey.oldSlot === slot;
                    const delKey = `${date}|${slot}|del`;
                    const isDeleting = loadingKey === delKey;
                    const editBusy = loadingKey === `${date}|${slot}|edit`;

                    return (
                      <div
                        key={slot}
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm ring-1 ring-black/10"
                      >
                        {!isEditing ? (
                          <>
                            <span className="text-white">{slot}</span>
                            <button
                              type="button"
                              onClick={() => beginEdit(date, slot)}
                              className="text-xs px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                              disabled={editBusy || isDeleting}
                              title="Edit"
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSlot(date, slot)}
                              className="text-xs px-2 py-0.5 rounded bg-red-600 text-white hover:bg-red-700"
                              disabled={isDeleting}
                              title="Delete"
                            >
                              {isDeleting ? "…" : "✕"}
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              value={editValue}
                              onChange={(e) =>
                                setEditValue(normalizeSlot(e.target.value))
                              }
                              className="bg-slate-800 border border-white/20 text-white rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                            >
                              {slotOptions.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={saveEdit}
                              className="text-xs px-2 py-0.5 rounded-md bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold transition"
                              disabled={editBusy}
                            >
                              {editBusy ? "Saving…" : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="text-xs px-2 py-0.5 rounded border hover:bg-white/10"
                              disabled={editBusy}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add slot to this date */}
                <div className="flex">
                  <select
                    value={timeSlotInputs[date] || ""}
                    onChange={(e) =>
                      setTimeSlotInputs((m) => ({
                        ...m,
                        [date]: e.target.value,
                      }))
                    }
                    className="bg-slate-800 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                  >
                    <option value="" disabled>
                      Select slot…
                    </option>
                    {slotOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => addTimeSlot(date)}
                    className="ml-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}

          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold py-2 rounded-lg transition"
          >
            Save Availability
          </button>
        </form>
      ) : (
        // ===== Appointments tab =====
        <div>
          {loadingApps && <p className="text-white">Loading appointments…</p>}
          {appsError && <p className="text-red-300">{appsError}</p>}
          {!loadingApps && appointments.length === 0 && (
            <p className="text-white/60">No pending requests.</p>
          )}
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-4 flex justify-between"
            >
              <div>
                <p className="text-white">
                  <strong>User:</strong> {appt.User?.username || appt.user_id}
                </p>
                <p className="text-white">
  <strong>When:</strong> {formatUK(appt.scheduled_at, appt.session_duration || 30)}
</p>
                {appt.primary_concern && (
                  <p className="text-white/90">
                    <strong>Concern:</strong> {appt.primary_concern}
                  </p>
                )}
              </div>
              <div className="space-y-2">
              <button
  onClick={() => onDecision(appt.id, "accept")}
  disabled={loadingId === appt.id}
  className={`px-3 py-1 rounded-lg transition ${
    loadingId === appt.id && loadingAction === "accept"
      ? "bg-green-500/40 text-white/50 cursor-not-allowed"
      : "bg-green-500/80 hover:bg-green-500 text-white"
  }`}
>
  {loadingId === appt.id && loadingAction === "accept"
    ? "Accepting…"
    : "Accept"}
</button>

<button
  onClick={() => onDecision(appt.id, "reject")}
  disabled={loadingId === appt.id}
  className={`block px-3 py-1 rounded transition ${
    loadingId === appt.id && loadingAction === "reject"
      ? "bg-red-400 cursor-not-allowed opacity-70"
      : "bg-red-600 hover:bg-red-700 text-white"
  }`}
>
  {loadingId === appt.id && loadingAction === "reject"
    ? "Rejecting…"
    : "Reject"}
</button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TherapistAvailabilityForm;
