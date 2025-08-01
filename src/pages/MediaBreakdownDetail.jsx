// frontend/src/pages/MediaBreakdownDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchMediaBreakdown } from '../services/dashboardApi';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
} from 'recharts';

export default function MediaBreakdownDetail() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMediaBreakdown()
      .then(raw => {
        // raw is { text: n, image: n, voice: n, video: n }
        const formatted = Object.entries(raw).map(([type, count]) => ({
          type,
          count,
        }));
        setData(formatted);
      })
      .catch(err => {
        console.error('Error loading media breakdown:', err);
        setError('Failed to load media breakdown');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!data.length) {
    return <p>Loading media breakdown…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Media Breakdown</h2>
      <p className="text-gray-600">
        Distribution of message types sent by users.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ type, percent }) =>
                `${type}: ${(percent * 100).toFixed(0)}%`
              }
            />
            <Tooltip formatter={value => `${value}`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
