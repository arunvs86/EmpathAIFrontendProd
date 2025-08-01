import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MetricCard from '../components/dashboard/MetricCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { fetchAllUsers } from '../services/dashboardApi';

export default function SentimentLiftDetail() {
  const { userId: paramUser } = useParams();
  const [users, setUsers]         = useState([]);
  const [selectedUser, setSelectedUser] = useState(paramUser || '');
  
  // Fabricated data
  const platformData = { avgLift: 0.3 }; // 30%
  const userData = {
    beforeAvg: -0.2, // -20%
    afterAvg:  0.4,  // +40%
    lift:      0.6   // +60%
  };

  useEffect(() => {
    // load users for dropdown
    fetchAllUsers().then(setUsers).catch(console.error);
  }, []);

  const chartDataUser = [
    { label: 'Before', sentiment: userData.beforeAvg * 100 },
    { label: 'After',  sentiment: userData.afterAvg * 100 }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Sentiment Lift</h2>
      <p className="text-gray-600">
        Average change in journal sentiment before vs. after first therapy session.
      </p>

      {/* User selector */}
      <div className="flex items-center space-x-4">
        <label htmlFor="userSelect" className="font-medium">Select user:</label>
        <select
          id="userSelect"
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Platform-wide</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.username || u.email}
            </option>
          ))}
        </select>
      </div>

      {/* Overview */}
      {!selectedUser && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MetricCard
            title="Avg. Sentiment Lift"
            value={`${(platformData.avgLift * 100).toFixed(0)}%`}
            subtitle="platform-wide"
          />
        </div>
      )}

      {/* Per-user detail */}
      {selectedUser && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MetricCard
              title="Before Therapy"
              value={`${(userData.beforeAvg * 100).toFixed(0)}%`}
            />
            <MetricCard
              title="After Therapy"
              value={`${(userData.afterAvg * 100).toFixed(0)}%`}
            />
            <MetricCard
              title="Lift"
              value={`${(userData.lift * 100).toFixed(0)}%`}
              subtitle="post-session change"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataUser} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="label" />
                <YAxis label={{ value: 'Sentiment (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={val => `${val.toFixed(0)}%`} />
                <Bar dataKey="sentiment" fill="#34D399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
