// frontend/src/pages/UserDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserDetail, fetchAllUsers } from '../services/dashboardApi';
import MetricCard from '../components/dashboard/MetricCard';

export default function UserDetail() {
  const { userId: paramUserId } = useParams();
  const [selectedUser, setSelectedUser] = useState(paramUserId || '');
  const [users, setUsers] = useState([]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Load all users for the dropdown
  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .catch(err => console.error(err));
  }, []);

  // Load data for the selected user
  useEffect(() => {
    if (!selectedUser) return;
    fetchUserDetail(selectedUser)
      .then(setData)
      .catch(err => {
        console.error(err);
        setError('Could not load user data');
      });
  }, [selectedUser]);

  // Handle dropdown change
  const onUserChange = e => {
    setSelectedUser(e.target.value);
    setData(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* User selector */}
      <div className="flex items-center space-x-4">
        <label htmlFor="userSelect" className="text-lg font-medium">User info:</label>
        <select
          id="userSelect"
          value={selectedUser}
          onChange={onUserChange}
          className="border rounded px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">— Select user —</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.username || u.email}
            </option>
          ))}
        </select>
      </div>

      {/* Error / Loading */}
      {error && <p className="text-red-600">{error}</p>}
      {!data && !error && selectedUser && <p>Loading data…</p>}
      {!selectedUser && <p className="text-gray-500">Please select a user to view details.</p>}

      {/* Metrics Grid */}
      {data && (
        <>
          <h2 className="text-2xl font-semibold">User Detail: {selectedUser}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <MetricCard title="Signup Date"       value={new Date(data.signupDate).toLocaleDateString()} />
            <MetricCard title="Days Since Signup" value={data.daysSinceSignup} />
            <MetricCard title="Total Logins"      value={data.totalLogins} />
            <MetricCard title="Journal Entries"   value={data.totalJournalEntries} />
            <MetricCard
              title="Appointments"
              value={`${data.completedAppointments}/${data.totalAppointments}`}
              subtitle="completed"
            />
            <MetricCard title="Conversations"     value={data.totalConversations} />
            <MetricCard title="Messages Sent"     value={data.totalMessagesSent} />
          </div>
        </>
      )}
    </div>
  );
}
