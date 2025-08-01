// frontend/src/pages/SessionsDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchLoginPatterns } from '../services/dashboardApi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function SessionsDetail() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLoginPatterns()
      .then(raw => {
        // raw is [{ hour: 0–23, logins }]
        const formatted = raw.map(d => ({
          hour: `${d.hour}:00`,
          logins: d.logins,
        }));
        setData(formatted);
      })
      .catch(err => {
        console.error('Error loading login patterns:', err);
        setError('Failed to load session data');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!data.length) {
    return <p>Loading login patterns…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Login Patterns by Hour</h2>
      <div className="bg-white p-6 rounded-2xl shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="hour" />
            <YAxis label={{ value: 'Logins', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="logins" fill="#34D399" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
