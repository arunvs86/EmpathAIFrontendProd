// frontend/src/pages/ChatList.jsx
import React, { useEffect, useState } from "react";
import { getUserChats } from "../services/chatApi";
import ChatCard from "../components/ChatCard";
import { useUnreadChats } from "../contexts/UnreadChatsContext";
import { useTranslation } from 'react-i18next';

function ChatList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { unreadChats } = useUnreadChats();
  const { t } = useTranslation();

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

  if (loading) return <p className="p-4">{t('chat.loading')}</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  {console.log("chats", chats)}
  const visibleChats = chats.filter(chat => chat.lastMessage?.trim() !== '');

  if (visibleChats.length === 0) {
    return <p className="p-4 text-white/90">{t('chat.noChats')}</p>;
  }

  return (
    <div className="min-h-screen bg-white/10 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-white/90 mb-8">
          {t('chat.title')}
        </h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {visibleChats.map(chat => (
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
