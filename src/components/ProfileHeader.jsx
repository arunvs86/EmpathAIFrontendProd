import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ProfileHeader({
  user: propUser,
  stats = {},
  onEdit,
  isOwnProfile
}) {
  const { t } = useTranslation();

  const stored = localStorage.getItem('user') || '{}';
  const localUser = JSON.parse(stored);

  const user = propUser || localUser;
  const {
    username = 'Anonymous',
    profile_picture,
    bio,
  } = user;

  const {
    posts = 0,
    journals = 0,
    communities = 0,
    habits = 0,
  } = stats;

  const statItems = [
    { label: t('profile.tabPosts'), value: posts },
    ...(isOwnProfile
      ? [
          { label: t('profile.tabJournals'), value: journals },
          { label: t('profile.tabCommunities'), value: communities },
          { label: t('profile.tabHabits'), value: habits },
        ]
      : []),
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 mb-10 flex flex-col md:flex-row items-center md:items-start">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={profile_picture || '/assets/avatar.png'}
          alt={`${username}'s avatar`}
          className="w-28 h-28 rounded-full object-cover border-4 border-amber-400/60 shadow-md cursor-pointer"
        />
      </div>

      {/* Name & Bio */}
      <div className="mt-6 md:mt-0 md:ml-8 flex-1">
        <h1 className="text-3xl font-bold text-white">{username}</h1>
        <p className="mt-2 text-white/70 leading-relaxed max-w-xl">{bio}</p>

        {/* Stats row */}
        <div className="mt-6 flex flex-wrap gap-3">
          {statItems.map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2 transition hover:bg-white/15"
            >
              <span className="text-xl font-semibold text-amber-300">
                {value}
              </span>
              <span className="text-sm text-white/70">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit button (only on own profile) */}
      {isOwnProfile && (
        <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0">
          <button
            onClick={onEdit}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-6 py-2 rounded-full shadow-md transition"
          >
            {t('profile.editTitle')}
          </button>
        </div>
      )}
    </div>
  );
}
