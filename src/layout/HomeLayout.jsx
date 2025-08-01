import React from 'react';
import { useEffect } from 'react';
import { Outlet,useLocation } from 'react-router-dom';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import BottomNav from '../components/BottomNav';

import bgVideoMorning from '/assets/background_morning.mp4';
import bgVideoNight   from '/assets/background_night.mp4';

export default function HomeLayout() {

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

  let tagline = "Healing begins with a single deep breath!"

  if(isCommunities)
  {
    tagline = "We shall surf the grief waves together!"
  }

  if(isJournals)
    {
      tagline = "Your Inner Self, One Day at a Time"
    }

  if(isLetters)
      {
        tagline = "Your Words, Their Memory—A Personal Letter for Healing"
      }

      if(isHabits)
        {
          tagline = "And it all begins with small wins!"
        }
        if(isMindful)
          {
            tagline = "Find your peace, one breath at a time"
          }
          if(isPlant)
            {
              tagline = "A Seed of Hope, A Tree of Life"
            }

            if(isWellness)
              {
                tagline = "The best way out is always through!"
              }

              if(isFaith)
                {
                  tagline = "Finding Comfort Through Faith"
                }

            

          

   // pick background clip based on local time
   const hour    = new Date().getHours(); // 0–23
  //  const videoSrc =
  //    hour >=  6 && hour < 18
  //      ? bgVideoMorning
  //      : bgVideoNight;

      const videoSrc = bgVideoNight
    
    useEffect(() => {
      const now = new Date();
      // construct next 6pm today or tomorrow
      const next6pm = new Date(now);
      next6pm.setHours(18, 0, 0, 0);
      if (next6pm <= now) {
        // if it’s already past 6pm today, schedule for tomorrow
        next6pm.setDate(next6pm.getDate() + 1);
      }
      const msUntil6pm = next6pm - now;
  
      const timeoutId = setTimeout(() => {
        // reload right at 6pm
        window.location.reload();
        // then set up daily interval
        setInterval(() => window.location.reload(), 24 * 60 * 60 * 1000);
      }, msUntil6pm);
  
      return () => {
        clearTimeout(timeoutId);
      };
    }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans text-white">
      {/* Video background (non-interactive) */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 object-cover w-full h-full -z-40 pointer-events-none"
      >
         <source src={videoSrc} type="video/mp4" />
      </video>
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/30 -z-40 pointer-events-none" />

      {/* Header (glass, clickable) */}
      <div className="relative z-50 pointer-events-auto">
        <Header />
      </div>

      {/* Main layout */}
      <div className="relative z-20 flex pt-20 h-[calc(100%-4rem)]">
        {/* Left Sidebar */}
        <aside className="hidden md:block w-52 p-4 relative pointer-events-auto z-30">
          <LeftSidebar />
        </aside>

        {/* Centre Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24 relative pointer-events-auto z-30">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Hero */}
            {/* <div className="mx-auto max-w-2xl bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center shadow-lg"> */}
              <h1 className="font-calligraphy text-center text-5xl leading-tight">
                  {tagline}
              </h1>
            {/* </div> */}



            {/* Post + Feed */}
            <div className="rounded-2xl shadow-lg p-6">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-66 p-4 relative pointer-events-auto z-30">
          <RightSidebar />
        </aside>
      </div>

      {/* Bottom Nav (mobile) */}
      <div className="md:hidden relative z-50 pointer-events-auto">
        <BottomNav />
      </div>
    </div>
  );
}
