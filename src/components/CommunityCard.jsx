import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Users, Shield, Calendar, Lock, Globe } from "lucide-react";

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

  const isPublic = type === "public";

  return (
    <div className="relative bg-white/20 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-white/30 hover:border-amber-400 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">

      {/* Top colour band */}
      <div className={`h-2 w-full ${isPublic ? "bg-emerald-400" : "bg-blue-400"}`} />

      <div className="p-6">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-2xl font-bold text-gray-900 leading-tight">{name}</h3>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold rounded-full flex-shrink-0 border-2 ${
            isPublic
              ? "bg-emerald-100 text-emerald-700 border-emerald-300"
              : "bg-blue-100 text-blue-700 border-blue-300"
          }`}>
            {isPublic
              ? <><Globe className="w-4 h-4" />{t('community.public')}</>
              : <><Lock className="w-4 h-4" />{t('community.private')}</>
            }
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-base leading-relaxed mb-5 line-clamp-2">
          {description}
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-gray-600 mb-5">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-amber-500" />
            {members.length} {t('community.membersCount')}
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-500" />
            {moderators.length} {t('community.moderatorsCount')}
          </span>
          {createdAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
              {t('community.created')}: {new Date(createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* View button */}
        <Link
          to={`/communities/${_id}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-base rounded-xl border-2 border-amber-500 hover:border-amber-600 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {t('community.view')} →
        </Link>
      </div>
    </div>
  );
}
