// frontend/src/pages/LeadTimeDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchLeadTime } from '../services/dashboardApi';

export default function LeadTimeDetail() {
  const [leadTimeData, setLeadTimeData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeadTime()
      .then(data => setLeadTimeData(data))
      .catch(err => {
        console.error('Error loading lead time data:', err);
        setError('Failed to load lead time data');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!leadTimeData) {
    return <p>Loading lead time…</p>;
  }

  const { avgDaysBetweenRequestAndSchedule } = leadTimeData;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Average Lead Time</h2>
      <p className="text-gray-600">
        Average number of days between appointment request and scheduled session.
      </p>

      <div className="bg-white p-8 rounded-2xl shadow flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl font-bold text-emerald-600">
            {avgDaysBetweenRequestAndSchedule.toFixed(1)}
          </p>
          <p className="text-gray-500 mt-2">days</p>
        </div>
      </div>
    </div>
  );
}
