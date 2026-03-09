// frontend/src/services/dashboardApi.js

const BASE_URL = "https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/api/dashboard";

/** 1. User Adoption & Activity */
export async function fetchUserSummary() {
  const res = await fetch(`${BASE_URL}/users/summary`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function fetchRetentionCohorts() {
  const res = await fetch(`${BASE_URL}/users/retention`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  const { cohorts } = await res.json();
  return cohorts;
}

export async function fetchLoginPatterns() {
  const res = await fetch(`${BASE_URL}/users/sessions`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  const { byHour } = await res.json();
  return byHour;
}


export async function fetchAllUsers() {
    const res = await fetch(`${BASE_URL}/users/list`);
    if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
    return res.json();
  }

  
export async function fetchUserDetail(userId) {
    const res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/api/dashboard/users/detail/${userId}`);
    if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
    return res.json();
  }
/** 2. Chatbot & Messaging Insights */
export async function fetchChatOverview() {
  const res = await fetch(`${BASE_URL}/chat/overview`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function fetchSentimentShift() {
  const res = await fetch(`${BASE_URL}/chat/sentiment-shift`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function fetchMediaBreakdown() {
  const res = await fetch(`${BASE_URL}/chat/media-breakdown`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

/** 3. Therapeutic Engagement */
export async function fetchAppointmentFunnel() {
  const res = await fetch(`${BASE_URL}/therapy/funnel`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function fetchLeadTime() {
  const res = await fetch(`${BASE_URL}/therapy/lead-time`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function fetchTherapistRatings() {
  const res = await fetch(`${BASE_URL}/therapy/ratings`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

/** 4. Journals & Reflection */
export async function fetchJournalVolume() {
  const res = await fetch(`${BASE_URL}/journal/volume`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function fetchJournalSentiment() {
  const res = await fetch(`${BASE_URL}/journal/sentiment`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function fetchJournalTags() {
  const res = await fetch(`${BASE_URL}/journal/tags`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

/** 5. Community & Moderation */
export async function fetchCommunityPosts() {
  const res = await fetch(`${BASE_URL}/community/posts`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function fetchViolationStats() {
  const res = await fetch(`${BASE_URL}/moderation/violations`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function fetchAdminActions() {
  const res = await fetch(`${BASE_URL}/moderation/actions`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

/** 6. Well-being Outcomes */
export async function fetchMoodTrends() {
  const res = await fetch(`${BASE_URL}/mood/trends`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function fetchMoodCorrelation() {
  const res = await fetch(`${BASE_URL}/mood/correlation`);
  if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function fetchSentimentLiftAll() {
    const res = await fetch(`${BASE_URL}/sentiment/lift`);
    if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
    return res.json();  // { avgLift: number|null }
  }
  
  /**
   * Fetch a single user’s sentiment lift
   * GET /api/dashboard/sentiment/lift/:userId
   */
  export async function fetchSentimentLift(userId) {
    const res = await fetch(`${BASE_URL}/sentiment/lift/${userId}`);
    if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);
    return res.json(); // { beforeAvg, afterAvg, lift }
  }