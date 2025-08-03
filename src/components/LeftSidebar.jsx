// src/components/LeftSidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock, FileText, MessageSquare } from "lucide-react";
import { createChat } from "../services/chatApi";

export default function LeftSidebar() {
  const [activeSection, setActiveSection] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFavorites(
      JSON.parse(localStorage.getItem("myFavorites") || "[]").slice(0, 4)
    );
    setRecentlyViewed(
      JSON.parse(
        localStorage.getItem("recentlyViewedCommunities") || "[]"
      ).slice(0, 4)
    );
  }, []);

  const toggleSection = (section) =>
    setActiveSection(activeSection === section ? null : section);

  const handleLetters = () => navigate("/letters");
  const handleBotChat = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const botId = "c7291129-8ed5-40d6-a504-b96f957ceb88";
    if (!user.id) return alert("Please log in.");
    if (user.id === botId) return alert("Bot cannot message itself.");
    try {
      const chat = await createChat(botId);
      navigate(`/chats/${chat._id}`);
    } catch {
      alert("Failed to open bot chat.");
    }
  };

const cardClass =
     "flex items-center gap-2 whitespace-nowrap px-3 py-2 bg-white/20 hover:border border-amber-300 bg-white/30 rounded-2xl   transform hover:-translate-y-0.5 transition-all duration-200 transition";
  
  const iconClass = "w-5 h-5 text-white";
  const labelClass = "text-white font-medium text-sm";

  const renderSectionList = (items) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 mt-2">
      <ul className="flex flex-wrap gap-2 text-bold">
        {items.map((it) => (
          <li key={it.id}>
            <button
              onClick={() => navigate(it.link)}
              title={it.name}
              className="
                inline-block
                bg-white/20 hover:bg-white/30
                text-white
                font-semibold
                text-xs
                truncate
                max-w-[8rem]
                px-2 py-1
                rounded-full
                transition
              "
            >
              {it.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <aside className="w-full h-full p-4">
      <div className="flex flex-col gap-4">
        {/* Favourites */}
        <div>
          <button
            onClick={() => toggleSection("favourites")}
            className={cardClass}
          >
            <Star className={iconClass} />
            <span className={labelClass}>Favourites</span>
          </button>
          {activeSection === "favourites" && favorites.length > 0 && (
            renderSectionList(favorites)
          )}
        </div>

        {/* Recently Viewed */}
        <div>
          <button
            onClick={() => toggleSection("recentlyViewed")}
            className={cardClass}
          >
            <Clock className={iconClass} />
            <span className={labelClass}>Recently Viewed</span>
          </button>
          {activeSection === "recentlyViewed" && recentlyViewed.length > 0 && (
            renderSectionList(recentlyViewed)
          )}
        </div>

        {/* My Letters */}
        <button onClick={handleLetters} className={cardClass}>
          <FileText className={iconClass} />
          <span className={labelClass}>My Letters</span>
        </button>

        {/* EmpathAI Bot */}
        <button onClick={handleBotChat} className={cardClass}>
          <MessageSquare className={iconClass} />
          <span className={labelClass}>EmpathAI Bot</span>
        </button>
      </div>
    </aside>
  );
}
