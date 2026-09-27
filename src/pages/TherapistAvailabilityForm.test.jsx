import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// t() returns the key so assertions target stable identifiers, not copy.
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
vi.mock("react-router-dom", () => ({ useNavigate: () => vi.fn() }));
vi.mock("../utils/serverMessages", () => ({ translateServerMessage: (m) => m }));
vi.mock("../services/appointmentApi", () => ({
  getTherapistAppointments: vi.fn(async () => []),
  handleAppointmentDecision: vi.fn(async () => ({})),
}));
vi.mock("../services/therapistApi", () => ({
  fetchTherapistByUserId: vi.fn(),
  fetchTherapistById: vi.fn(),
  fetchTherapistAvailability: vi.fn(),
  saveAvailability: vi.fn(async () => ({ message: "Availability updated successfully!" })),
  editAvailabilitySlot: vi.fn(async () => ({})),
  deleteAvailabilitySlot: vi.fn(async () => ({})),
  deleteAvailabilityDate: vi.fn(async () => ({})),
}));

const {
  fetchTherapistByUserId,
  fetchTherapistAvailability,
  saveAvailability,
  editAvailabilitySlot,
} = await import("../services/therapistApi");
const { default: TherapistAvailabilityForm } = await import("./TherapistAvailabilityForm");

function arrange({ sessionDuration = 50, availability = [] } = {}) {
  localStorage.setItem("user", JSON.stringify({ id: "tu1" }));
  fetchTherapistByUserId.mockResolvedValue({ id: "t1", session_duration: sessionDuration });
  fetchTherapistAvailability.mockResolvedValue(availability);
}

/** The "add a slot to this date" dropdown inside a date's card. */
const slotPicker = () => screen.getAllByRole("combobox").at(-1);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("slot dropdown for a 50-minute therapist (item 9)", () => {
  it("offers hour-aligned slots and none of the drifting ones", async () => {
    arrange({ sessionDuration: 50, availability: [{ selected_time_slots: { "2026-10-01": ["09:00-09:50"] } }] });
    render(<TherapistAvailabilityForm />);

    await screen.findByText("2026-10-01");
    const options = within(slotPicker()).getAllByRole("option").map((o) => o.value);

    expect(options).toContain("09:00-09:50");
    expect(options).toContain("10:00-10:50");
    // These are what the old duration-as-step logic produced.
    expect(options).not.toContain("09:10-10:00");
    expect(options).not.toContain("08:20-09:10");
  });

  it("keeps 60-minute therapists on whole hours", async () => {
    arrange({ sessionDuration: 60, availability: [{ selected_time_slots: { "2026-10-01": ["19:00-20:00"] } }] });
    render(<TherapistAvailabilityForm />);

    await screen.findByText("2026-10-01");
    const options = within(slotPicker()).getAllByRole("option").map((o) => o.value);

    expect(options).toContain("09:00-10:00");
    expect(options).toContain("19:00-20:00");
  });
});

describe("adding a slot", () => {
  it("tells the therapist to pick a slot instead of doing nothing", async () => {
    arrange({ availability: [{ selected_time_slots: { "2026-10-01": ["09:00-09:50"] } }] });
    render(<TherapistAvailabilityForm />);
    await screen.findByText("2026-10-01");

    // Previously a bare `return` — no feedback at all.
    await userEvent.click(screen.getByText("avail.add"));

    expect(await screen.findByText("avail.pickSlotFirst")).toBeTruthy();
  });

  it("adds the chosen slot to the date", async () => {
    arrange({ availability: [{ selected_time_slots: { "2026-10-01": ["09:00-09:50"] } }] });
    render(<TherapistAvailabilityForm />);
    await screen.findByText("2026-10-01");

    await userEvent.selectOptions(slotPicker(), "11:00-11:50");
    await userEvent.click(screen.getByText("avail.add"));

    // The text also exists as a dropdown <option>, so look for the rendered chip.
    await waitFor(() =>
      expect(
        screen.getAllByText("11:00-11:50").some((el) => el.tagName === "SPAN")
      ).toBe(true)
    );
  });
});

describe("saving availability — the original silent failure", () => {
  it("refuses to save a date with no slots, and says which date", async () => {
    arrange({ availability: [] });
    render(<TherapistAvailabilityForm />);
    await waitFor(() => expect(fetchTherapistAvailability).toHaveBeenCalled());

    // Add a date but never attach a time slot to it, then save.
    fireEvent.change(document.querySelector('input[type="date"]'), {
      target: { value: "2026-10-20" },
    });

    await screen.findByText("2026-10-20");
    await userEvent.click(screen.getByText("avail.saveAvailability"));

    // The server used to answer "updated successfully" and store nothing.
    expect(await screen.findByText("avail.needSlotForDate")).toBeTruthy();
    expect(saveAvailability).not.toHaveBeenCalled();
  });

  it("saves when every date has at least one slot", async () => {
    arrange({ availability: [{ selected_time_slots: { "2026-10-01": ["09:00-09:50"] } }] });
    render(<TherapistAvailabilityForm />);
    await screen.findByText("2026-10-01");

    await userEvent.click(screen.getByText("avail.saveAvailability"));

    await waitFor(() => expect(saveAvailability).toHaveBeenCalled());
    expect(saveAvailability).toHaveBeenCalledWith({
      selected_dates: ["2026-10-01"],
      selected_time_slots: { "2026-10-01": ["09:00-09:50"] },
      availability_type: "manual",
    });
    expect(await screen.findByText("avail.saved")).toBeTruthy();
  });
});

describe("editing a slot (item 10)", () => {
  // A 30-minute slot stored before the therapist's session length changed.
  const legacySlot = { selected_time_slots: { "2026-10-01": ["10:00-10:30"] } };

  it("shows the stored slot in the edit dropdown even when it is not a current option", async () => {
    arrange({ sessionDuration: 50, availability: [legacySlot] });
    render(<TherapistAvailabilityForm />);
    await screen.findByText("10:00-10:30");

    await userEvent.click(screen.getByTitle("Edit"));

    // Without this the <select> silently displayed a different slot than state held.
    const editSelect = screen.getAllByRole("combobox")[0];
    expect(editSelect.value).toBe("10:00-10:30");
    expect(within(editSelect).getAllByRole("option").map((o) => o.value)).toContain("10:00-10:30");
  });

  it("does not call the API when the slot was not actually changed", async () => {
    arrange({ sessionDuration: 50, availability: [legacySlot] });
    render(<TherapistAvailabilityForm />);
    await screen.findByText("10:00-10:30");

    await userEvent.click(screen.getByTitle("Edit"));
    await userEvent.click(screen.getByText("common.save"));

    // editAvailabilitySlot defaults to cancel_and_delete: a no-op edit would have
    // cancelled real appointments in that window and emailed the clients.
    expect(editAvailabilitySlot).not.toHaveBeenCalled();
  });

  it("calls the API when the slot really changes", async () => {
    arrange({ sessionDuration: 50, availability: [legacySlot] });
    render(<TherapistAvailabilityForm />);
    await screen.findByText("10:00-10:30");

    await userEvent.click(screen.getByTitle("Edit"));
    await userEvent.selectOptions(screen.getAllByRole("combobox")[0], "11:00-11:50");
    await userEvent.click(screen.getByText("common.save"));

    await waitFor(() =>
      expect(editAvailabilitySlot).toHaveBeenCalledWith({
        date: "2026-10-01",
        oldSlot: "10:00-10:30",
        newSlot: "11:00-11:50",
      })
    );
  });
});
