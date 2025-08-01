// frontend/src/pages/JournalTagsDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchJournalTags } from '../services/dashboardApi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function JournalTagsDetail() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJournalTags()
      .then(raw => {
        // raw: [{ tag: 'self-care', count: n }, …]
        setData(raw.map(item => ({
          tag: item.tag,
          count: item.count
        })));
      })
      .catch(err => {
        console.error('Error loading journal tags:', err);
        setError('Failed to load journal tags data');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!data.length) {
    return <p>Loading journal tags…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Top Journal Tags</h2>
      <p className="text-gray-600">
        Most frequently used tags in journal entries.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="tag" />
            <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="count" fill="#34D399" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
