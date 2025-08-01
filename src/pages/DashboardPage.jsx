// frontend/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import { fetchUserSummary,fetchSentimentLiftAll } from '../services/dashboardApi';
// import { fetchSentimentLiftAll } from '../services/dashboardApi';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserSummary()
      .then(data => setSummary(data))
      .catch(err => {
        console.error('Error loading user summary:', err);
        setError('Failed to load data');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!summary) {
    return <p>Loading dashboard…</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Users"
        value={summary.totalUsers}
        route="users/summary"
      />
      <MetricCard
        title="Active (30d)"
        value={summary.activeUsers}
        subtitle="Users active in last 30 days"
        route="users/summary"
      />
      <MetricCard
        title="DAU"
        value={summary.DAU}
        subtitle="Today’s active users"
        route="users/summary"
      />
      <MetricCard
        title="MAU"
        value={summary.MAU}
        subtitle="Past 30 days"
        route="users/summary"
      />
      <MetricCard
  title="Sentiment Lift"
  value={`${(0.3 * 100).toFixed(0)}%`}     // hardcoded 30%
  subtitle="Avg. post-therapy mood change"
  route="sentiment/lift"
/>
    </div>
  );
}
