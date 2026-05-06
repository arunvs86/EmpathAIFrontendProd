// src/components/LeftSidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Users, Heart, ChevronDown, ChevronUp, BookOpen, ListChecks, FileText, Shield, Leaf, Sparkles, Brain } from "lucide-react";
import { createChat } from "../services/chatApi";
import { useTranslation } from 'react-i18next';

export default function LeftSidebar() {
  const { t } = useTranslation();
  const [wellbeingOpen, setWellbeingOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const goCommunities = () => navigate("/communities");

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

  const wellbeingTools = [
    { label: t('sidebar.journals'),          icon: BookOpen,  action: () => { if (!currentUser?.id) return navigate("/login"); navigate(`/profile/${currentUser.id}/journals`); } },
    { label: t('sidebar.habits'),            icon: ListChecks, action: () => { if (!currentUser?.id) return navigate("/login"); navigate(`/profile/${currentUser.id}/habits`); } },
    { label: t('sidebar.letters'),           icon: FileText,  action: () => navigate("/letters") },
    { label: t('nav.spiritual'),             icon: Shield,    action: () => navigate("/spiritual") },
    { label: t('nav.plantSapling'),          icon: Leaf,      action: () => navigate("/plant-sapling") },
    { label: t('nav.wellnessTips'),          icon: Sparkles,  action: () => navigate("/wellness-tips") },
    { label: t('nav.mindfulMeditation'),     icon: Brain,     action: () => navigate("/mindful-meditation") },
  ];

  const btnClass =
    "w-full flex items-center gap-3 px-4 py-3.5 bg-white/15 hover:bg-white/25 border border-transparent hover:border-amber-300/60 rounded-2xl transform hover:-translate-y-0.5 transition-all duration-200 text-left";
  const iconClass = "w-6 h-6 text-white flex-shrink-0";
  const labelClass = "text-white font-semibold text-sm leading-snug flex-1 min-w-0";

  return (
    <aside className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 pb-10">
      <div className="flex flex-col gap-4">

        {/* EmpathAI Bot */}
        <button onClick={handleBotChat} className={btnClass}>
          <MessageSquare className={iconClass} />
          <span className={labelClass}>{t('sidebar.bot')}</span>
        </button>

        {/* Communities */}
        <button onClick={goCommunities} className={btnClass}>
          <Users className={iconClass} />
          <span className={labelClass}>{t('sidebar.communities')}</span>
        </button>

        {/* Well Being Tools */}
        <div>
          <button
            onClick={() => setWellbeingOpen(o => !o)}
            className={btnClass}
          >
            <Heart className={iconClass} />
            <span className={labelClass}>{t('sidebar.wellbeing')}</span>
            <span className="ml-auto">
              {wellbeingOpen
                ? <ChevronUp className="w-5 h-5 text-white/70" />
                : <ChevronDown className="w-5 h-5 text-white/70" />}
            </span>
          </button>

          {wellbeingOpen && (
            <div className="mt-2 flex flex-col gap-2 pl-2">
              {wellbeingTools.map(({ label, icon: Icon, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-transparent hover:border-amber-300/50 rounded-xl transition-all duration-150 text-left"
                >
                  <Icon className="w-5 h-5 text-amber-300 flex-shrink-0" />
                  <span className="text-white font-medium text-sm leading-snug flex-1 min-w-0">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
      </div>

      {/* Privacy Policy link at bottom */}
      <div className="p-4 pt-0">
        <a
          href="https://www.nottingham.ac.uk/utilities/privacy/privacy.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-300 hover:text-amber-400 transition underline"
        >
          {t('sidebar.privacy')}
        </a>
      </div>
    </aside>
  );
}
