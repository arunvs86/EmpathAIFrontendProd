// frontend/src/services/therapistApi.js
export async function fetchTherapists() {
    const response = await fetch("https://empathaiv2-backend.onrender.com/therapists");
    if (!response.ok) {
      throw new Error("Failed to fetch therapists");
    }
    return response.json();
  }
  
  export async function fetchTherapistById(id) {
    console.log("therapist id", id)
    const response = await fetch(`https://empathaiv2-backend.onrender.com/therapists/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch therapist details");
    }
    return response.json();
  }

  export async function fetchTherapistByUserId(id) {
    console.log("therapist id", id)
    const response = await fetch(`https://empathaiv2-backend.onrender.com/therapists/therapistByUser/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch therapist details");
    }
    return response.json();
  }

  
  // frontend/src/services/therapistAvailabilityApi.js
export async function fetchTherapistAvailability(therapistId) {
    const response = await fetch(`https://empathaiv2-backend.onrender.com/therapists/therapist/${therapistId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch availability");
    }
    return response.json();
  }
  
