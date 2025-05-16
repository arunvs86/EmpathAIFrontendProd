// frontend/src/components/BottomNav.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createChat } from "../services/chatApi"; // Import your createChat function

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active state based on the current URL path
  const getButtonClass = (path) => {
    return location.pathname === path
      ? "text-emerald-600"
      : "text-gray-700 hover:text-emerald-600";
  };

  // Function to handle navigating to the bot chat
  const handleBotChat = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const botId = "c7291129-8ed5-40d6-a504-b96f957ceb88";

    if (!currentUser.id) {
      alert("Please log in.");
      return;
    }
    if (currentUser.id === botId) {
      alert("Bot cannot message itself.");
      return;
    }
    try {
      // Call createChat with the bot's id as recipient
      const chat = await createChat(botId);
      // Navigate to the chat detail page for that chat
      navigate(`/chats/${chat._id}`);
    } catch (error) {
      console.error("Error creating bot chat:", error);
      alert("Failed to open bot chat.");
    }
  };

  return (
    <nav className="h-16 bg-white border-t border-gray-200 flex items-center justify-around shadow-md">
      <button
        onClick={() => navigate("/")}
        className={`flex flex-col items-center text-sm ${getButtonClass("/")}`}
      >
        <span>Home</span>
      </button>
      <button
        onClick={() => navigate("/communities")}
        className={`flex flex-col items-center text-sm ${getButtonClass("/communities")}`}
      >
        <span>Community</span>
      </button>
      <button
        onClick={() => navigate("/create")}
        className={`flex flex-col items-center text-sm ${getButtonClass("/create")}`}
      >
        <span>Create</span>
      </button>
      <button
        onClick={() => navigate("/chats")}
        className={`flex flex-col items-center text-sm ${getButtonClass("/chats")}`}
      >
        <span>Messages</span>
      </button>
      <button
        onClick={handleBotChat}
        className={`flex flex-col items-center text-sm ${getButtonClass("/bot")}`}
      >
        <span>EmpathAiBot</span>
      </button>
    </nav>
  );
}

export default BottomNav;
