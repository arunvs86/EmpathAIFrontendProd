// frontend/src/components/TherapistCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function TherapistCard({ therapist }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const username = therapist.User?.username || "Therapist";
  const avatar = therapist.User?.profile_picture || "/assets/avatar.png";

  return (
    <div
      onClick={() => navigate(`/therapists/${therapist.id}`)}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-md hover:shadow-lg hover:bg-white/15 transition-all duration-200 cursor-pointer"
    >
      <img
        src={avatar}
        alt="Avatar"
        className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-white/20"
      />
      <h3 className="font-bold text-lg text-white mb-1">{username}</h3>
      <p className="text-sm text-white/70 mb-0.5">
        {t('therapist.specializations')}: {therapist.specialization_tags?.join(", ")}
      </p>
      <p className="text-sm text-white/70 mb-0.5">
        {t('therapist.experience')}: {therapist.experience_years} {t('therapist.yrs')}
      </p>
      <p className="text-sm text-white/70 mb-3">
        {t('therapist.languages')}: {therapist.languages_spoken?.join(", ")}
      </p>
      <button
        onClick={(e) => { e.stopPropagation(); navigate(`/therapists/${therapist.id}`); }}
        className="mt-1 bg-amber-400/20 border border-amber-400/50 text-amber-300 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-amber-400/30 transition"
      >
        {t('therapist.viewDetails')}
      </button>
    </div>
  );
}

export default TherapistCard;
