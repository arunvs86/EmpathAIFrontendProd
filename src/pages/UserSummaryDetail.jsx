// frontend/src/pages/UserSummaryDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchUserSummary, fetchLoginPatterns } from '../services/dashboardApi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function UserSummaryDetail() {
  const [summary, setSummary] = useState(null);
  const [loginData, setLoginData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load overall user summary
    fetchUserSummary()
      .then(data => setSummary(data))
      .catch(err => setError(err.message));

    // Load login patterns by hour
    fetchLoginPatterns()
      .then(data => {
        // transform [{ hour, logins }] → chart items
        const chartData = data.map(d => ({
          hour: `${d.hour}:00`,
          logins: d.logins
        }));
        setLoginData(chartData);
      })
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }
  if (!summary || loginData.length === 0) {
    return <p>Loading user summary…</p>;
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="mt-1 text-2xl font-bold">{summary.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">Active (30d)</h3>
          <p className="mt-1 text-2xl font-bold">{summary.activeUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">DAU (Today)</h3>
          <p className="mt-1 text-2xl font-bold">{summary.DAU}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">MAU (30d)</h3>
          <p className="mt-1 text-2xl font-bold">{summary.MAU}</p>
        </div>
      </div>

      {/* Login Patterns Chart */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Logins by Hour</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={loginData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="logins" stroke="#34D399" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
