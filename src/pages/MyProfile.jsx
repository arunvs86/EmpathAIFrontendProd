// import React, { useState, useEffect } from 'react';
// import ProfileHeader from '../components/ProfileHeader';

// export default function MyProfile() {
//   const [stats, setStats] = useState({
//     posts: 0,
//     journals: 0,
//     communities: 0,
//     habits: 0,
//   });

//   const user = JSON.parse(localStorage.getItem('user') || '{}');
//   const userId = user.id;

//   useEffect(() => {
//     async function fetchStats() {
//       const token = localStorage.getItem('token');
//       try {
//         // You may adjust endpoints as needed
//         const [pRes, jRes, cRes, hRes] = await Promise.all([
//           fetch(`https://empathaiv2-backend.onrender.com/posts/user/${userId}?page=1&limit=20`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`https://empathaiv2-backend.onrender.com/journals?userId=${userId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`https://empathaiv2-backend.onrender.com/users/${userId}/communities`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//           // fetch(`https://empathaiv2-backend.onrender.com/habits?userId=${userId}`, {
//           //   headers: { Authorization: `Bearer ${token}` },
//           // }),
//         ]);

//         const [posts, journals, communities, habits] = await Promise.all([
//           pRes.json(),
//           jRes.json(),
//           cRes.json()
//           // hRes.json(),
//         ]);

//         setStats({
//           posts: Array.isArray(posts) ? posts.length : 0,
//           journals: Array.isArray(journals) ? journals.length : 0,
//           communities: Array.isArray(communities) ? communities.length : 0
//           // habits: Array.isArray(habits) ? habits.length : 0,
//         });
//       } catch (err) {
//         console.error('Could not load profile stats', err);
//       }
//     }
//     fetchStats();
//   }, [userId]);

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-10">
//       <ProfileHeader stats={stats} />

//       {/* Placeholder for Tabs (you can swap out with a real tab component) */}
//       <div className="mb-8">
//         <nav className="flex space-x-4 border-b border-gray-200 pb-2">
//           {['Posts', 'Journals', 'Communities', 'Habits'].map((tab) => (
//             <button
//               key={tab}
//               className="text-gray-600 hover:text-emerald-600 font-medium pb-1 border-b-2 border-transparent hover:border-emerald-600 transition"
//             >
//               {tab}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* TODO: Render the selected tab’s content here */}
//       <div className="text-center text-gray-400">
//         Select a tab above to view your content.
//       </div>
//     </div>
//   );
// }

// pages/MyProfile.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";

export default function MyProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ posts:0, journals:0, communities:0, habits:0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function fetchStats() {
      try {
        const [pRes, jRes, cRes/*, hRes*/] = await Promise.all([
          fetch(`https://empathaiv2-backend.onrender.com/posts/user/${userId}`, { headers:{Authorization:`Bearer ${token}`}}),
          fetch(`https://empathaiv2-backend.onrender.com/journals?userId=${userId}`, { headers:{Authorization:`Bearer ${token}`}}),
          fetch(`https://empathaiv2-backend.onrender.com/users/${userId}/communities`, { headers:{Authorization:`Bearer ${token}`}}),
          // fetch habits when ready
        ]);
        const [posts, journals, communities/*, habits*/] = await Promise.all([
          pRes.json(), jRes.json(), cRes.json() /*, hRes.json()*/
        ]);
        console.log(posts)
        console.log(journals)
        console.log(communities)

        setStats({
          posts: Array.isArray(posts) ? posts.length : 0,
          journals: Array.isArray(journals) ? journals.length : 0,
          communities: Array.isArray(communities) ? communities.length : 0,
          habits: 0,
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, [userId]);

  // build nav items once
  const tabs = [
    { label:"Posts",      to:"posts" },
    { label:"Journals",   to:"journals" },
    { label:"Communities",to:"communities" },
    { label:"Habits",     to:"habits" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <ProfileHeader stats={stats} />
      <nav className="mb-8 flex space-x-6 border-b border-gray-200 pb-2">
        {tabs.map(({ label, to }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="text-gray-600 hover:text-emerald-600 font-medium pb-1 border-b-2 border-transparent hover:border-emerald-600 transition"
          >
            {label}
          </button>
        ))}
      </nav>

      {/* This renders whichever child route you’re on */}
      <Outlet />
    </div>
  );
}
