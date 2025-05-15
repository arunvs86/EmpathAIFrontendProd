// // src/components/TherapistAvailabilityForm.jsx
// import React, { useState, useMemo, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getTherapistAppointments,
//   handleAppointmentDecision,
// } from "../services/appointmentApi";

// function TherapistAvailabilityForm() {
//   const navigate = useNavigate();

//   // --- Tab state ---
//   const [activeTab, setActiveTab] = useState("availability");

//   // --- Availability states ---
//   const [dateInput, setDateInput] = useState("");
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [timeSlotInputs, setTimeSlotInputs] = useState({});
//   const [timeSlotsMap, setTimeSlotsMap] = useState({});
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // 30‑minute slot options
//   const slotOptions = useMemo(() => {
//     const slots = [];
//     const pad = (n) => String(n).padStart(2, "0");
//     for (let mins = 0; mins < 24 * 60; mins += 30) {
//       const h1 = Math.floor(mins / 60),
//         m1 = mins % 60;
//       const end = mins + 30,
//         h2 = Math.floor(end / 60) % 24,
//         m2 = end % 60;
//       slots.push(`${pad(h1)}:${pad(m1)} – ${pad(h2)}:${pad(m2)}`);
//     }
//     return slots;
//   }, []);

//   // Add date immediately on change
//   const handleDateChange = (e) => {
//     const d = e.target.value;
//     if (d && !selectedDates.includes(d)) {
//       setSelectedDates((arr) => [...arr, d]);
//     }
//     setDateInput("");
//   };

//   // Add a time slot for a date
//   const addTimeSlot = (date) => {
//     const slot = timeSlotInputs[date];
//     if (!slot) return;
//     setTimeSlotsMap((m) => ({
//       ...m,
//       [date]: [...(m[date] || []), slot],
//     }));
//     setTimeSlotInputs((m) => ({ ...m, [date]: "" }));
//   };

//   // Submit availability
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("Not authenticated. Please log in.");
//       return;
//     }
//     try {
//             // build a list of { date, slot } for *every* slot
//       const slotJobs = [];
//       selectedDates.forEach((date) => {
//         (timeSlotsMap[date] || []).forEach((slot) => {
//           slotJobs.push({ date, slot });
//         });
//       });

//       // one API call per slot → one DB row per slot
//       await Promise.all(
//         slotJobs.map(async ({ date, slot }) => {
//           const payload = {
//             selected_dates: [date],
//             selected_time_slots: { [date]: [slot] },
//           };

//           const res = await fetch("https://empathaiv2-backend.onrender.com/therapists", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify(payload),
//           });

//           if (!res.ok) {
//             const err = await res.json();
//             throw new Error(err.error || `Failed on ${date} ${slot}`);
//           }
//           return res.json();
//         })
//       );
 
//        setSuccess("Availability updated successfully!");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // --- Appointments states ---
//   const [appointments, setAppointments] = useState([]);
//   const [loadingApps, setLoadingApps] = useState(false);
//   const [appsError, setAppsError] = useState("");

//   // Fetch pending appointments when tab changes
//   useEffect(() => {
//     if (activeTab !== "appointments") return;
//     const fetchApps = async () => {
//       setLoadingApps(true);
//       setAppsError("");
//       try {
//         const user = JSON.parse(localStorage.getItem("user") || "{}");
//         let data = await getTherapistAppointments(user.id);
//         // only show pending
//         data = data.filter((a) => a.status === "pending");
//         setAppointments(data);
//       } catch (err) {
//         setAppsError(err.message);
//       } finally {
//         setLoadingApps(false);
//       }
//     };
//     fetchApps();
//   }, [activeTab]);

//   // Handle accept/reject
//   const onDecision = async (id, decision) => {
//     try {
//       await handleAppointmentDecision(id, decision);
//       setAppointments((list) => list.filter((a) => a.id !== id));
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-8 p-4">
//       {/* Tabs */}
//       <div className="flex border-b mb-6">
//         {["availability", "appointments"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`flex-1 py-2 text-center ${
//               activeTab === tab
//                 ? "border-b-2 border-emerald-600 font-semibold"
//                 : "text-gray-600"
//             }`}
//           >
//             {tab === "availability" ? "Availability" : "Appointments"}
//           </button>
//         ))}
//       </div>

//       {activeTab === "availability" ? (
//         <form onSubmit={handleSubmit}>
//           {error && <p className="text-red-500 mb-2">{error}</p>}
//           {success && <p className="text-green-600 mb-2">{success}</p>}

//           {/* Date picker */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-1">
//               Add Date
//             </label>
//             <input
//               type="date"
//               value={dateInput}
//               onChange={handleDateChange}
//               className="border px-3 py-2 rounded focus:ring-emerald-400"
//             />
//           </div>

//           {/* Per-date slot lists */}
//           {selectedDates.map((date) => (
//             <div
//               key={date}
//               className="border p-4 rounded mb-4 space-y-3"
//             >
//               <div className="font-medium">{date}</div>
//               <ul className="list-disc ml-5">
//                 {(timeSlotsMap[date] || []).map((slot, idx) => (
//                   <li key={idx}>{slot}</li>
//                 ))}
//               </ul>
//               <div className="flex">
//                 <select
//                   value={timeSlotInputs[date] || ""}
//                   onChange={(e) =>
//                     setTimeSlotInputs((m) => ({
//                       ...m,
//                       [date]: e.target.value,
//                     }))
//                   }
//                   className="border px-3 py-2 rounded-l focus:ring-emerald-400"
//                 >
//                   <option value="" disabled>
//                     Select slot…
//                   </option>
//                   {slotOptions.map((s) => (
//                     <option key={s} value={s}>
//                       {s}
//                     </option>
//                   ))}
//                 </select>
//                 <button
//                   type="button"
//                   onClick={() => addTimeSlot(date)}
//                   className="bg-emerald-600 text-white px-4 py-2 rounded-r"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>
//           ))}

//           <button
//             type="submit"
//             className="w-full bg-emerald-600 text-white py-2 rounded"
//           >
//             Save Availability
//           </button>
//         </form>
//       ) : (
//         <div>
//           {loadingApps && <p>Loading appointments…</p>}
//           {appsError && <p className="text-red-500">{appsError}</p>}
//           {!loadingApps && appointments.length === 0 && (
//             <p>No pending requests.</p>
//           )}
//           {appointments.map((appt) => (
//             <div
//               key={appt.id}
//               className="border p-4 rounded mb-4 flex justify-between"
//             >
//               <div>
//                 <p>
//                   <strong>User:</strong> {appt.User?.username || appt.user_id}
//                 </p>
//                 <p>
//                   <strong>When:</strong>{" "}
//                   {new Date(appt.scheduled_at).toLocaleString()}
//                 </p>
//                 {appt.primary_concern && (
//                   <p>
//                     <strong>Concern:</strong> {appt.primary_concern}
//                   </p>
//                 )}
//                 {/* expand other questionnaire fields as needed */}
//               </div>
//               <div className="space-y-2">
//                 <button
//                   onClick={() => onDecision(appt.id, "accept")}
//                   className="block bg-emerald-600 text-white px-3 py-1 rounded"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => onDecision(appt.id, "reject")}
//                   className="block bg-red-500 text-white px-3 py-1 rounded"
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default TherapistAvailabilityForm;

// src/components/TherapistAvailabilityForm.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTherapistAppointments,
  handleAppointmentDecision,
} from "../services/appointmentApi";
import { fetchTherapistById, fetchTherapistByUserId, fetchTherapistAvailability } from "../services/therapistApi";

function TherapistAvailabilityForm() {
  const navigate = useNavigate();

  // get the logged‑in user (therapist)
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("user",user)
  const therapistId = user.id;

  // --- Tab state ---
  const [activeTab, setActiveTab] = useState("availability");

  // --- Availability states ---
  const [dateInput, setDateInput] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [timeSlotInputs, setTimeSlotInputs] = useState({});
  const [timeSlotsMap, setTimeSlotsMap] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 30‑minute slot options
  const slotOptions = useMemo(() => {
    const slots = [];
    const pad = (n) => String(n).padStart(2, "0");
    for (let mins = 0; mins < 24 * 60; mins += 30) {
      const h1 = Math.floor(mins / 60),
        m1 = mins % 60;
      const end = mins + 30,
        h2 = Math.floor(end / 60) % 24,
        m2 = end % 60;
      slots.push(`${pad(h1)}:${pad(m1)} – ${pad(h2)}:${pad(m2)}`);
    }
    return slots;
  }, []);

  // Load existing availability when “Availability” tab is active
  useEffect(() => {
    if (activeTab !== "availability") return;

    const loadExisting = async () => {
      try {
        console.log("therapist id", therapistId)

        // now passing the logged‑in therapist’s ID
        const tData = await fetchTherapistByUserId(therapistId);
        console.log(tData)
        const availArr = await fetchTherapistAvailability(tData.id);
        console.log("availability", availArr)
        // merge all records into date → Set(slots)
        const master = {};
        availArr.forEach((rec) => {
          const sm = rec.selected_time_slots || {};
          Object.entries(sm).forEach(([date, slots]) => {
            master[date] = master[date] || new Set();
            (Array.isArray(slots) ? slots : []).forEach((slot) =>
              master[date].add(slot)
            );
          });
        });

        // convert to sorted arrays
        const finalMap = {};
        Object.keys(master)
          .sort((a, b) => new Date(a) - new Date(b))
          .forEach((date) => {
            finalMap[date] = Array.from(master[date]).sort();
          });

        setSelectedDates(Object.keys(finalMap));
        setTimeSlotsMap(finalMap);
      } catch (err) {
        console.error("Failed to load availability:", err);
      }
    };

    loadExisting();
  }, [activeTab, therapistId]);

  // Add date immediately on change
  const handleDateChange = (e) => {
    const d = e.target.value;
    if (d && !selectedDates.includes(d)) {
      setSelectedDates((arr) => [...arr, d]);
    }
    setDateInput("");
  };

  // Add a time slot for a date
  const addTimeSlot = (date) => {
    const slot = timeSlotInputs[date];
    if (!slot) return;
    setTimeSlotsMap((m) => ({
      ...m,
      [date]: [...(m[date] || []), slot],
    }));
    setTimeSlotInputs((m) => ({ ...m, [date]: "" }));
  };

  // Submit availability: one slot per API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated. Please log in.");
      return;
    }

    try {
      // flatten to [{date,slot},...]
      const slotJobs = [];
      selectedDates.forEach((date) => {
        (timeSlotsMap[date] || []).forEach((slot) => {
          slotJobs.push({ date, slot });
        });
      });

      // send one POST per slot
      await Promise.all(
        slotJobs.map(async ({ date, slot }) => {
          const payload = {
            selected_dates: [date],
            selected_time_slots: { [date]: [slot] },
          };

          const res = await fetch("https://empathaiv2-backend.onrender.com/therapists", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || `Failed on ${date} ${slot}`);
          }
          return res.json();
        })
      );

      setSuccess("Availability updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Appointments states ---
  const [appointments, setAppointments] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appsError, setAppsError] = useState("");

  // Fetch pending appointments when tab changes
  useEffect(() => {
    if (activeTab !== "appointments") return;
    const fetchApps = async () => {
      setLoadingApps(true);
      setAppsError("");
      try {
        const data = await getTherapistAppointments(therapistId);
        setAppointments(data.filter((a) => a.status === "pending"));
      } catch (err) {
        setAppsError(err.message);
      } finally {
        setLoadingApps(false);
      }
    };
    fetchApps();
  }, [activeTab, therapistId]);

  // Handle accept/reject
  const onDecision = async (id, decision) => {
    try {
      await handleAppointmentDecision(id, decision);
      setAppointments((list) => list.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        {["availability", "appointments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-center ${
              activeTab === tab
                ? "border-b-2 border-emerald-600 font-semibold"
                : "text-gray-600"
            }`}
          >
            {tab === "availability" ? "Availability" : "Appointments"}
          </button>
        ))}
      </div>

      {activeTab === "availability" ? (
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}

          {/* Date picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Add Date
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={handleDateChange}
              className="border px-3 py-2 rounded focus:ring-emerald-400"
            />
          </div>

          {/* Per-date slot lists */}
          {selectedDates.map((date) => (
            <div
              key={date}
              className="border p-4 rounded mb-4 space-y-3"
            >
              <div className="font-medium">{date}</div>
              <ul className="list-disc ml-5">
                {(timeSlotsMap[date] || []).map((slot, idx) => (
                  <li key={idx}>{slot}</li>
                ))}
              </ul>
              <div className="flex">
                <select
                  value={timeSlotInputs[date] || ""}
                  onChange={(e) =>
                    setTimeSlotInputs((m) => ({
                      ...m,
                      [date]: e.target.value,
                    }))
                  }
                  className="border px-3 py-2 rounded-l focus:ring-emerald-400"
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
                  className="bg-emerald-600 text-white px-4 py-2 rounded-r"
                >
                  Add
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded"
          >
            Save Availability
          </button>
        </form>
      ) : (
        <div>
          {loadingApps && <p>Loading appointments…</p>}
          {appsError && <p className="text-red-500">{appsError}</p>}
          {!loadingApps && appointments.length === 0 && (
            <p>No pending requests.</p>
          )}
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="border p-4 rounded mb-4 flex justify-between"
            >
              <div>
                <p>
                  <strong>User:</strong> {appt.User?.username || appt.user_id}
                </p>
                <p>
                  <strong>When:</strong>{" "}
                  {new Date(appt.scheduled_at).toLocaleString()}
                </p>
                {appt.primary_concern && (
                  <p>
                    <strong>Concern:</strong> {appt.primary_concern}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => onDecision(appt.id, "accept")}
                  className="block bg-emerald-600 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => onDecision(appt.id, "reject")}
                  className="block bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
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
