// frontend/src/components/TherapistCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function TherapistCard({ therapist }) {
  const navigate = useNavigate();
  const username = therapist.User?.username || "Therapist";
  const avatar = therapist.User?.profile_picture || "/assets/avatar.png";

  return (
    <div onClick={() => navigate(`/therapists/${therapist.id}`)} className="bg-white/10 border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
      <img
        src={avatar}
        alt="Avatar"
        className="w-16 h-16 rounded-full object-cover mb-2"
      />
      <h3 className="font-bold text-lg text-white">{username}</h3>
      <p className="text-sm text-white">
        Specializations: {therapist.specialization_tags?.join(", ")}
      </p>
      <p className="text-sm text-white">
        Experience: {therapist.experience_years} yrs
      </p>
      <p className="text-sm text-white">
        Languages: {therapist.languages_spoken?.join(", ")}
      </p>
      <button
        onClick={() => navigate(`/therapists/${therapist.id}`)}
        className="mt-2 bg-white/30 text-white rounded-4xl px-4 py-2 hover: bg-white/10"
      >
        View Details
      </button>
    </div>
  );
}

export default TherapistCard;
