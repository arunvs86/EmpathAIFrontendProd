import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export default function AvgResponseTimeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="date" />
        <YAxis unit="m" />
        <Tooltip />
        <Bar dataKey="value" name="Median Response (mins)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
