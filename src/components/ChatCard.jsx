import React from "react";
import { useNavigate } from "react-router-dom";


function ChatCard({ chat, currentUserId }) {
  const navigate = useNavigate();

  // Filter out the current user to get the "other" participant.
  // We assume chat.participants is already enriched to be an array of objects
  // like { id, username, profile_picture }
  const otherParticipant =
    chat.participants.find((p) => p.id !== currentUserId) || { username: "Unknown" };

  return (
    <div
      onClick={() => navigate(`/chats/${chat._id}`)}
      className="bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow w-full"
    >
      <div className="flex items-center space-x-3">
        {/* Avatar for the other participant */}
        <img
          src={otherParticipant.profile_picture || "/assets/avatar.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          {/* Make sure we render a string (username) not the object */}
          <h3 className="text-sm font-bold text-gray-800">
            {otherParticipant.username}
          </h3>
          {/* Render last message if it is a string */}
          {typeof chat.lastMessage === "string" && chat.lastMessage && (
            <p className="text-xs text-gray-600 truncate max-w-xs">
              {chat.lastMessage}
            </p>
          )}
        </div>
      </div>
      {chat.lastMessageAt && (
        <p className="text-xs text-gray-500 mt-2">
          {new Date(chat.lastMessageAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default ChatCard;
