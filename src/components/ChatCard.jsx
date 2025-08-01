// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function ChatCard({ chat, unread }) {
//   const navigate = useNavigate();
//   const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const currentUserId = currentUser.id;

//   const other = chat.participants.find(p => p.id !== currentUserId) || {};
//   const username = other.username || "Chat";

//   return (
//     <div
//       onClick={() => navigate(`/chats/${chat._id}`)}
//       className={`relative bg-white/50 border 
//         ${unread ? "border-emerald-500" : "border-gray-200"} 
//         rounded-md p-4 shadow-sm cursor-pointer hover:shadow-md`}
//     >
//       {unread && (
//         <span className="absolute top-2 right-2 block w-2 h-2 bg-red-500 rounded-full" />
//       )}
//       <div className="flex items-center space-x-3">
//         <img
//           src={other.profile_picture || "/assets/avatar.png"}
//           alt=""
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <div>
//           <h3 className="text-sm text-gray-600 font-bold">{username}</h3>
//           <p className="text-xs text-gray-600 truncate max-w-xs">
//             {chat.lastMessage}
//           </p>
//         </div>
//       </div>
//       <p className="text-xs text-gray-500 mt-2">
//         {new Date(chat.lastMessageAt).toLocaleString()}
//       </p>
//     </div>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChatCard({ chat, unread }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser.id;

  const other = chat.participants.find((p) => p.id !== currentUserId) || {};
  const username = chat.isGroup ? chat.groupName : other.username || "Chat";

  return (
    <div
      onClick={() => navigate(`/chats/${chat._id}`)}
      className={`
        relative bg-white/50
        border ${unread ? "border-emerald-500" : "border-gray-200"}
        rounded-md p-4 shadow-sm cursor-pointer hover:shadow-md
        flex flex-col space-y-2
        max-w-xs
      `}
    >
      {unread && (
        <span className="absolute top-2 right-2 block w-2 h-2 bg-red-500 rounded-full" />
      )}

      <div className="flex items-center space-x-3">
        <img
          src={other.profile_picture || "/assets/avatar.png"}
          alt=""
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          {/* username */}
          <h3 className="text-sm font-bold text-gray-700 truncate">
            {username}
          </h3>
          {/* last message */}
          <p className="text-xs text-gray-600 truncate">
            {chat.lastMessage || "—"}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-1">
        {new Date(chat.lastMessageAt).toLocaleString()}
      </p>
    </div>
  );
}
