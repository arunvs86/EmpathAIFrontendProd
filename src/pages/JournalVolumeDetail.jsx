// frontend/src/pages/JournalVolumeDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchJournalVolume } from '../services/dashboardApi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function JournalVolumeDetail() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJournalVolume()
      .then(raw => {
        // raw: [{ date: 'YYYY-MM-DD', count: number }, …]
        const chartData = raw.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          count: item.count,
        }));
        setData(chartData);
      })
      .catch(err => {
        console.error('Error loading journal volume:', err);
        setError('Failed to load journal volume data');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!data.length) {
    return <p>Loading journal volume…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Journal Entries Over Time</h2>
      <p className="text-gray-600">
        Number of journal entries created each day.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Entries', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#34D399" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
