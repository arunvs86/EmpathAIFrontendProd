// frontend/src/pages/ChatList.jsx
import React, { useEffect, useState } from "react";
import { getUserChats } from "../services/chatApi";
import ChatCard from "../components/ChatCard";
import { useUnreadChats } from "../contexts/UnreadChatsContext";

function ChatList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { unreadChats } = useUnreadChats();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");
        const data = await getUserChats();
        setChats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) return <p className="p-4">Loading chats...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (chats.length === 0) {
    return <p className="p-4 text-gray-600">No chats available.</p>;
  }

  return (
    <div className="min-h-screen bg-white/10 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-white/90 mb-8">
          Your Chats
        </h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {chats.map(chat => (
          <ChatCard
            key={chat._id}
            chat={chat}
            unread={!!unreadChats[chat._id]}
          />
        ))}
        </div>
      </div>
    </div>
  );
}

export default ChatList;
