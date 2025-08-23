// import React, { useEffect, useState } from "react";
// import {
//   getTherapistAppointments,
//   cancelAppointment,
//   handleAppointmentDecision,
//   handleRescheduleDecision,
// } from "../services/appointmentApi";
// import AppointmentCard from "../components/AppointmentCard";

// export default function TherapistAppointmentsPage() {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch therapist appointments
//   useEffect(() => {
//     loadAppointments();
//   }, []);

//   async function loadAppointments() {
//     setLoading(true);
//     try {
//       const therapistId = localStorage.getItem("userId"); // adjust if different
//       const data = await getTherapistAppointments(therapistId);
//       setAppointments(data);
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Cancel appointment
//   async function handleCancel(id) {
//     await cancelAppointment(id);
//     setAppointments((prev) =>
//       prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
//     );
//   }

//   // Accept/Reject appointment
//   async function handleDecision(id, decision) {
//     await handleAppointmentDecision(id, decision);
//     setAppointments((prev) =>
//       prev.map((a) =>
//         a.id === id ? { ...a, status: decision === "accept" ? "confirmed" : "rejected" } : a
//       )
//     );
//   }

//   // Accept/Reject reschedule
//   async function handleRescheduleDecisionAction(id, decision) {
//     await handleRescheduleDecision(id, decision);
//     setAppointments((prev) =>
//       prev.map((a) =>
//         a.id === id
//           ? {
//               ...a,
//               status: decision === "accept" ? "confirmed" : "confirmed", // adjust per backend
//             }
//           : a
//       )
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Therapist Appointments</h1>
//       {loading && <p>Loading...</p>}
//       {!loading && appointments.length === 0 && <p>No upcoming appointments.</p>}
//       {appointments.map((appt) => (
//         <AppointmentCard
//           key={appt.id}
//           appointment={appt}
//           role="therapist"
//           onCancel={handleCancel}
//           onDecision={handleDecision}
//           onRescheduleDecision={handleRescheduleDecisionAction}
//         />
//       ))}
//     </div>
//   );
// }


import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTherapistAppointments,
  cancelAppointment,
  handleAppointmentDecision,
  handleRescheduleDecision,
} from "../services/appointmentApi";
import AppointmentCard from "../components/AppointmentCard";

export default function TherapistAppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Auth guard + therapist user id
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const therapistUserId = currentUser?.id;

  useEffect(() => {
    if (!currentUser?.role) return;
    if (currentUser.role !== "therapist") {
      navigate("/"); // only therapists allowed here
    }
  }, [currentUser, navigate]);

  const loadAppointments = useCallback(async () => {
    if (!therapistUserId) return;
    setLoading(true);
    try {
      const data = await getTherapistAppointments(therapistUserId);
      console.log("getTherapistAppointments", data)
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [therapistUserId]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Actions: always refetch after success to avoid drift
  async function onCancel(id) {
    setActionLoadingId(id);
    try {
      await cancelAppointment(id);
      await loadAppointments();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoadingId(null);
    }
  }

  async function onDecision(id, decision) {
    setActionLoadingId(id);
    try {
      await handleAppointmentDecision(id, decision);
      await loadAppointments();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoadingId(null);
    }
  }

  async function onRescheduleDecision(id, decision) {
    setActionLoadingId(id);
    try {
      await handleRescheduleDecision(id, decision);
      await loadAppointments();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Therapist Appointments</h1>
      {loading && <p>Loading...</p>}
      {!loading && appointments.length === 0 && <p>No appointments found.</p>}

      {appointments.map((appt) => (
        <AppointmentCard
          key={appt.id}
          appointment={appt}
          role="therapist"
          onCancel={actionLoadingId === appt.id ? undefined : onCancel}
          onDecision={actionLoadingId === appt.id ? undefined : onDecision}
          onRescheduleDecision={
            actionLoadingId === appt.id ? undefined : onRescheduleDecision
          }
        />
      ))}
    </div>
  );
}
