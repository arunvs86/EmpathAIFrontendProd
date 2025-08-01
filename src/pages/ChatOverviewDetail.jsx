// frontend/src/pages/ChatOverviewDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchChatOverview } from '../services/dashboardApi';

export default function ChatOverviewDetail() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChatOverview()
      .then(data => setOverview(data))
      .catch(err => {
        console.error('Error loading chat overview:', err);
        setError('Failed to load chat overview');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!overview) {
    return <p>Loading chat overview…</p>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Chat Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">Total Conversations</h3>
          <p className="mt-1 text-2xl font-bold">{overview.totalConvs}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">Avg Messages / Conv</h3>
          <p className="mt-1 text-2xl font-bold">{overview.avgMsgsPerConv}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">Avg Bot Latency (ms)</h3>
          <p className="mt-1 text-2xl font-bold">{overview.avgBotLatencyMs}</p>
        </div>
      </div>
    </div>
  );
}
