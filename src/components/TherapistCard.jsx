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
    <div onClick={() => navigate(`/therapists/${therapist.id}`)} className="bg-white/10 border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
      <img
        src={avatar}
        alt="Avatar"
        className="w-16 h-16 rounded-full object-cover mb-2"
      />
      <h3 className="font-bold text-lg text-white">{username}</h3>
      <p className="text-sm text-white">
        {t('therapist.specializations')}: {therapist.specialization_tags?.join(", ")}
      </p>
      <p className="text-sm text-white">
        {t('therapist.experience')}: {therapist.experience_years} {t('therapist.yrs')}
      </p>
      <p className="text-sm text-white">
        {t('therapist.languages')}: {therapist.languages_spoken?.join(", ")}
      </p>
      <button
        onClick={() => navigate(`/therapists/${therapist.id}`)}
        className="mt-2 bg-white/30 text-white rounded-4xl px-4 py-2 hover: bg-white/10"
      >
        {t('therapist.viewDetails')}
      </button>
    </div>
  );
}

export default TherapistCard;
