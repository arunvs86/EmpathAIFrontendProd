// // components/CommunityList.jsx
// import React, { useState, useEffect } from "react";
// import CommunityCard from "./CommunityCard";
// import { useNavigate, useOutletContext, useLocation } from "react-router-dom";

// export default function CommunityList({ onCreateCommunity, onSelectCommunity }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   // If we're under the profile outlet, parent passed [userId, isOwnProfile] via Outlet context
//   const ctx = useOutletContext() || {};
//   const { userId, isOwnProfile } = ctx;

//   const [communities, setCommunities] = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [error, setError]           = useState("");
//   const [search, setSearch]         = useState("");
//   const [filter, setFilter]         = useState("all");

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         let url;
//         // if we're on profile/:userId/communities and it's the user's own profile
//         if (location.pathname.match(/^\/profile\/[^/]+\/communities/) && isOwnProfile) {
//           url = `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/users/${userId}/communities`;
//         } else {
//           url = "https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities";
//         }
//         const res = await fetch(url, {
//           headers: token ? { Authorization: `Bearer ${token}` } : undefined
//         });
//         if (!res.ok) {
//           const body = await res.json();
//           throw new Error(body.error || "Failed to fetch");
//         }
//         setCommunities(await res.json());
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [location.pathname, userId, isOwnProfile]);

//   const visible = communities
//     .filter(c =>
//       c.name.toLowerCase().includes(search.toLowerCase()) ||
//       c.description.toLowerCase().includes(search.toLowerCase())
//     )
//     .filter(c =>
//       filter === "all" ? true : c.type === filter
//     );

//   if (loading) return <p className="text-center text-gray-300">Loading communities…</p>;
//   if (error)   return <p className="text-center text-red-400">{error}</p>;

//   return (
//     <div className="space-y-8">
//       {/* Search & Controls */}
//       <div className="flex flex-wrap items-center gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search communities…"
//           className="flex-1 min-w-[200px] bg-white/20 placeholder-white/70 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//         />

//         <select
//           className="bg-white/20 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
//           value={filter}
//           onChange={e => setFilter(e.target.value)}
//         >
//           <option value="all">All types</option>
//           <option value="public">Public only</option>
//           <option value="private">Private only</option>
//         </select>

//         <button
//           onClick={() => navigate('/communities/create')}
//           className="bg-white/20 hover:bg-emerald-600 text-white font-semibold px-5 py-2 rounded-full transition"
//         >
//           + New Community
//         </button>
//       </div>

//       {/* List */}
//       {visible.length === 0 ? (
//         <p className="text-center text-gray-300">
//           {isOwnProfile && location.pathname.includes('/communities')
//             ? "You’re not a member of any communities yet."
//             : "No communities found."}
//         </p>
//       ) : (
//         <div className="space-y-6">
//           {visible.map(comm => (
//             <CommunityCard
//               key={comm._id}
//               community={comm}
//               onView={onSelectCommunity}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// components/CommunityList.jsx
import React, { useState, useEffect } from "react";
import CommunityCard from "./CommunityCard";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";

export default function CommunityList({ onCreateCommunity, onSelectCommunity }) {
  const navigate = useNavigate();
  const location = useLocation();
  // If we're under the profile outlet, parent passed [userId, isOwnProfile] via Outlet context
  const ctx = useOutletContext() || {};
  const { userId, isOwnProfile } = ctx;

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("all");

  // === Pin config ===
  // If you know the exact _id, put it here for a guaranteed match:
  const PINNED_COMMUNITY_ID = ""; // e.g., "66f1a8e9c3a2b8..."  (leave empty to ignore)
  const PINNED_COMMUNITY_NAME = "EmpathAI Community"; // fallback by name (case-insensitive)

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let url;
        // If we're on profile/:userId/communities and it's the user's own profile
        if (location.pathname.match(/^\/profile\/[^/]+\/communities/) && isOwnProfile) {
          url = `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/users/${userId}/communities`;
        } else {
          url = "https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities";
        }
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || "Failed to fetch");
        }
        setCommunities(await res.json());
      } catch (err) {
        setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    })();
  }, [location.pathname, userId, isOwnProfile]);

  const visible = communities
    .filter(c => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        c.name?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    })
    .filter(c => (filter === "all" ? true : c.type === filter));

  // --- Pin EmpathAI Community to the top ---
  const pinMatch = (c) => {
    if (PINNED_COMMUNITY_ID && c._id === PINNED_COMMUNITY_ID) return true;
    if (!PINNED_COMMUNITY_ID && PINNED_COMMUNITY_NAME) {
      return (c.name || "").trim().toLowerCase() === PINNED_COMMUNITY_NAME.trim().toLowerCase();
    }
    return false;
  };

  const pinned = visible.filter(pinMatch);
  const others = visible.filter(c => !pinMatch(c));
  const ordered = [...pinned, ...others];
  // -----------------------------------------

  if (loading) return <p className="text-center text-gray-300">Loading communities…</p>;
  if (error)   return <p className="text-center text-red-400">{error}</p>;

  return (
    <div className="space-y-8">
      {/* Search & Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search communities…"
          className="flex-1 min-w-[200px] bg-white/20 placeholder-white/70 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="bg-white/20 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="public">Public only</option>
          <option value="private">Private only</option>
        </select>

        <button
          onClick={() => navigate('/communities/create')}
          className="bg-white/20 hover:bg-emerald-600 text-white font-semibold px-5 py-2 rounded-full transition"
        >
          + New Community
        </button>
      </div>

      {/* List */}
      {ordered.length === 0 ? (
        <p className="text-center text-gray-300">
          {isOwnProfile && location.pathname.includes('/communities')
            ? "You’re not a member of any communities yet."
            : "No communities found."}
        </p>
      ) : (
        <div className="space-y-6">
          {ordered.map(comm => (
            <CommunityCard
              key={comm._id}
              community={comm}
              onView={onSelectCommunity}
            />
          ))}
        </div>
      )}
    </div>
  );
}
