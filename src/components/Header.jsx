
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ChevronDown, MessageCircle, LogOut } from "lucide-react";
import socket, { registerUserWithSocket } from "../services/socket";
import { useUnreadChats } from "../contexts/UnreadChatsContext";
import { useTranslation } from 'react-i18next';

export default function Header() {
  const navigate = useNavigate();
  const [openUser, setOpenUser] = useState(false);
  const userRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const avatarUrl = currentUser.profile_picture || "/assets/avatar.png";

  const { unreadChats, setUnreadChats } = useUnreadChats();
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setOpenUser(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    socket.on("newMessage", ({ chatId, message }) => {
      const me = currentUser.id;
      if (message.senderId !== me && !unreadChats[chatId]) {
        const next = { ...unreadChats, [chatId]: true };
        setUnreadChats(next);
        localStorage.setItem("unreadChats", JSON.stringify(next));
      }
    });
    return () => socket.off("newMessage");
  }, [unreadChats, setUnreadChats, currentUser.id]);

  useEffect(() => {
    if (currentUser?.id) registerUserWithSocket(currentUser.id);
  }, [currentUser?.id]);

  useEffect(() => {
    socket.on("postModerated", ({ postId, reason, message }) => {
      alert(message || `Your post was deleted due to: ${reason}`);
      window.location.reload();
    });
    return () => socket.off("postModerated");
  }, []);

  const totalUnread = Object.keys(unreadChats).length;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const goProfile = () => navigate(`/profile/${currentUser.id}`);

  const isES = i18n.language === 'es';

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-lg shadow-lg z-50">
      <div className="h-18 flex items-center justify-between px-6 max-w-7xl mx-auto py-3">

        {/* Logo + Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/about")}>
          <img
            src="/assets/images/Nottingham_Blue_white_text_logo_SCREEN.png"
            alt="University of Nottingham"
            className="h-10 w-auto"
          />
          <img
            src="/assets/images/LogoNewVectorized.png"
            alt="EmpathAI Logo"
            className="h-10 w-auto"
          />
          <h1 className="hover:text-amber-300 font-bold font-calligraphy text-2xl text-white leading-none">
            EmpathAI
          </h1>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">

          {/* Language toggle — flag button */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border-2 border-white/50 hover:border-amber-400 rounded-xl text-white font-bold text-base transition-all duration-200"
            title={isES ? 'Switch to English' : 'Cambiar a Español'}
          >
            <span className="text-xl leading-none">{isES ? '🇬🇧' : '🇪🇸'}</span>
            <span className="hidden sm:inline">{isES ? 'English' : 'Español'}</span>
          </button>

          {/* Messages */}
          <Link
            to="/chats"
            className="relative flex items-center justify-center w-11 h-11 bg-white/15 hover:bg-white/25 border-2 border-white/50 hover:border-amber-400 rounded-xl text-white transition-all duration-200"
          >
            <MessageCircle className="w-6 h-6" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                {totalUnread}
              </span>
            )}
          </Link>

          {/* User dropdown */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setOpenUser(u => !u)}
              className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border-2 border-white/50 hover:border-amber-400 rounded-xl text-white font-semibold text-base transition-all duration-200"
            >
              <img
                src={avatarUrl}
                onClick={(e) => { e.stopPropagation(); goProfile(); }}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-white/40"
              />
              <span
                className="hidden sm:inline cursor-pointer hover:text-amber-300 transition"
                onClick={(e) => { e.stopPropagation(); goProfile(); }}
              >
                {currentUser.username}
              </span>
              <ChevronDown className="w-4 h-4 opacity-70" />
            </button>

            {openUser && (
              <div className="absolute right-0 mt-2 w-48 bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-2xl shadow-xl py-2 z-60">
                <Link
                  to="/chats"
                  className="flex items-center gap-3 px-4 py-3 text-white hover:text-amber-300 hover:bg-white/10 transition text-base font-medium"
                  onClick={() => setOpenUser(false)}
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('header.messages')}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-white hover:text-amber-300 hover:bg-white/10 transition text-base font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  {t('header.logout')}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
