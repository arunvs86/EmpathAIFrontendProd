// frontend/src/pages/TherapyFunnelDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchAppointmentFunnel } from '../services/dashboardApi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function TherapyFunnelDetail() {
  const [funnel, setFunnel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointmentFunnel()
      .then(data => setFunnel(data))
      .catch(err => {
        console.error('Error loading therapy funnel:', err);
        setError('Failed to load therapy funnel data');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!funnel) {
    return <p>Loading therapy funnel…</p>;
  }

  // Transform { pending, confirmed, completed, cancelled, no_show } into chart array
  const chartData = [
    { status: 'Pending', count: funnel.pending },
    { status: 'Confirmed', count: funnel.confirmed },
    { status: 'Completed', count: funnel.completed },
    { status: 'Cancelled', count: funnel.cancelled },
    { status: 'No Show', count: funnel.no_show },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Therapy Appointment Details</h2>
      <p className="text-gray-600">
        Breakdown of appointment statuses from request through completion.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="status" />
            <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="count" fill="#34D399" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
