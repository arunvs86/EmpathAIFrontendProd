import React from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function CommunityCard({ community, onView }) {
  const {
    _id,
    name = "Untitled Community",
    description = "No description provided.",
    type = "public",
    members = [],
    moderators = [],
    createdAt,
  } = community;

  // pill classes for type
  const typeBadge =
    type === "public"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";

  const nav = useNavigate();


  return (
    <div className="relative bg-white/50 backdrop-blur-md rounded-xl p-6 hover:bg-white/60 transition">
      <Link
      to={`/communities/${_id}`}
      className="text-emerald-600 hover:underline text-sm font-medium"
    >
      {/* colored stripe */}
      <div className="absolute top-0 left-0 h-full w-1 bg-blue-400 rounded-tr-xl rounded-br-xl" />

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${typeBadge}`}
        >
          {type === "public" ? "Public" : "Private"}
        </span>
      </div>

      <p className="text-gray-800 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap text-xs text-gray-700 mb-4 space-x-6">
        <span>Members: {members.length}</span>
        <span>Moderators: {moderators.length}</span>
        {createdAt && (
          <span>
            Created: {new Date(createdAt).toLocaleDateString()}
          </span>
        )}
        
      </div>
      </Link>
  <div className="flex justify-end">
    <Link
      to={`/communities/${_id}`}
      className="text-emerald-600 hover:underline text-sm font-medium"
    >
      View →
    </Link>
  </div>
    </div>
  );
}
