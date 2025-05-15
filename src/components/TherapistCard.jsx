// frontend/src/components/TherapistCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function TherapistCard({ therapist }) {
  const navigate = useNavigate();
  const username = therapist.User?.username || "Therapist";
  const avatar = therapist.User?.profile_picture || "/assets/avatar.png";

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
      <img
        src={avatar}
        alt="Avatar"
        className="w-16 h-16 rounded-full object-cover mb-2"
      />
      <h3 className="font-bold text-lg text-gray-800">{username}</h3>
      <p className="text-sm text-gray-600">
        Specializations: {therapist.specialization_tags?.join(", ")}
      </p>
      <p className="text-sm text-gray-600">
        Experience: {therapist.experience_years} yrs
      </p>
      <p className="text-sm text-gray-600">
        Languages: {therapist.languages_spoken?.join(", ")}
      </p>
      <button
        onClick={() => navigate(`/therapists/${therapist.id}`)}
        className="mt-2 text-emerald-600 hover:underline text-sm"
      >
        View Details
      </button>
    </div>
  );
}

export default TherapistCard;
