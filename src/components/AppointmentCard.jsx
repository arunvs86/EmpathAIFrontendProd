// import React, { useState } from "react";
// import { formatUk } from "../utils/datetime";
// import StatusBadge from "./StatusBadge";// import { formatDateTime } from "../services/appointmentApi";
// const formatDateTime = (iso) => new Date(iso).toLocaleString();

// export default function AppointmentCard({
//   appointment,
//   role, // "user" or "therapist"
//   onCancel,
//   onReschedule,
//   onDecision,
//   onRescheduleDecision,
// }) {
//   const [loading, setLoading] = useState(false);

//   const handleClick = async (action, ...args) => {
//     setLoading(true);
//     try {
//       await action(...args);
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const otherPartyName =
//     role === "user"
//       ? appointment.therapist?.username
//       : appointment.user?.username;

//   return (
//     <div className="border rounded-lg p-4 shadow-md bg-white mb-4">
//       <div className="flex justify-between items-center">
//         <div>
//           <h3 className="font-semibold text-lg">{otherPartyName}</h3>
//             <p className="text-gray-600">{formatUk(appointment.scheduled_at)}</p>
//              <div className="mt-1">
//                 <StatusBadge status={appointment.status} />
//               </div>
//         </div>
//         <div className="space-x-2">
//           {/* USER ACTIONS */}
//           {role === "user" && appointment.status !== "cancelled" && (
//             <>
//               <button
//                 onClick={() => handleClick(onCancel, appointment.id)}
//                 disabled={loading}
//                 className="px-3 py-1 bg-red-500 text-white rounded"
//               >
//                 Cancel
//               </button>
//               {appointment.status === "confirmed" && (
//                 <button
//                   onClick={() => {
//                     const newDate = prompt(
//                       "Enter new date/time in ISO format (e.g., 2025-08-15T14:00)"
//                     );
//                     if (newDate) {
//                       handleClick(onReschedule, appointment.id, newDate);
//                     }
//                   }}
//                   disabled={loading}
//                   className="px-3 py-1 bg-yellow-500 text-white rounded"
//                 >
//                   Reschedule
//                 </button>
//               )}
//             </>
//           )}

//           {/* THERAPIST ACTIONS */}
//           {role === "therapist" && (
//             <>
//               {appointment.status === "pending" && (
//                 <>
//                   <button
//                     onClick={() =>
//                       handleClick(onDecision, appointment.id, "accept")
//                     }
//                     disabled={loading}
//                     className="px-3 py-1 bg-green-500 text-white rounded"
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleClick(onDecision, appointment.id, "reject")
//                     }
//                     disabled={loading}
//                     className="px-3 py-1 bg-red-500 text-white rounded"
//                   >
//                     Reject
//                   </button>
//                 </>
//               )}

//               {appointment.status === "confirmed" && (
//                 <button
//                   onClick={() => handleClick(onCancel, appointment.id)}
//                   disabled={loading}
//                   className="px-3 py-1 bg-red-500 text-white rounded"
//                 >
//                   Cancel
//                 </button>
//               )}

//               {appointment.status === "reschedule_pending" && (
//                 <>
//                   <button
//                     onClick={() =>
//                       handleClick(
//                         onRescheduleDecision,
//                         appointment.id,
//                         "accept"
//                       )
//                     }
//                     disabled={loading}
//                     className="px-3 py-1 bg-green-500 text-white rounded"
//                   >
//                     Accept Reschedule
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleClick(
//                         onRescheduleDecision,
//                         appointment.id,
//                         "reject"
//                       )
//                     }
//                     disabled={loading}
//                     className="px-3 py-1 bg-red-500 text-white rounded"
//                   >
//                     Reject Reschedule
//                   </button>
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { formatUk } from "../utils/datetime";
import StatusBadge from "./StatusBadge";

export default function AppointmentCard({
  appointment,
  role, // "user" or "therapist"
  onCancel,
  onReschedule,            // user → (id) => void (opens your reschedule flow/modal)
  onDecision,              // therapist → (id, "accept"|"reject")
  onRescheduleDecision,    // therapist → (id, "accept"|"reject")
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (action, ...args) => {
    if (!action) return;
    setLoading(true);
    try {
      await action(...args);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Prefer server-provided counterpart; fall back to nested objects
  const otherPartyName =
    appointment.counterpart ||
    (role === "user"
      ? appointment.therapist?.username
      : appointment.user?.username) ||
    "Unknown";

  // Status gates (mirror backend)
  const status = appointment.status;
  const canUserReschedule = status === "confirmed";
  const canUserCancel = ["pending", "confirmed", "reschedule_pending"].includes(status);

  const showTherapistAcceptReject = role === "therapist" && status === "pending";
  const showTherapistCancel = role === "therapist" && status === "confirmed";
  const showTherapistRescheduleDecision = role === "therapist" && status === "reschedule_pending";

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white mb-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-semibold text-lg">{otherPartyName}</h3>

          {/* Current time (UK) */}
          <p className="text-gray-700">{formatUk(appointment.scheduled_at)}</p>

          {/* Proposed time (if reschedule pending) */}
          {status === "reschedule_pending" && appointment.proposed_scheduled_at && (
            <p className="text-sm text-blue-700 mt-1">
              Proposed: {formatUk(appointment.proposed_scheduled_at)}
            </p>
          )}

          {/* Status badge */}
          <div className="mt-1">
            <StatusBadge status={status} />
          </div>

          {/* Meet link hint (if present) */}
          {appointment.meet_url && status === "confirmed" && (
            <p className="text-xs text-gray-500 mt-1">
              Meet link will be enabled ~15 minutes before start.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          {/* USER ACTIONS */}
          {role === "user" && status !== "cancelled" && status !== "rejected" && (
            <>
              {canUserReschedule && !!onReschedule && (
                <button
                  onClick={() => handleClick(onReschedule, appointment.id)}
                  disabled={loading}
                  className="px-3 py-1 bg-yellow-600 text-white rounded disabled:opacity-60"
                  title="Request a new time"
                >
                  {loading ? "Working…" : "Reschedule"}
                </button>
              )}

              {canUserCancel && !!onCancel && (
                <button
                  onClick={() => handleClick(onCancel, appointment.id)}
                  disabled={loading}
                  className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-60"
                  title="Cancel this session"
                >
                  {loading ? "Cancelling…" : "Cancel"}
                </button>
              )}
            </>
          )}

          {/* THERAPIST ACTIONS */}
          {role === "therapist" && (
            <>
              {showTherapistAcceptReject && !!onDecision && (
                <>
                  <button
                    onClick={() => handleClick(onDecision, appointment.id, "accept")}
                    disabled={loading}
                    className="px-3 py-1 bg-emerald-600 text-white rounded disabled:opacity-60"
                  >
                    {loading ? "Accepting…" : "Accept"}
                  </button>
                  <button
                    onClick={() => handleClick(onDecision, appointment.id, "reject")}
                    disabled={loading}
                    className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-60"
                  >
                    {loading ? "Rejecting…" : "Reject"}
                  </button>
                </>
              )}

              {showTherapistCancel && !!onCancel && (
                <button
                  onClick={() => handleClick(onCancel, appointment.id)}
                  disabled={loading}
                  className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-60"
                >
                  {loading ? "Cancelling…" : "Cancel"}
                </button>
              )}

              {showTherapistRescheduleDecision && !!onRescheduleDecision && (
                <>
                  <button
                    onClick={() =>
                      handleClick(onRescheduleDecision, appointment.id, "accept")
                    }
                    disabled={loading}
                    className="px-3 py-1 bg-emerald-600 text-white rounded disabled:opacity-60"
                  >
                    {loading ? "Approving…" : "Accept Reschedule"}
                  </button>
                  <button
                    onClick={() =>
                      handleClick(onRescheduleDecision, appointment.id, "reject")
                    }
                    disabled={loading}
                    className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-60"
                  >
                    {loading ? "Rejecting…" : "Reject Reschedule"}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
