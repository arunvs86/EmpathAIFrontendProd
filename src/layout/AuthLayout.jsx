import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        src="/assets/calm_ocean.mp4"
      />

      {/* dim overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* floating Lottie particles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* make sure you’ve added the <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script> in index.html */}
        <lottie-player
          autoplay
          loop
          mode="normal"
          src="/assets/particles.json"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* center the children */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        {children}
      </div>
    </div>
  );
}
