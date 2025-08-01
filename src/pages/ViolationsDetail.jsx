// frontend/src/pages/ViolationsDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchViolationStats } from '../services/dashboardApi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function ViolationsDetail() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchViolationStats()
      .then(data => setStats(data))
      .catch(err => {
        console.error('Error loading violation stats:', err);
        setError('Failed to load violation statistics');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!stats) {
    return <p>Loading violation statistics…</p>;
  }

  const { totalReported, totalResolved, majorCount, minorCount } = stats;

  const chartData = [
    { category: 'Resolved', count: totalResolved },
    { category: 'Unresolved', count: totalReported - totalResolved },
    { category: 'Major', count: majorCount },
    { category: 'Minor', count: minorCount },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">User Violations Overview</h2>
      <p className="text-gray-600">
        Summary of reported user violations: resolved vs unresolved and severity breakdown.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="category" />
            <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="count" fill="#34D399" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
);
}
