
const BASE_URL = "https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//appointments";

/**
 * Book an appointment.
 * 
 * @param {Object} data - { therapist_id, scheduled_at, session_type, session_duration, ... }
 * @returns {Object} - The booked appointment or an error message
 */
export async function bookAppointment(data) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to book appointment");
  }
  return response.json();
}

/**
 * Approve/Reject an appointment (therapist only)
 * 
 * @param {string} appointmentId 
 * @param {string} decision - "accept" or "reject"
 */
export async function handleAppointmentDecision(appointmentId, decision) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${BASE_URL}/${appointmentId}/decision`,
    {
      method: "PATCH",                         // changed from POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ decision }),
    }
  );
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to handle appointment decision");
  }
  return response.json();
}

/**
 * Cancel an appointment (user or therapist)
 * 
 * @param {string} appointmentId
 */
export async function cancelAppointment(appointmentId) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${BASE_URL}/${appointmentId}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to cancel appointment");
  }
  return response.json();
}

/**
 * Request to reschedule an appointment (user)
 * 
 * @param {string} appointmentId 
 * @param {string} newScheduledAt - new date/time in ISO string
 */
export async function requestReschedule(appointmentId, newScheduledAt) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${BASE_URL}/${appointmentId}/reschedule`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ newScheduledAt }),
    }
  );
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to request reschedule");
  }
  return response.json();
}

/**
 * Approve/Reject reschedule request (therapist only)
 * 
 * @param {string} appointmentId
 * @param {string} decision - "accept" or "reject"
 */
export async function handleRescheduleDecision(appointmentId, decision) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${BASE_URL}/${appointmentId}/reschedule-decision`,
    {
      method: "PATCH",                        // changed from POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ decision }),
    }
  );
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to handle reschedule decision");
  }
  return response.json();
}

/**
 * Fetch all appointments for a given therapist (therapist only)
 * 
 * @param {string} therapistId
 */
export async function getTherapistAppointments(therapistId) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${BASE_URL}/therapist/${therapistId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to fetch therapist appointments");
  }
  return response.json(); // array of appointments
}

// src/services/appointmentApi.js

export async function fetchUpcomingAppointments() {
  const token = localStorage.getItem("token");
  const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//appointments/upcoming", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to load upcoming appointments");
  }
  return res.json(); // expect an array of appointments
}
