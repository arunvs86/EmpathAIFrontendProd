// frontend/src/services/therapistApi.js
export async function fetchTherapists() {
    const response = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//therapists");
    if (!response.ok) {
      throw new Error("Failed to fetch therapists");
    }
    return response.json();
  }
  
  export async function fetchTherapistById(id) {
    console.log("therapist id", id)
    const response = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//therapists/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch therapist details");
    }
    return response.json();
  }

  export async function fetchTherapistByUserId(id) {
    console.log("therapist id", id)
    const response = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//therapists/therapistByUser/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch therapist details");
    }
    return response.json();
  }

  
  // frontend/src/services/therapistAvailabilityApi.js
export async function fetchTherapistAvailability(therapistId) {
    const response = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//therapists/therapist/${therapistId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch availability");
    }
    return response.json();
  }
  
