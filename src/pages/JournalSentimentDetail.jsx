// frontend/src/pages/JournalSentimentDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchJournalSentiment } from '../services/dashboardApi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function JournalSentimentDetail() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJournalSentiment()
      .then(raw => {
        // raw: [{ mood: '😃', count: n }, …]
        // transform to { name, value } for recharts
        setData(raw.map(item => ({
          name: item.mood,
          value: item.count
        })));
      })
      .catch(err => {
        console.error('Error loading journal sentiment:', err);
        setError('Failed to load journal sentiment data');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!data.length) {
    return <p>Loading journal sentiment…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Journal Sentiment Distribution</h2>
      <p className="text-gray-600">
        Breakdown of moods logged in user journal entries.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Entries', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="value" fill="#34D399" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
