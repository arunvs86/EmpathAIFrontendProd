import React from 'react';
import { useEffect,useRef } from 'react';
import { Outlet,useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import BottomNav from '../components/BottomNav';
import { Menu, X } from 'lucide-react';

import bgVideoMorning from '/assets/background_morning.mp4';
import { useState } from "react";

export default function HomeLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  // detect if we're on /communities (or deeper)
  const isCommunities = location.pathname.startsWith("/communities");
  const isJournals = location.pathname.match(/^\/profile\/[^/]+\/journals/) != null
  const isLetters = location.pathname.startsWith("/letters");
  const isHabits = location.pathname.match(/^\/profile\/[^/]+\/habits/) != null
  const isMindful = location.pathname.startsWith("/mindful");
  const isPlant = location.pathname.startsWith("/plant");
  const isWellness = location.pathname.startsWith("/wellness");
  const isFaith = location.pathname.startsWith("/spiritual");

  const mainRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const videoRef = useRef(null);

  // Close the mobile drawer whenever the route changes (e.g. a sidebar link was tapped)
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.3;
    }
  }, []);

useEffect(() => {
  const el = mainRef.current;
  if (!el) return;

  const handleScroll = () => {
    setShowScrollTop(el.scrollTop > 200);
  };

  el.addEventListener("scroll", handleScroll);
  return () => el.removeEventListener("scroll", handleScroll);
}, []);

  let tagline = t('layout.taglineDefault');

  if(isCommunities)  tagline = t('layout.taglineCommunities');
  if(isJournals)     tagline = t('layout.taglineJournals');
  if(isLetters)      tagline = t('layout.taglineLetters');
  if(isHabits)       tagline = t('layout.taglineHabits');
  if(isMindful)      tagline = t('layout.taglineMindful');
  if(isPlant)        tagline = t('layout.taglinePlant');
  if(isWellness)     tagline = t('layout.taglineWellness');
  if(isFaith)        tagline = t('layout.taglineFaith');

            

          


  return (
    <div className="relative w-full h-screen overflow-hidden font-sans text-white">
      {/* Morning video background — lighter and warmer than the night sky */}
      <video
  ref={videoRef}
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 object-cover w-full h-full -z-40 pointer-events-none"
>
  <source src={bgVideoMorning} type="video/mp4" />
</video>
      {/* Very light overlay so text remains readable */}
      <div className="absolute inset-0 bg-black/10 -z-40 pointer-events-none" />

      {/* Header (glass, clickable) */}
      <div className="relative z-50 pointer-events-auto">
        <Header />
      </div>

      {/* Main layout */}
      <div className="relative z-20 flex pt-20 h-[calc(100%-4rem)]">
        {/* Left Sidebar */}
        <aside className="hidden md:block w-60 p-4 relative pointer-events-auto z-30">
          <LeftSidebar />
        </aside>

        {/* Centre Content */}
        <main   ref={mainRef}
              className="flex-1 overflow-y-auto px-3 sm:px-6 pb-24 relative pointer-events-auto z-30">
          {/* Mobile: open the sidebar drawer */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 bg-white/15 hover:bg-white/25 border-2 border-white/40 hover:border-amber-400 rounded-xl text-white font-bold text-base transition"
            aria-label={t('layout.menu')}
          >
            <Menu className="w-5 h-5" /> {t('layout.menu')}
          </button>

          <div className="max-w-3xl mx-auto space-y-8">
            {/* Hero */}
            {/* <div className="mx-auto max-w-2xl bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center shadow-lg"> */}
              <h1 className="font-calligraphy text-center text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  {tagline}
              </h1>
            {/* </div> */}



            {/* Post + Feed */}
            <div className="rounded-2xl shadow-lg p-3 sm:p-6">
              <Outlet />
            </div>
          </div>
        </main>

        <button
  onClick={() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }}
  className="fixed bottom-6 right-6 z-50 bg-white/10 text-white p-3 rounded-full shadow-lg hover:bg-white/30 transition"
  title={t('layout.scrollUp')}
>
  ⬆️ {t('layout.scrollUp')}
</button>
        {/* Right Sidebar */}
        <aside className="hidden lg:block w-66 p-4 relative pointer-events-auto z-30">
          <RightSidebar />
        </aside>
      </div>

      

      {/* Mobile sidebar drawer — reuses the existing Left/Right sidebars */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Sliding panel */}
          <div className="absolute top-0 left-0 h-full w-72 max-w-[85%] bg-slate-900/95 backdrop-blur-md border-r-2 border-white/20 shadow-2xl overflow-y-auto pointer-events-auto">
            <div className="flex justify-end p-2 sticky top-0">
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="p-2 text-white/70 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Wrapped in plain divs so the sidebars' h-full flows naturally when stacked */}
            <div><LeftSidebar /></div>
            <div className="border-t border-white/10 mx-4 my-2" />
            <div><RightSidebar /></div>
          </div>
        </div>
      )}

      {/* Bottom Nav (mobile) */}
      <div className="md:hidden relative z-50 pointer-events-auto">
        <BottomNav />
      </div>
    </div>

    
  );
}
