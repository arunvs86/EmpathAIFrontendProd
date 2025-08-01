// frontend/src/pages/SentimentShiftDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchSentimentShift } from '../services/dashboardApi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export default function SentimentShiftDetail() {
  const [shift, setShift] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSentimentShift()
      .then(data => {
        // data should be { before: number, after: number }
        // If your service returns nulls, you may show a placeholder message
        setShift(data);
      })
      .catch(err => {
        console.error('Error loading sentiment shift:', err);
        setError('Failed to load sentiment shift data');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!shift) {
    return <p>Loading sentiment shift…</p>;
  }

  // Prepare data for the bar chart
  const chartData = [
    { label: 'Before Chat', sentiment: shift.before ?? 0 },
    { label: 'After Chat', sentiment: shift.after ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Sentiment Shift</h2>
      <p className="text-gray-600">
        Average user sentiment before vs. after interacting with the chatbot.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="label" />
            <YAxis
              label={{
                value: 'Sentiment Score',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="sentiment" fill="#34D399" name="Avg Sentiment" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
