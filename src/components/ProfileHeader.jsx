import React from 'react';

export default function ProfileHeader({ stats = {} }) {
  const stored = localStorage.getItem('user') || '{}';
  const user = JSON.parse(stored);
  const {
    username = 'Anonymous',
    profile_picture,
    bio = 'No bio provided.',
  } = user;

  const {
    posts = 0,
    journals = 0,
    communities = 0,
    habits = 0,
  } = stats;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 flex flex-col md:flex-row items-center md:items-start">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={profile_picture || '/assets/avatar.png'}
          alt="Your avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-emerald-200 shadow-md"
        />
      </div>

      {/* Name & Bio */}
      <div className="mt-6 md:mt-0 md:ml-8 flex-1">
        <h1 className="text-3xl font-bold text-gray-900">{username}</h1>
        <p className="mt-2 text-gray-600 leading-relaxed max-w-xl">{bio}</p>

        {/* Stats row */}
        <div className="mt-6 flex flex-wrap gap-4">
          {[
            { label: 'Posts', value: posts },
            { label: 'Journals', value: journals },
            { label: 'Communities', value: communities },
            { label: 'Habits', value: habits },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-gray-50 px-4 py-2 rounded-lg shadow-sm hover:shadow-md flex items-center transition"
            >
              <span className="text-xl font-semibold text-emerald-600 mr-2">
                {value}
              </span>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit button */}
      <div className="mt-6 md:mt-0 md:ml-8">
        <button
          onClick={() => console.log('Navigate to Edit Profile')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full shadow-md transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
