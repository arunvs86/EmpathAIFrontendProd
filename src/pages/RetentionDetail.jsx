// frontend/src/pages/RetentionDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchRetentionCohorts } from '../services/dashboardApi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function RetentionDetail() {
  const [cohorts, setCohorts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRetentionCohorts()
      .then(data => {
        // data is [{ date: 'YYYY-MM-DD', retention1d: number }, …]
        setCohorts(data);
      })
      .catch(err => {
        console.error('Error loading retention cohorts:', err);
        setError('Failed to load retention data');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!cohorts.length) {
    return <p>Loading retention cohorts…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">1-Day Retention Cohorts</h2>

      <div className="bg-white p-6 rounded-2xl shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={cohorts}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis
              dataKey="date"
              tickFormatter={date => new Date(date).toLocaleDateString()}
            />
            <YAxis
              label={{ value: 'Retention %', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip
              formatter={val => `${val}%`}
              labelFormatter={label =>
                `Cohort date: ${new Date(label).toLocaleDateString()}`
              }
            />
            <Bar dataKey="retention1d" fill="#34D399" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
