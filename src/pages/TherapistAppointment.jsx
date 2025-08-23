// frontend/src/pages/TherapistAppointments.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getTherapistAppointments,
  handleAppointmentDecision,
  cancelAppointment,
  handleRescheduleDecision,
} from '../services/appointmentApi';

function TherapistAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Only allow therapists to access this page
    if (currentUser.role !== 'therapist') {
      navigate('/');
      return;
    }
    const fetchData = async () => {
      try {
        const data = await getTherapistAppointments(currentUser.id);
        setAppointments(data);
        console.log("appointmentsData", data)
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [currentUser, navigate]);

  // Handler for approving/rejecting an appointment
  const onDecision = async (appointmentId, decision) => {
    try {
      await handleAppointmentDecision(appointmentId, decision);
      // Update the appointment status in state
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId
            ? { ...appt, status: decision === 'accept' ? 'confirmed' : 'rejected' }
            : appt
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Handler for canceling an appointment
  const onCancel = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      // Remove the appointment from the list
      setAppointments((prev) => prev.filter((appt) => appt.id !== appointmentId));
    } catch (err) {
      alert(err.message);
    }
  };

  // Handler for reschedule decision (therapist approves or rejects a reschedule request)
  const onRescheduleDecision = async (appointmentId, decision) => {
    try {
      await handleRescheduleDecision(appointmentId, decision);
      // After handling, update the status back to "confirmed" if accepted,
      // or leave it as confirmed if rejected (or show a message if needed).
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: 'confirmed' } : appt
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Appointments</h2>
      {error && <p className="text-red-600">{error}</p>}
      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
            >
              <p className="font-bold text-gray-800">
                Patient: {appt.patientName || "Unknown"}
              </p>
              <p className="text-sm text-gray-600">
                Scheduled at: {new Date(appt.scheduled_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Session Type: {appt.session_type}
              </p>
              <p className="text-sm text-gray-600">Status: {appt.status}</p>
              {appt.notes && (
                <p className="mt-2 text-sm text-gray-700">Notes: {appt.notes}</p>
              )}
              {/* Action Buttons */}
              <div className="mt-3 flex space-x-2">
                {appt.status === "pending" && (
                  <>
                    <button
                      onClick={() => onDecision(appt.id, "accept")}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onDecision(appt.id, "reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                {(appt.status === "pending" || appt.status === "confirmed") && (
                  <button
                    onClick={() => onCancel(appt.id)}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                )}
                {appt.status === "reschedule_pending" && (
                  <>
                    <button
                      onClick={() => onRescheduleDecision(appt.id, "accept")}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Accept Reschedule
                    </button>
                    <button
                      onClick={() => onRescheduleDecision(appt.id, "reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Reject Reschedule
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TherapistAppointments;
