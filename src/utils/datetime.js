// UK time helpers (no external libs)

const UK_TZ = "Europe/London";

/**
 * Render an ISO string in UK time with a clear label.
 * e.g. "12 Aug 2025, 10:00 (UK time)"
 */
export function formatUk(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const str = new Intl.DateTimeFormat("en-GB", {
      timeZone: UK_TZ,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
    return `${str} (UK time)`;
  } catch {
    // Fallback
    return `${new Date(iso).toISOString()} (UK time)`;
  }
}

/**
 * Build an ISO (WITHOUT 'Z') that the backend interprets as UK wall time.
 * Slots may contain '-', '–' (en dash), or '—' (em dash).
 * Returns: "YYYY-MM-DDTHH:mm:00"
 */
export function buildUkIso(dateYYYYMMDD, slotStr) {
  if (!dateYYYYMMDD || !slotStr) return "";
  const [startStr] = slotStr.split(/[-–—]/).map(s => s.trim());
  // Normalize "HH:mm"
  const [h, m] = startStr.split(":").map(Number);
  const hh = String(h).padStart(2, "0");
  const mm = String(m || 0).padStart(2, "0");
  return `${dateYYYYMMDD}T${hh}:${mm}:00`; // no timezone suffix on purpose
}
