// components/CommunityList.jsx
import React, { useState, useEffect } from "react";
import CommunityCard from "./CommunityCard";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Search, Plus, Globe, Lock } from "lucide-react";

export default function CommunityList({ onCreateCommunity, onSelectCommunity }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const ctx = useOutletContext() || {};
  const { userId, isOwnProfile } = ctx;

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("all");

  const PINNED_COMMUNITY_ID   = "";
  const PINNED_COMMUNITY_NAME = "EmpathAI Community";

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let url;
        if (location.pathname.match(/^\/profile\/[^/]+\/communities/) && isOwnProfile) {
          url = `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/users/${userId}/communities`;
        } else {
          url = "https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities";
        }
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch");
        setCommunities(await res.json());
      } catch (err) {
        setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    })();
  }, [location.pathname, userId, isOwnProfile]);

  const pinMatch = (c) => {
    if (PINNED_COMMUNITY_ID && c._id === PINNED_COMMUNITY_ID) return true;
    if (!PINNED_COMMUNITY_ID && PINNED_COMMUNITY_NAME)
      return (c.name || "").trim().toLowerCase() === PINNED_COMMUNITY_NAME.trim().toLowerCase();
    return false;
  };

  const visible = communities
    .filter(c => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
    })
    .filter(c => filter === "all" ? true : c.type === filter);

  const pinned  = visible.filter(pinMatch);
  const others  = visible.filter(c => !pinMatch(c));
  const ordered = [...pinned, ...others];

  if (loading) return <p className="text-center text-white/80 text-lg py-12">{t('community.loading')}</p>;
  if (error)   return <p className="text-center text-red-400 text-lg py-12">{error}</p>;

  return (
    <div className="space-y-8">

      {/* ── Controls bar ── */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
          <input
            type="text"
            placeholder={t('community.searchPlaceholder')}
            className="w-full bg-white/20 placeholder-white/60 text-white text-base font-medium rounded-xl pl-11 pr-4 py-3.5 border-2 border-white/30 focus:border-amber-400 focus:outline-none transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter toggle buttons */}
        <div className="flex rounded-xl overflow-hidden border-2 border-white/30 flex-shrink-0">
          {[
            { value: "all",     label: t('community.allTypes'),   icon: null },
            { value: "public",  label: t('community.public'),     icon: <Globe className="w-4 h-4" /> },
            { value: "private", label: t('community.private'),    icon: <Lock  className="w-4 h-4" /> },
          ].map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all duration-150 ${
                filter === value
                  ? "bg-amber-400 text-gray-900 border-amber-400"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        {/* New Community button */}
        <button
          onClick={() => navigate('/communities/create')}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-base rounded-xl border-2 border-amber-500 hover:border-amber-600 transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          {t('community.newCommunity')}
        </button>
      </div>

      {/* ── Results count ── */}
      {!loading && (
        <p className="text-white/70 text-base font-medium">
          {ordered.length} {ordered.length === 1 ? 'community' : 'communities'} found
        </p>
      )}

      {/* ── Community cards ── */}
      {ordered.length === 0 ? (
        <div className="text-center py-16 text-white/70 text-lg">
          {isOwnProfile && location.pathname.includes('/communities')
            ? t('community.notMember')
            : t('community.noneFound')}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {ordered.map(comm => (
            <CommunityCard key={comm._id} community={comm} />
          ))}
        </div>
      )}
    </div>
  );
}
