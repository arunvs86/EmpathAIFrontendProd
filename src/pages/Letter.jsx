import React, { useState } from "react";

export default function LetterToLovedOne() {
  // static sample portrait and letter content
  const [letter, setLetter] = useState(
    `Dear Grandma,

I think of you every day and miss your warm smile and comforting hugs. Though you're no longer here in person, I feel your presence in the little things— the scent of fresh flowers, the songs we used to sing together, and the laughter we shared around the dinner table.

Thank you for teaching me kindness, resilience, and how to find joy even in difficult times. Your wisdom guides me through both sunshine and storm.

I hope you're at peace among the clouds, dancing on sunbeams as you watch over all of us.

With all my love,
Your Grandchild`
  );

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4" style={{ backgroundImage: 'url(/assets/clouds.svg)', backgroundSize: 'cover' }}>
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg p-8 max-w-xl w-full">
        <div className="flex justify-center mb-6">
          <img
            src="/assets/test-portrait.jpg"
            alt="Loved One Portrait"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">A Letter to My Loved One</h2>
        <textarea
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          rows={12}
          className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
        />
        <div className="mt-6 flex justify-end">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400">
            Save Letter
          </button>
        </div>
      </div>
    </div>
  );
}
