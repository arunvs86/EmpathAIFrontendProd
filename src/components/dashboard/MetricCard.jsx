// frontend/src/components/dashboard/MetricCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MetricCard({ title, value, subtitle, route }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(route)}
      className="cursor-pointer bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
    >
      <h3 className="text-lg font-medium text-gray-600">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}
