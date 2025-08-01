// pages/MyProfile.jsx
import React, { useEffect, useState,useMemo } from 'react';
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import ProfileEditModal from '../components/ProfileEditModal';

export default function MyProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Logged-in user
  const currentUser = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);
  const isOwnProfile = currentUser.id === userId;

  const outletContext = useMemo(
       () => ({ userId, isOwnProfile }),
       [userId, isOwnProfile]
     );

  // Profile user data (fetched via ?ids= endpoint)
  const [profileUser, setProfileUser] = useState(null);

  // Stats state
  const [stats, setStats] = useState({
    posts: 0,
    journals: 0,
    communities: 0,
    habits: 0,
  });

  // Edit-modal state
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    async function fetchData() {
      try {
        // 1) Fetch profile user via GET /users?ids=
        const uRes = await fetch(
          `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//users?ids=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const usersArr = await uRes.json();
        const userData = Array.isArray(usersArr) ? usersArr[0] : null;
        console.log(userData)
        setProfileUser(userData);

        // 2) Fetch posts count
        const pRes = await fetch(
          `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//posts/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const posts = await pRes.json();

        // 3) Conditionally fetch journals, communities, habits
        let journals = [], communities = [], habits = [];
        if (isOwnProfile) {
          const [jRes, cRes, hRes] = await Promise.all([
            fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//journals?userId=${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//users/${userId}/communities`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//habits?userId=${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          journals   = await jRes.json();
          communities = await cRes.json();
          habits     = await hRes.json();
        }

        console.log("communities",profileUser)
        // 4) Set stats
        setStats({
          posts:       Array.isArray(posts) ? posts.length : 0,
          journals:    Array.isArray(journals) ? journals.length : 0,
          communities: Array.isArray(communities) ? communities.length : 0,
          habits:      Array.isArray(habits) ? habits.length : 0,
        });
      } catch (err) {
        console.error('Error loading profile data:', err);
      }
    }

    fetchData();
  }, [userId, isOwnProfile]);

  // Build tabs dynamically
  const tabs = [{ label: 'Posts', to: 'posts' }];
  if (isOwnProfile) {
    tabs.push(
      { label: 'Journals', to: 'journals' },
      { label: 'Communities', to: 'communities' },
      { label: 'Habits', to: 'habits' }
    );
  }

  console.log("statistics", stats)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <ProfileHeader
        user={profileUser}
        stats={stats}
        isOwnProfile={isOwnProfile}
        onEdit={() => setShowEdit(true)}
      />

      <nav className="mb-8 flex space-x-6 border-b border-gray-200 pb-2">
        {tabs.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `font-medium pb-1 ${
                isActive
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'border-b-2 border-transparent text-white/80 hover:text-emerald-600 hover:border-emerald-600'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Renders the matching sub-route: Posts, Journals, etc. */}
      <Outlet context={{ userId, isOwnProfile }} />

      {showEdit && (
        <ProfileEditModal
          userId={userId}
          onClose={() => setShowEdit(false)}
          onSaved={() => {
            setShowEdit(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
