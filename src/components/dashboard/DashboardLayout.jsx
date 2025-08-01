// // frontend/src/components/dashboard/DashboardLayout.jsx
// import React from 'react';
// import { NavLink, Outlet } from 'react-router-dom';

// export default function DashboardLayout() {
//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r p-6">
//         <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
//         <nav className="space-y-2">
//           <NavLink
//             to=""
//             end
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Overview
//           </NavLink>
//           {/* 1. User Adoption & Activity */}
//           <NavLink
//             to="users/summary"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             User Summary
//           </NavLink>
//           {/* <NavLink
//             to="users/retention"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Retention Cohorts
//           </NavLink> */}
//           <NavLink
//             to="users/sessions"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Login Patterns
//           </NavLink>

//           {/* 2. Chatbot & Messaging Insights */}
//           <NavLink
//             to="chat/overview"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Chat Overview
//           </NavLink>
//           <NavLink
//             to="chat/sentiment-shift"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Sentiment Shift
//           </NavLink>
//           <NavLink
//             to="chat/media-breakdown"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Media Usage
//           </NavLink>

//           {/* 3. Therapeutic Engagement */}
//           <NavLink
//             to="therapy/funnel"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Therapy Details
//           </NavLink>
//           <NavLink
//             to="therapy/lead-time"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Appointment confirmation Time
//           </NavLink>
//           <NavLink
//             to="therapy/ratings"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Therapist Ratings
//           </NavLink>

//           {/* 4. Journals & Reflection */}
//           <NavLink
//             to="journal/volume"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Journal Volume
//           </NavLink>
//           <NavLink
//             to="journal/sentiment"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Journal Sentiment
//           </NavLink>
//           <NavLink
//             to="journal/tags"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Top Journal Tags
//           </NavLink>

//           {/* 5. Community & Moderation */}
//           <NavLink
//             to="community/posts"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Community Posts
//           </NavLink>
//           <NavLink
//             to="moderation/violations"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Violations Stats
//           </NavLink>
//           <NavLink
//             to="moderation/actions"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Admin Actions
//           </NavLink>

//           {/* 6. Well-being Outcomes */}
//           {/* <NavLink
//             to="mood/trends"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Mood Trends
//           </NavLink>
//           <NavLink
//             to="mood/correlation"
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${isActive
//                 ? 'bg-emerald-100 text-emerald-600'
//                 : 'text-gray-700 hover:bg-gray-100'}`
//             }
//           >
//             Mood Correlation
//           </NavLink> */}
//         </nav>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 bg-gray-50 p-8 overflow-auto">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// frontend/src/components/dashboard/DashboardLayout.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { fetchAllUsers } from '../../services/dashboardApi';

export default function DashboardLayout() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load all users for the dropdown
    fetchAllUsers()
      .then(data => setUsers(data))
      .catch(err => console.error('Failed to load users for selector:', err));
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* User selector */}
        <div className="mb-6">
          <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700">
            Drill into user:
          </label>
          <select
            id="userSelect"
            onChange={e => {
              const uid = e.target.value;
              if (uid) navigate(`/dashboard/users/detail/${uid}`);
              else navigate('/dashboard');
            }}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Users (Overview)</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.username || u.email}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation links */}
        <nav className="space-y-2 flex-1 overflow-auto">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Overview
          </NavLink>

          {/* 1. User Adoption & Activity */}
          <NavLink
            to="users/summary"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            User Summary
          </NavLink>
          <NavLink
            to="users/sessions"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Login Patterns
          </NavLink>

          {/* 2. Chatbot & Messaging Insights */}
          <NavLink
            to="chat/overview"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Chat Overview
          </NavLink>
          <NavLink
            to="chat/sentiment-shift"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Sentiment Shift
          </NavLink>
          <NavLink
            to="chat/media-breakdown"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Media Usage
          </NavLink>

          {/* 3. Therapeutic Engagement */}
          <NavLink
            to="therapy/funnel"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Therapy Details
          </NavLink>
          <NavLink
            to="therapy/lead-time"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Appointment Confirmation Time
          </NavLink>
          <NavLink
            to="therapy/ratings"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Therapist Ratings
          </NavLink>

          {/* 4. Journals & Reflection */}
          <NavLink
            to="journal/volume"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Journal Volume
          </NavLink>
          <NavLink
            to="journal/sentiment"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Journal Sentiment
          </NavLink>
          <NavLink
            to="journal/tags"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Top Journal Tags
          </NavLink>

          {/* 5. Community & Moderation */}
          <NavLink
            to="community/posts"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Community Posts
          </NavLink>
          <NavLink
            to="moderation/violations"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Violations Stats
          </NavLink>
          <NavLink
            to="moderation/actions"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Admin Actions
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
