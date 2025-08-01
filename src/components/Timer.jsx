import React, { useState, useEffect } from 'react';
import bannerImg from '/assets/mindful_meditation_banner.jpg';
import benefitsImg from '/assets/meditation_benefits.jpg';
import anchorImg from '/assets/anchor_breath.jpg';
import bodyScanImg from '/assets/body_scan.jpg';
import walkingImg from '/assets/walking_meditation.jpg';

// Timer component: customizable countdown with start/pause
function Timer({ duration = 180 }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const intervalId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setRunning(false);
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [running]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-3xl font-mono">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="space-x-4">
        {!running && timeLeft > 0 && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
            onClick={() => setRunning(true)}
          >
            Start
          </button>
        )}
        {running && (
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
            onClick={() => setRunning(false)}
          >
            Pause
          </button>
        )}
      </div>
      {timeLeft === 0 && <div className="text-lg text-red-600">Time’s up!</div>}
    </div>
  );
}