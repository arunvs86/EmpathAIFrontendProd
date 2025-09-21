// src/pages/TherapistDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  fetchTherapistById,
  fetchTherapistAvailability,
} from "../services/therapistApi";

import { fetchOccupiedSlots } from "../services/appointmentApi";
import { createChat } from "../services/chatApi";

function TherapistDetail() {
  const { id } = useParams();              // therapist PK in route
  const navigate = useNavigate();

  const [therapist, setTherapist] = useState(null);
  const [dates, setDates] = useState([]);        // ["YYYY-MM-DD", ...]
  const [slotsMap, setSlotsMap] = useState({});  // { date: [ "HH:mm-HH:mm", ... ] }
  const [statusMap, setStatusMap] = useState({}); // { date: { slot: "available"|"pending"|"confirmed"|"reschedule_pending" } }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking modal state
  const [bookingCtx, setBookingCtx] = useState(null); // { date, time }
  const [primaryConcern, setPrimaryConcern] = useState("");
  const [attendedBefore, setAttendedBefore] = useState("");
  const [sessionGoals, setSessionGoals] = useState([]);
  const [additionalDetails, setAdditionalDetails] = useState("");

  // ----- Load therapist, availability, and occupied slots (from Appointments) -----
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const tData = await fetchTherapistById(id);
        setTherapist(tData);

        // 1) Fetch availability rows
        let availArr = await fetchTherapistAvailability(id);

        // If API wraps inside .data or returns a single object
        if (availArr && !Array.isArray(availArr)) {
          if (availArr.data && Array.isArray(availArr.data)) {
            availArr = availArr.data;
          } else {
            availArr = [availArr]; // force into array if it's a single object
          }
        }

        // 2) Build { date: Set(slots) }
        const master = {};
        availArr.forEach((rec) => {
          const sm = rec.selected_time_slots || {};
          Object.entries(sm).forEach(([d, slots]) => {
            master[d] = master[d] || new Set();
            (Array.isArray(slots) ? slots : []).forEach((slot) =>
              master[d].add(slot)
            );
          });
        });

        // 3) Convert to { date: [sorted slots] } and sorted dates
        const finalMap = {};
        Object.keys(master).forEach((d) => {
          finalMap[d] = Array.from(master[d]).sort();
        });
        const finalDates = Object.keys(finalMap).sort(
          (a, b) => new Date(a) - new Date(b)
        );
        setSlotsMap(finalMap);
        setDates(finalDates);

        // 4) Pull occupied status from Appointments (source of truth)
        let occMap = {};
        if (finalDates.length > 0) {
          const from = finalDates[0];
          const to = finalDates[finalDates.length - 1];
          try {
            occMap = await fetchOccupiedSlots(id, from, to); // { date: { slot: "pending"/"confirmed"/"reschedule_pending" } }
          } catch (e) {
            // If endpoint not available for some reason, default to {}
            occMap = {};
          }
        }

        // 5) Build statusMap, preferring occupied status; fallback "available"
        const statuses = {};
        for (const d of finalDates) {
          statuses[d] = {};
          for (const slot of finalMap[d]) {
            statuses[d][slot] = (occMap[d] && occMap[d][slot]) || "available";
          }
        }
        setStatusMap(statuses);
      } catch (err) {
        setError(err.message || "Failed to load therapist details");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ----- Helpers -----
  const openQuestionnaire = (date, time) => {
    setBookingCtx({ date, time });
    setPrimaryConcern("");
    setAttendedBefore("");
    setSessionGoals([]);
    setAdditionalDetails("");
  };
  const closeQuestionnaire = () => setBookingCtx(null);
  const toggleGoal = (goal) =>
    setSessionGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );

  // ----- Submit booking -----
  const submitBooking = async () => {
    if (!bookingCtx) return;
    if (!primaryConcern || !attendedBefore) {
      alert("Please answer all required questions.");
      return;
    }

    const { date, time } = bookingCtx;
    const [start] = time.split(/–|-/).map((s) => s.trim());
    const scheduledAt = new Date(`${date}T${start}:00`);
    if (isNaN(scheduledAt)) {
      alert("Invalid date/time.");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      if (!user.id || !token) {
        alert("Please log in to book.");
        return;
      }

      const payload = {
        user_id: user.id,
        therapist_id: therapist.id, // therapist PK
        scheduled_at: scheduledAt.toISOString(),
        session_duration: 30,
        session_type: "video",
        primary_concern: primaryConcern,
        attended_before: attendedBefore === "yes",
        session_goals: sessionGoals,
        additional_details: additionalDetails.trim(),
      };

      const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to book appointment");

      alert(data.message || "Appointment requested!");

      // Update UI immediately: mark this slot as "pending"
      setStatusMap((m) => {
        const next = { ...m };
        if (!next[date]) next[date] = {};
        next[date][time] = "pending";
        return next;
      });

      closeQuestionnaire();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
      // No full page reload; UI already reflects "pending"
    }
  };

  // ----- Chat -----
  const handleMessageClick = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!currentUser.id) {
        alert("Please log in first.");
        return;
      }
      if (therapist.user_id === currentUser.id) {
        alert("You can't message yourself.");
        return;
      }
      const chat = await createChat(therapist.user_id);
      navigate(`/chats/${chat._id}`);
    } catch (err) {
      console.error("Error creating chat:", err);
      alert("Failed to create or retrieve chat.");
    }
  };

  // ----- Render -----
  if (loading) return <p className="p-4">Loading therapist details...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!therapist) return <p className="p-4">Therapist not found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 relative">
      {/* Therapist Info */}
      {console.log("therapist info", therapist)}
      {/* <div className="bg-white/10 shadow-md rounded-md p-6 mb-6 relative">
        <div className="flex items-center gap-4 mb-3">
          {therapist.User?.profile_picture && (
            <img
              src={therapist.User?.profile_picture}
              alt=""
              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-md"
            />
          )}
          <h2 className="text-2xl font-bold text-white">
            {therapist.User?.username}
          </h2>
        </div>

        <button
          onClick={handleMessageClick}
          className="absolute top-4 right-4 bg-white/10 text-white py-1 px-3 rounded-lg text-sm border border-amber-300 hover:bg-white/20 transition"
        >
          Message
        </button>

        <p className="text-sm text-white mb-2">
          Specializations:{" "}
          <span className="text-white">
            {therapist.specialization_tags?.join(", ")}
          </span>
        </p>
        <p className="text-sm text-white mb-2">
          Experience: <span className="text-white">{therapist.experience_years} years</span>
        </p>
        <p className="text-sm text-white">
          License Number: <span className="text-white">{therapist.license_number}</span>
        </p>

        {therapist.link && (
          <a
            href={therapist.link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-28 bg-white/10 text-white py-1 px-3 rounded-lg text-sm border border-amber-300 hover:bg-white/20 transition"
            title="Private practising links"
          >
            Private practising links
          </a>
        )}
        
      </div> */}

{console.log("therapist info", therapist)}
<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-700/30 via-slate-800/40 to-black/40 border border-white/10 shadow-xl mb-6">
  {/* top right actions */}
  <div className="absolute right-4 top-4 flex items-center gap-2">
    {therapist.link && (
      <a
        href={therapist.link}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 rounded-lg text-sm border border-emerald-300/70 bg-white/10 text-white hover:bg-white/20 transition"
        title="Private practising links"
      >
        Private practising links
      </a>
    )}
    <button
      onClick={handleMessageClick}
      className="px-3 py-1 rounded-lg text-sm border border-amber-300/70 bg-white/10 text-white hover:bg-white/20 transition"
    >
      Message
    </button>
  </div>

  <div className="p-6 sm:p-8">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {/* avatar */}
      <div className="relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-2 ring-emerald-400/70 ring-offset-2 ring-offset-slate-900 overflow-hidden shadow-lg bg-slate-700/40">
          {therapist.User?.profile_picture ? (
            <img
              src={therapist.User?.profile_picture}
              alt={`${therapist.User?.username || "Therapist"} avatar`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/70 text-xl">
              {/* simple placeholder — no functional change */}
              <span>👤</span>
            </div>
          )}
        </div>
      </div>

      {/* name + quick facts */}
      <div className="flex-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {therapist.User?.username}
        </h2>

        {/* specialization tags as chips */}
        {Array.isArray(therapist.specialization_tags) && therapist.specialization_tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {therapist.specialization_tags.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="px-2.5 py-1 rounded-full text-xs bg-white/10 text-white border border-white/15"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* meta row */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <div className="text-white/90">
            <span className="text-white/60">Experience:</span>{" "}
            <span className="font-medium text-white">{therapist.experience_years} years</span>
          </div>
          <div className="text-white/90">
            <span className="text-white/60">License No.:</span>{" "}
            <span className="font-medium text-white">{therapist.license_number}</span>
          </div>
          {Array.isArray(therapist.languages_spoken) && therapist.languages_spoken.length > 0 && (
            <div className="text-white/90">
              <span className="text-white/60">Languages:</span>{" "}
              <span className="font-medium text-white">{therapist.languages_spoken.join(", ")}</span>
            </div>
          )}
        </div>

        {/* bio from User if present */}
        {therapist.User?.bio && (
          <p className="mt-4 text-sm leading-6 text-white/90 bg-white/5 border border-white/10 rounded-lg p-3">
            {therapist.User.bio}
          </p>
        )}
      </div>
    </div>
  </div>
</div>



      {/* Availability */}
      <div className="bg-gray/50 shadow-md rounded-md p-6">
        <h3 className="text-xl font-semibold mb-4">Available Slots</h3>

        {dates.length === 0 && (
          <p className="text-white/90">No available dates at the moment.</p>
        )}

        {dates.map((date) => (
          <div key={date} className="mb-6">
            <div className="bg-gray p-2 rounded-md mb-2">
              <h4 className="bg-gray font-medium">
                {new Date(date).getDate() +
                  "-" +
                  (new Date(date).getMonth() + 1) +
                  "-" +
                  new Date(date).getFullYear()}
              </h4>
            </div>

            {(slotsMap[date] || []).length > 0 ? (
              slotsMap[date].map((time, idx) => {
                const status = statusMap[date]?.[time] || "available";
                const disabled = ["confirmed", "pending", "reschedule_pending"].includes(status);
                const label =
                  status === "confirmed"
                    ? "Booked"
                    : status === "pending" || status === "reschedule_pending"
                    ? "Pending"
                    : "Book";

                return (
                  <div
                    key={`${date}-${time}-${idx}`}
                    className="flex items-center justify-between bg-gray border border-gray-200 rounded p-3 mb-2"
                  >
                    <span>{time}</span>
                    <button
                      onClick={() => openQuestionnaire(date, time)}
                      disabled={disabled}
                      className={`px-4 py-1 rounded text-white ${
                        status === "confirmed"
                          ? "bg-red-600 cursor-not-allowed"
                          : status === "pending" || status === "reschedule_pending"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {label}
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No time slots for this date.</p>
            )}
          </div>
        ))}
      </div>

      {/* Questionnaire Modal */}
      {bookingCtx && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-gray-500 rounded-lg p-6 w-11/12 max-w-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Before We Book…</h3>

            {/* Q1 */}
            <div className="mb-4">
              <p className="font-medium mb-2">1. Primary concern:</p>
              {["Anxiety", "Depression", "Stress", "Relationship", "Other"].map(
                (opt) => (
                  <label key={opt} className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      name="primaryConcern"
                      value={opt}
                      checked={primaryConcern === opt}
                      onChange={() => setPrimaryConcern(opt)}
                      className="mr-1"
                    />
                    {opt}
                  </label>
                )
              )}
            </div>

            {/* Q2 */}
            <div className="mb-4">
              <p className="font-medium mb-2">2. Have you attended therapy before?</p>
              {["yes", "no"].map((opt) => (
                <label key={opt} className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="attendedBefore"
                    value={opt}
                    checked={attendedBefore === opt}
                    onChange={() => setAttendedBefore(opt)}
                    className="mr-1"
                  />
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </label>
              ))}
            </div>

            {/* Q3 */}
            <div className="mb-4">
              <p className="font-medium mb-2">3. What are your session goals? (check all that apply)</p>
              {["Coping strategies", "Improve sleep", "Stress management", "Self-esteem"].map(
                (goal) => (
                  <label key={goal} className="block">
                    <input
                      type="checkbox"
                      value={goal}
                      checked={sessionGoals.includes(goal)}
                      onChange={() => toggleGoal(goal)}
                      className="mr-2"
                    />
                    {goal}
                  </label>
                )
              )}
            </div>

            {/* Q4 */}
            <div className="mb-4">
              <p className="font-medium mb-2">4. Additional details (optional):</p>
              <textarea
                rows={3}
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Any other context you'd like the therapist to know?"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeQuestionnaire}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={submitBooking}
                disabled={loading}
                className={`px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Booking…" : "Submit & Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TherapistDetail;
