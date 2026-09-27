// Shared slot maths for the therapist availability form and the booking page.

const STATUS_RANK = { confirmed: 3, reschedule_pending: 2, pending: 1 };

// Grids that repeat cleanly every hour, so slot start times never drift.
const HOUR_ALIGNED_GRIDS = [15, 20, 30, 60, 120, 180, 240];

export function toMinutes(hhmm) {
  const [h, m] = String(hhmm).split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN;
}

/** Bounds of a "HH:mm-HH:mm" slot in minutes, treating a 00:00 end as midnight. */
export function slotBounds(slot) {
  const [s, e] = String(slot).split(/–|—|-/).map((x) => x.trim());
  const start = toMinutes(s);
  let end = toMinutes(e);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (end <= start) end += 24 * 60;
  return { start, end };
}

/**
 * Status of a slot given the therapist's booked intervals.
 * Matched by OVERLAP: a therapist's 08:00-09:00 slot and a 30-minute booking at
 * 08:00 are different strings, so exact matching left booked slots bookable.
 */
export function slotStatus(slot, booked = []) {
  const bounds = slotBounds(slot);
  if (!bounds) return "available";

  // Tolerate the older keyed-object response so a frontend-first deploy degrades
  // to "available" instead of throwing on a non-iterable.
  const intervals = Array.isArray(booked) ? booked : [];

  let worst = null;
  for (const b of intervals) {
    const bb = slotBounds(`${b.start}-${b.end}`);
    if (!bb) continue;
    if (bounds.start < bb.end && bb.start < bounds.end) {
      if (!worst || (STATUS_RANK[b.status] || 0) > (STATUS_RANK[worst] || 0)) worst = b.status;
    }
  }
  return worst || "available";
}

/**
 * Selectable slots of `slotDuration` minutes, starting on an hour-aligned grid.
 * Stepping by the duration itself made a 50-minute session drift (08:20, 09:10,
 * 10:50), which also tripped the server's start-time validation.
 */
export function buildSlotOptions(slotDuration) {
  const step =
    HOUR_ALIGNED_GRIDS.find((g) => g >= slotDuration) ?? Math.ceil(slotDuration / 60) * 60;

  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (mins) => `${pad(Math.floor(mins / 60) % 24)}:${pad(mins % 60)}`;

  const slots = [];
  for (let mins = 0; mins + slotDuration <= 24 * 60; mins += step) {
    slots.push(`${fmt(mins)}-${fmt(mins + slotDuration)}`);
  }
  return slots;
}

/** Clamp a therapist's configured session length into a usable slot length. */
export function normalizeSlotDuration(raw, { min = 15, max = 240, fallback = 30 } = {}) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(Math.max(Math.round(n), min), max);
}
