// frontend/src/pages/TherapistRatingsDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchTherapistRatings } from '../services/dashboardApi';

export default function TherapistRatingsDetail() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTherapistRatings()
      .then(ratings => setData(ratings))
      .catch(err => {
        console.error('Error loading therapist ratings:', err);
        setError('Failed to load therapist performance data');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!data.length) {
    return <p>Loading therapist performance…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Therapist Performance</h2>
      <p className="text-gray-600">
        Number of sessions and average rating per therapist.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Therapist ID</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Sessions</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Avg Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(({ therapistId, sessions, avgRating }) => (
              <tr key={therapistId}>
                <td className="px-4 py-3 text-sm text-gray-700 font-mono">{therapistId}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{sessions}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{avgRating.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
