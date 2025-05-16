// import React from "react";
// import { Outlet } from "react-router-dom"; // We'll use Outlet here
// import Header from "../components/Header";
// import LeftSidebar from "../components/LeftSidebar";
// import RightSidebar from "../components/RightSidebar";
// import BottomNav from "../components/BottomNav";

// function HomeLayout() {
//   return (
//     <div className="relative w-full h-screen bg-gray-50">
//       {/* Header */}
//       <Header />

//       {/* Left Sidebar */}
//       <div className="hidden md:block fixed top-16 left-0 w-60 h-[calc(100%-4rem)] bg-white border-r border-gray-200 shadow-md">
//         <LeftSidebar />
//       </div>

//       {/* Right Sidebar */}
//       <div className="hidden lg:block fixed top-16 right-0 w-60 h-[calc(100%-4rem)] bg-white border-l border-gray-200 shadow-md">
//         <RightSidebar />
//       </div>

//       {/* Main Content Area */}
//       <div className="pt-16 ml-0 md:ml-60 lg:mr-60 h-[calc(100%-4rem)] overflow-auto">
//         <div className="max-w-3xl mt-3 mx-auto px-4 pb-24">
//           {/* This is where child routes will render */}
//           <Outlet />
//         </div>
//       </div>

//       {/* Bottom Navigation */}
//       <div className="fixed bottom-0 left-0 right-0 md:left-60 lg:right-60 z-20 flex justify-center">
//         <div className="w-full max-w-3xl">
//           <BottomNav />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HomeLayout;


import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import BottomNav from '../components/BottomNav';

export default function HomeLayout() {
  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* Header with integrated navigation */}
      <Header />

      {/* Left Sidebar */}
      <div className="hidden md:block fixed top-16 left-0 w-48 h-[calc(100%-4rem)] bg-white border-r border-gray-200 shadow-sm">
        <LeftSidebar />
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block fixed top-16 right-0 w-48 h-[calc(100%-4rem)] bg-white border-l border-gray-200 shadow-sm">
        <RightSidebar />
      </div>

      {/* Main Content Area */}
      <div className="pt-16 ml-0 md:ml-48 lg:mr-48 h-[calc(100%-4rem)] overflow-auto">
        <div className="max-w-3xl mx-auto mt-4 px-4 pb-24">
          <Outlet />
        </div>
      </div>

      {/* Bottom Navigation (mobile) */}
      {/* <div className="fixed bottom-0 left-0 right-0 md:left-48 lg:right-48 z-20 flex justify-center">
        <div className="w-full max-w-3xl">
          <BottomNav />
        </div>
      </div> */}
    </div>
  );
}