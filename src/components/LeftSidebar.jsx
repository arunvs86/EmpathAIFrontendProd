// import React, { useState } from "react";

// function LeftSidebar() {
//   // Use one state variable to track which section is expanded
//   const [activeSection, setActiveSection] = useState(null);

//   const toggleSection = (section) => {
//     setActiveSection(activeSection === section ? null : section);
//   };

//   return (
//     <aside className="w-full h-full p-4">
//       <div className="bg-white shadow-md rounded p-4 space-y-6">
//         {/* Search Bar */}
//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//           />
//         </div>

//         {/* Favourites Accordion */}
//         <div className="bg-white rounded shadow transition-all duration-200">
//           <button
//             onClick={() => toggleSection("favourites")}
//             className="w-full text-left px-4 py-3 bg-gray-50 border-b border-gray-200 focus:outline-none hover:bg-gray-100"
//           >
//             <h3 className="text-lg font-semibold text-gray-800">Favourites</h3>
//           </button>
//           {activeSection === "favourites" && (
//             <div className="p-4">
//               <ul className="space-y-2 text-emerald-600 text-sm">
//                 <li>Favourite 1</li>
//                 <li>Favourite 2</li>
//                 <li>Favourite 3</li>
//                 <li>Favourite 4</li>
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Recently Viewed Accordion */}
//         <div className="bg-white rounded shadow transition-all duration-200">
//           <button
//             onClick={() => toggleSection("recentlyViewed")}
//             className="w-full text-left px-4 py-3 bg-gray-50 border-b border-gray-200 focus:outline-none hover:bg-gray-100"
//           >
//             <h3 className="text-lg font-semibold text-gray-800">Recently Viewed</h3>
//           </button>
//           {activeSection === "recentlyViewed" && (
//             <div className="p-4">
//               <ul className="space-y-2 text-emerald-600 text-sm">
//                 <li>Item 1</li>
//                 <li>Item 2</li>
//                 <li>Item 3</li>
//                 <li>Item 4</li>
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Suggested Accordion */}
//         <div className="bg-white rounded shadow transition-all duration-200">
//           <button
//             onClick={() => toggleSection("suggested")}
//             className="w-full text-left px-4 py-3 bg-gray-50 border-b border-gray-200 focus:outline-none hover:bg-gray-100"
//           >
//             <h3 className="text-lg font-semibold text-gray-800">Suggested</h3>
//           </button>
//           {activeSection === "suggested" && (
//             <div className="p-4">
//               <ul className="space-y-2 text-emerald-600 text-sm">
//                 <li>Suggested 1</li>
//                 <li>Suggested 2</li>
//                 <li>Suggested 3</li>
//                 <li>Suggested 4</li>
//                 <li>Suggested 5</li>
//                 <li>Suggested 6</li>
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Religious Support Accordion */}
//         <div className="bg-white rounded shadow transition-all duration-200">
//           <button
//             onClick={() => toggleSection("religious")}
//             className="w-full text-left px-4 py-3 bg-gray-50 border-b border-gray-200 focus:outline-none hover:bg-gray-100"
//           >
//             <h3 className="text-lg font-semibold text-gray-800">
//               Religious Support
//             </h3>
//           </button>
//           {activeSection === "religious" && (
//             <div className="p-4">
//               <ul className="space-y-2 text-emerald-600 text-sm">
//                 <li>Community A</li>
//                 <li>Community B</li>
//                 <li>Community C</li>
//                 <li>Community D</li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// }

// export default LeftSidebar;

// src/components/LeftSidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChat } from "../services/chatApi";

export default function LeftSidebar() {
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();

  const toggleSection = (section) =>
    setActiveSection(activeSection === section ? null : section);

  // Navigate to your Letters page
  const handleLetters = () => {
    navigate("/letters");
  };

  // Start or open a chat with the bot
  const handleBotChat = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const botId = "c7291129-8ed5-40d6-a504-b96f957ceb88";
    if (!currentUser.id) return alert("Please log in.");
    if (currentUser.id === botId) return alert("Bot cannot message itself.");
    try {
      const chat = await createChat(botId);
      navigate(`/chats/${chat._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to open bot chat.");
    }
  };

  return (
    <aside className="w-full h-full p-4">
      <div className="bg-white shadow-md rounded p-4 space-y-6">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Favourites Accordion */}
        <div className="bg-white rounded shadow transition-all duration-200">
          <button
            onClick={() => toggleSection("favourites")}
            className="w-full text-left px-4 py-3 bg-gray-50 border-b border-gray-200 focus:outline-none hover:bg-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Favourites
            </h3>
          </button>
          {activeSection === "favourites" && (
            <div className="p-4">
              <ul className="space-y-2 text-emerald-600 text-sm">
                <li>Favourite 1</li>
                <li>Favourite 2</li>
                <li>Favourite 3</li>
                <li>Favourite 4</li>
              </ul>
            </div>
          )}
        </div>

        {/* Recently Viewed Accordion */}
        <div className="bg-white rounded shadow transition-all duration-200">
          <button
            onClick={() => toggleSection("recentlyViewed")}
            className="w-full text-left px-4 py-3 bg-gray-50 border-b border-gray-200 focus:outline-none hover:bg-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Recently Viewed
            </h3>
          </button>
          {activeSection === "recentlyViewed" && (
            <div className="p-4">
              <ul className="space-y-2 text-emerald-600 text-sm">
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
                <li>Item 4</li>
              </ul>
            </div>
          )}
        </div>

        {/* My Letters Link */}
        <button
          onClick={handleLetters}
          className="w-full text-left px-4 py-3 bg-gray-50 rounded shadow hover:bg-gray-100 focus:outline-none"
        >
          <h3 className="text-lg font-semibold text-gray-800">My Letters</h3>
        </button>

        {/* EmpathAI Bot Chat */}
        <button
          onClick={handleBotChat}
          className="w-full text-left px-4 py-3 bg-gray-50 rounded shadow hover:bg-gray-100 focus:outline-none"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            EmpathAI Bot
          </h3>
        </button>
      </div>
    </aside>
  );
}
