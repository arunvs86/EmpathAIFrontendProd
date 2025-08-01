// frontend/src/pages/AdminActionsDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchAdminActions } from '../services/dashboardApi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function AdminActionsDetail() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminActions()
      .then(raw => {
        // raw: { ban_user: n, unban_user: n, remove_post: n, warn_user: n, resolve_violation: n }
        const formatted = Object.entries(raw).map(([actionType, count]) => ({
          actionType,
          count,
        }));
        setData(formatted);
      })
      .catch(err => {
        console.error('Error loading admin actions:', err);
        setError('Failed to load admin action data');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!data.length) {
    return <p>Loading admin actions…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin Actions Breakdown</h2>
      <p className="text-gray-600">
        Counts of different types of administrative actions taken.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="actionType" />
            <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="count" fill="#34D399" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
);
}
