import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "t1" }),
  useNavigate: () => vi.fn(),
}));
vi.mock("../utils/serverMessages", () => ({ translateServerMessage: (m) => m }));
vi.mock("../services/therapistApi", () => ({
  fetchTherapistById: vi.fn(),
  fetchTherapistAvailability: vi.fn(),
}));
vi.mock("../services/appointmentApi", () => ({ fetchOccupiedSlots: vi.fn() }));
vi.mock("../services/chatApi", () => ({ createChat: vi.fn() }));

const { fetchTherapistById, fetchTherapistAvailability } = await import("../services/therapistApi");
const { fetchOccupiedSlots } = await import("../services/appointmentApi");
const { default: TherapistDetail } = await import("./TherapistDetail");

function arrange({ slots = ["08:00-09:00", "19:00-20:00"], occupied = {}, sessionDuration = 60 } = {}) {
  localStorage.setItem("user", JSON.stringify({ id: "u1" }));
  localStorage.setItem("token", "tok");
  fetchTherapistById.mockResolvedValue({
    id: "t1",
    user_id: "tu1",
    session_duration: sessionDuration,
    User: { username: "Belén" },
    specialization_tags: [],
  });
  fetchTherapistAvailability.mockResolvedValue([
    { selected_time_slots: { "2026-07-21": slots } },
  ]);
  fetchOccupiedSlots.mockResolvedValue(occupied);
}

/** The Book button sits next to the slot label rather than containing it. */
const slotButton = (label) => {
  const span = screen.queryAllByText(label).find((el) => el.tagName === "SPAN");
  return span?.closest("div")?.querySelector("button") ?? undefined;
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.stubGlobal("alert", vi.fn());
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => ({ message: "Appointment request sent successfully!" }) }))
  );
});

describe("booked slots are not offered (item 1)", () => {
  // The real production case: a confirmed 30-minute booking at 08:00 inside the
  // therapist's own 08:00-09:00 slot. Key-matching missed it and left it clickable.
  it("disables a slot that a shorter booking overlaps", async () => {
    arrange({
      occupied: { "2026-07-21": [{ start: "08:00", end: "08:30", status: "confirmed" }] },
    });
    render(<TherapistDetail />);

    await waitFor(() => expect(slotButton("08:00-09:00")).toBeTruthy());
    expect(slotButton("08:00-09:00").disabled).toBe(true);
  });

  it("leaves untouched slots bookable", async () => {
    arrange({
      occupied: { "2026-07-21": [{ start: "08:00", end: "08:30", status: "confirmed" }] },
    });
    render(<TherapistDetail />);

    await waitFor(() => expect(slotButton("19:00-20:00")).toBeTruthy());
    expect(slotButton("19:00-20:00").disabled).toBe(false);
  });

  it("disables a slot held by a pending request", async () => {
    arrange({
      occupied: { "2026-07-21": [{ start: "19:30", end: "20:00", status: "pending" }] },
    });
    render(<TherapistDetail />);

    await waitFor(() => expect(slotButton("19:00-20:00")).toBeTruthy());
    expect(slotButton("19:00-20:00").disabled).toBe(true);
  });

  it("leaves every slot bookable when nothing is booked", async () => {
    arrange({ occupied: {} });
    render(<TherapistDetail />);

    await waitFor(() => expect(slotButton("08:00-09:00")).toBeTruthy());
    expect(slotButton("08:00-09:00").disabled).toBe(false);
    expect(slotButton("19:00-20:00").disabled).toBe(false);
  });

  it("survives the older keyed-object response without crashing", async () => {
    // Guards a frontend-first deploy against the previous API shape.
    arrange({ occupied: { "2026-07-21": { "08:00-08:30": "confirmed" } } });
    render(<TherapistDetail />);

    await waitFor(() => expect(slotButton("08:00-09:00")).toBeTruthy());
    expect(slotButton("08:00-09:00").disabled).toBe(false);
  });
});

describe("booking payload (item 2)", () => {
  async function bookFirstSlot() {
    render(<TherapistDetail />);
    await waitFor(() => expect(slotButton("19:00-20:00")).toBeTruthy());
    await userEvent.click(slotButton("19:00-20:00"));

    // Questionnaire: both questions are radio groups.
    await userEvent.click(document.querySelector('input[name="primaryConcern"][value="Anxiety"]'));
    await userEvent.click(document.querySelector('input[name="attendedBefore"][value="yes"]'));
    await userEvent.click(screen.getByText("therapist.submitBook"));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    return JSON.parse(fetch.mock.calls.at(-1)[1].body);
  }

  it("no longer sends a hardcoded 30-minute duration", async () => {
    arrange({ sessionDuration: 60 });

    const body = await bookFirstSlot();

    // The server derives the length from the therapist record now.
    expect(body.session_duration).toBeUndefined();
  });

  it("sends the slot's start time in UK time", async () => {
    arrange({ sessionDuration: 60 });

    const body = await bookFirstSlot();

    expect(new Date(body.scheduled_at).toISOString()).toBe("2026-07-21T18:00:00.000Z");
    expect(body.therapist_id).toBe("t1");
  });
});
