import React, { useState } from "react";

function LeftSidebar() {
  // Use one state variable to track which section is expanded
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <aside className="w-full h-full p-4">
      <div className="bg-white shadow-md rounded p-4 space-y-6">
        {/* Search Bar */}
        <div className="mb-4">
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
            <h3 className="text-lg font-semibold text-gray-800">Favourites</h3>
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
            <h3 className="text-lg font-semibold text-gray-800">Recently Viewed</h3>
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

        {/* Suggested Accordion */}
        <div className="bg-white rounded shadow transition-all duration-200">
          <button
            onClick={() => toggleSection("suggested")}
            className="w-full text-left px-4 py-3 bg-gray-50 border-b border-gray-200 focus:outline-none hover:bg-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800">Suggested</h3>
          </button>
          {activeSection === "suggested" && (
            <div className="p-4">
              <ul className="space-y-2 text-emerald-600 text-sm">
                <li>Suggested 1</li>
                <li>Suggested 2</li>
                <li>Suggested 3</li>
                <li>Suggested 4</li>
                <li>Suggested 5</li>
                <li>Suggested 6</li>
              </ul>
            </div>
          )}
        </div>

        {/* Religious Support Accordion */}
        <div className="bg-white rounded shadow transition-all duration-200">
          <button
            onClick={() => toggleSection("religious")}
            className="w-full text-left px-4 py-3 bg-gray-50 border-b border-gray-200 focus:outline-none hover:bg-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Religious Support
            </h3>
          </button>
          {activeSection === "religious" && (
            <div className="p-4">
              <ul className="space-y-2 text-emerald-600 text-sm">
                <li>Community A</li>
                <li>Community B</li>
                <li>Community C</li>
                <li>Community D</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default LeftSidebar;
