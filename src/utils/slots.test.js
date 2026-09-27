import { describe, it, expect } from "vitest";
import {
  buildSlotOptions,
  normalizeSlotDuration,
  slotBounds,
  slotStatus,
  toMinutes,
} from "./slots";

describe("buildSlotOptions", () => {
  // Durations that already divide the hour must keep their existing behaviour —
  // three of the therapists in production are on 60 minutes.
  it("leaves 60-minute sessions on the hour", () => {
    const opts = buildSlotOptions(60);
    expect(opts).toHaveLength(24);
    expect(opts.slice(0, 3)).toEqual(["00:00-01:00", "01:00-02:00", "02:00-03:00"]);
    expect(opts).toContain("09:00-10:00");
    expect(opts).toContain("19:00-20:00");
  });

  it("leaves 30-minute sessions on the half hour", () => {
    const opts = buildSlotOptions(30);
    expect(opts).toHaveLength(48);
    expect(opts).toContain("09:00-09:30");
    expect(opts).toContain("09:30-10:00");
  });

  it.each([15, 20])("leaves %i-minute sessions unchanged", (d) => {
    const opts = buildSlotOptions(d);
    expect(opts).toHaveLength((24 * 60) / d);
    expect(opts[0]).toBe(`00:00-${String(Math.floor(d / 60)).padStart(2, "0")}:${String(d % 60).padStart(2, "0")}`);
  });

  // The bug: stepping by the duration made 50-minute slots drift off the hour.
  it("keeps 50-minute sessions starting on the hour", () => {
    const opts = buildSlotOptions(50);
    expect(opts).toContain("09:00-09:50");
    expect(opts).toContain("10:00-10:50");
    expect(opts).toContain("11:00-11:50");
    expect(opts).not.toContain("08:20-09:10");
    expect(opts).not.toContain("09:10-10:00");
  });

  it("gives every 50-minute option a start time on the hour", () => {
    for (const slot of buildSlotOptions(50)) {
      expect(slotBounds(slot).start % 60).toBe(0);
    }
  });

  // The server rejected non :00/:30 starts, so drifting slots were unbookable.
  it.each([45, 50, 90])("gives %i-minute sessions bookable start minutes", (d) => {
    for (const slot of buildSlotOptions(d)) {
      expect([0, 30]).toContain(slotBounds(slot).start % 60);
    }
  });

  it("never produces overlapping options", () => {
    for (const d of [15, 20, 30, 45, 50, 60, 90, 120]) {
      const bounds = buildSlotOptions(d).map(slotBounds);
      for (let i = 1; i < bounds.length; i++) {
        expect(bounds[i].start).toBeGreaterThanOrEqual(bounds[i - 1].end);
      }
    }
  });

  it("never runs a slot past midnight", () => {
    for (const d of [15, 20, 30, 45, 50, 60, 90, 120, 240]) {
      for (const slot of buildSlotOptions(d)) {
        expect(slotBounds(slot).end).toBeLessThanOrEqual(24 * 60);
      }
    }
  });

  it("always returns at least one option", () => {
    for (const d of [15, 30, 50, 60, 240]) {
      expect(buildSlotOptions(d).length).toBeGreaterThan(0);
    }
  });
});

describe("normalizeSlotDuration", () => {
  it("passes through a sensible value", () => {
    expect(normalizeSlotDuration(50)).toBe(50);
    expect(normalizeSlotDuration("60")).toBe(60);
  });

  it("falls back to 30 for missing or nonsense values", () => {
    expect(normalizeSlotDuration(undefined)).toBe(30);
    expect(normalizeSlotDuration(null)).toBe(30);
    expect(normalizeSlotDuration(0)).toBe(30);
    expect(normalizeSlotDuration(-10)).toBe(30);
    expect(normalizeSlotDuration("abc")).toBe(30);
  });

  it("clamps extremes so the dropdown can never come out empty", () => {
    expect(normalizeSlotDuration(1)).toBe(15);
    expect(normalizeSlotDuration(3600)).toBe(240);
  });
});

describe("slotBounds", () => {
  it("parses a plain slot", () => {
    expect(slotBounds("09:00-10:00")).toEqual({ start: 540, end: 600 });
  });

  it("accepts en and em dashes", () => {
    expect(slotBounds("09:00–10:00")).toEqual({ start: 540, end: 600 });
    expect(slotBounds("09:00—10:00")).toEqual({ start: 540, end: 600 });
  });

  it("treats a 00:00 end as midnight rather than going backwards", () => {
    expect(slotBounds("23:00-00:00")).toEqual({ start: 1380, end: 1440 });
  });

  it("returns null for junk", () => {
    expect(slotBounds("not-a-slot")).toBeNull();
    expect(slotBounds("")).toBeNull();
  });
});

describe("slotStatus", () => {
  // The bug: the UI compared slot strings, so a 30-minute booking never matched
  // the therapist's own 08:00-09:00 slot and booked slots stayed clickable.
  it("marks a slot taken when a shorter booking sits inside it", () => {
    const booked = [{ start: "08:00", end: "08:30", status: "confirmed" }];
    expect(slotStatus("08:00-09:00", booked)).toBe("confirmed");
  });

  it("marks a slot taken when a booking starts midway through it", () => {
    const booked = [{ start: "08:30", end: "09:00", status: "pending" }];
    expect(slotStatus("08:00-09:00", booked)).toBe("pending");
  });

  it("marks a 50-minute slot taken by an overlapping booking", () => {
    const booked = [{ start: "09:30", end: "10:00", status: "confirmed" }];
    expect(slotStatus("09:00-09:50", booked)).toBe("confirmed");
  });

  it("leaves a slot available when bookings only touch its boundaries", () => {
    const booked = [
      { start: "07:00", end: "08:00", status: "confirmed" },
      { start: "09:00", end: "10:00", status: "confirmed" },
    ];
    expect(slotStatus("08:00-09:00", booked)).toBe("available");
  });

  it("leaves a slot available with no bookings", () => {
    expect(slotStatus("08:00-09:00", [])).toBe("available");
    expect(slotStatus("08:00-09:00")).toBe("available");
  });

  it("prefers the strongest overlapping status", () => {
    const booked = [
      { start: "08:00", end: "08:30", status: "pending" },
      { start: "08:30", end: "09:00", status: "confirmed" },
    ];
    expect(slotStatus("08:00-09:00", booked)).toBe("confirmed");
  });

  it("reports reschedule_pending over pending", () => {
    const booked = [
      { start: "08:00", end: "08:30", status: "pending" },
      { start: "08:30", end: "09:00", status: "reschedule_pending" },
    ];
    expect(slotStatus("08:00-09:00", booked)).toBe("reschedule_pending");
  });

  it("ignores malformed booking intervals", () => {
    const booked = [{ start: "oops", end: "??", status: "confirmed" }];
    expect(slotStatus("08:00-09:00", booked)).toBe("available");
  });

  it("does not throw on the older keyed-object response shape", () => {
    const legacy = { "08:00-08:30": "confirmed" };
    expect(() => slotStatus("08:00-09:00", legacy)).not.toThrow();
    expect(slotStatus("08:00-09:00", legacy)).toBe("available");
  });

  it("falls back to available for a malformed slot", () => {
    expect(slotStatus("garbage", [{ start: "08:00", end: "09:00", status: "confirmed" }])).toBe("available");
  });
});

describe("toMinutes", () => {
  it("converts HH:mm", () => {
    expect(toMinutes("00:00")).toBe(0);
    expect(toMinutes("09:30")).toBe(570);
    expect(toMinutes("23:59")).toBe(1439);
  });

  it("returns NaN for junk", () => {
    expect(toMinutes("abc")).toBeNaN();
  });
});
