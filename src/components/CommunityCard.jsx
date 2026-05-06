import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function CommunityCard({ community }) {
  const { t } = useTranslation();
  const {
    _id,
    name = "Untitled Community",
    description = "No description provided.",
    type = "public",
    members = [],
    moderators = [],
    createdAt,
  } = community;

  const typeBadge =
    type === "public"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="relative bg-white/50 backdrop-blur-md rounded-xl p-6 hover:bg-white/60 transition">
      {/* colored stripe */}
      <div className="absolute top-0 left-0 h-full w-1 bg-blue-400 rounded-tl-xl rounded-bl-xl" />

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${typeBadge}`}>
          {type === "public" ? t('community.public') : t('community.private')}
        </span>
      </div>

      <p className="text-gray-800 text-sm mb-4 leading-relaxed">{description}</p>

      <div className="flex flex-wrap text-xs text-gray-700 mb-4 gap-x-6 gap-y-1">
        <span>{t('community.membersCount')}: {members.length}</span>
        <span>{t('community.moderatorsCount')}: {moderators.length}</span>
        {createdAt && (
          <span>{t('community.created')}: {new Date(createdAt).toLocaleDateString()}</span>
        )}
      </div>

      <div className="flex justify-end">
        <Link
          to={`/communities/${_id}`}
          className="text-emerald-600 hover:underline text-sm font-medium"
        >
          {t('community.view')} →
        </Link>
      </div>
    </div>
  );
}
