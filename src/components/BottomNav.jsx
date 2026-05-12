// frontend/src/components/BottomNav.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createChat } from "../services/chatApi";
import { useTranslation } from 'react-i18next';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const getButtonClass = (path) =>
    `flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 transition-all duration-200 text-sm font-bold min-w-[64px] ${
      location.pathname === path
        ? "border-amber-400 bg-amber-400/20 text-amber-300"
        : "border-white/30 bg-white/10 text-white hover:border-amber-400 hover:bg-white/20"
    }`;

  const handleBotChat = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const botId = "c7291129-8ed5-40d6-a504-b96f957ceb88";
    if (!currentUser.id) { alert("Please log in."); return; }
    if (currentUser.id === botId) { alert("Bot cannot message itself."); return; }
    try {
      const chat = await createChat(botId);
      navigate(`/chats/${chat._id}`);
    } catch {
      alert("Failed to open bot chat.");
    }
  };

  return (
    <nav className="h-20 bg-white/10 backdrop-blur-md border-t-2 border-white/20 flex items-center justify-around px-2 shadow-lg gap-2">
      <button onClick={() => navigate("/")} className={getButtonClass("/")}>
        <span className="text-lg">🏠</span>
        <span>Home</span>
      </button>
      <button onClick={() => navigate("/communities")} className={getButtonClass("/communities")}>
        <span className="text-lg">👥</span>
        <span>Community</span>
      </button>
      <button onClick={() => navigate("/create")} className={getButtonClass("/create")}>
        <span className="text-lg">✏️</span>
        <span>Create</span>
      </button>
      <button onClick={() => navigate("/chats")} className={getButtonClass("/chats")}>
        <span className="text-lg">💬</span>
        <span>Messages</span>
      </button>
      <button onClick={handleBotChat} className={getButtonClass("/bot")}>
        <span className="text-lg">🤖</span>
        <span>AI Bot</span>
      </button>
    </nav>
  );
}

export default BottomNav;
