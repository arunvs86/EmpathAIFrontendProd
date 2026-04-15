
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ChevronDown, MessageCircle, Bell, LogOut } from "lucide-react";
import socket ,{registerUserWithSocket} from "../services/socket";
import { useUnreadChats } from "../contexts/UnreadChatsContext";
import { useTranslation } from 'react-i18next';

export default function Header() {
  const navigate = useNavigate();
  const [openUser, setOpenUser] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const userRef = useRef(null);
  const moreRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const avatarUrl = currentUser.profile_picture || "/assets/avatar.png";

  const { unreadChats, setUnreadChats } = useUnreadChats();

  /* Spanish Translation */

  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };


  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setOpenUser(false);
      if (moreRef.current && !moreRef.current.contains(e.target)) setOpenMore(false);
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
    if (currentUser?.id) {
      registerUserWithSocket(currentUser.id);
    }
  }, [currentUser?.id]);


  useEffect(() => {
    socket.on("postModerated", ({ postId, reason, message }) => {
      alert(message || `Your post was deleted due to: ${reason}`);
      console.warn(`Post ${postId} removed: ${reason}`);
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

  // const PRIMARY_TABS = [
  //   { label: "Spiritual support", to: "/spiritual" },
  //   { label: "Plant a Sapling", to: "/plant-sapling" },
  //   { label: "Wellness Tips", to: "/wellness-tips" },
  //   { label: "Mindful Meditation", to: "/mindful-meditation" },
  // ];

  const PRIMARY_TABS = [
    { label: t('nav.spiritual'), to: "/spiritual" },
    { label: t('nav.plantSapling'), to: "/plant-sapling" },
    { label: t('nav.wellnessTips'), to: "/wellness-tips" },
    { label: t('nav.mindfulMeditation'), to: "/mindful-meditation" },
  ];

  const MORE_TABS = [
    // { label: "Events Nearby", to: "/feed/events" },
    { label: "Plant a Sapling", to: "/plant-sapling" },
    { label: "Wellness Tips", to: "/wellness-tips" },
    { label: "Mindful Meditation", to: "/mindful-meditation" },
  ];

  const goProfile = () => navigate(`/profile/${currentUser.id}`);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-lg shadow-lg">
      <div className="h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/about")}>
  <img
    src="/assets/images/Nottingham_Blue_white_text_logo_SCREEN.png"
    alt="EmpathAI Logo"
    className="h-10 w-auto"
  />
  <h1 className="hover:text-amber-300 font-bold font-calligraphy text-2xl text-white">
    EmpathAI
  </h1>
</div>

        <nav className="flex-1 flex justify-center gap-4 lg:gap-6 flex-wrap">
          {PRIMARY_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                isActive
                  ? "text-amber-300"
                  : "font-semibold text-gray-200 hover:text-amber-300 transition"
              }
            >
              {tab.label}
            </NavLink>
          ))}

          {/* <div className="relative" ref={moreRef}>
            <button
              onClick={() => setOpenMore((o) => !o)}
              className="flex items-center text-gray-200 hover:text-amber-300 transition"
            >
              More <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {openMore && (
              <div className="absolute top-full left-0 mt-1 bg-white backdrop-blur-sm rounded-md shadow-lg -z-600">
                {MORE_TABS.map((tab) => (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    className="block px-4 py-2 text-black hover:text-amber-500  transition"
                    onClick={() => setOpenMore(false)}
                  >
                    {tab.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div> */}
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/chats" className="relative text-gray-200 hover:text-amber-300 transition">
            <MessageCircle className="w-6 h-6" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                {totalUnread}
              </span>
            )}
          </Link>

          <button onClick={toggleLang} className="text-sm font-semibold text-gray-200 hover:text-amber-300 transition">
                {t('header.switchLang')}
                </button>
                
          {/* <Link to="/notifications" className="text-gray-200 hover:text-amber-300 transition">
            <Bell className="w-6 h-6" />
          </Link> */}

          <div className="relative flex-shrink-0" ref={userRef}>
            <button
              onClick={() => setOpenUser((u) => !u)}
              className="flex items-center text-white hover:text-amber-400 transition"
            >
              <span className="text-sm cursor-pointer" onClick={goProfile}>   
                {t('header.hello')}, {currentUser.username}
              </span>
              <img
                src={avatarUrl}
                onClick={goProfile}
                alt="Avatar"
                className="w-8 h-8 rounded-full ml-2"
              />
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {openUser && (
              <div className="absolute right-0 mt-2 w-44 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg py-2 z-60">
                <Link
                  to="/chats"
                  className="flex items-center px-4 py-2 text-white hover:text-amber-300 transition"
                  onClick={() => setOpenUser(false)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t('header.messages')}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-white hover:text-amber-300 transition"
                >
                  <LogOut className="w-4 h-4 mr-2" />
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
