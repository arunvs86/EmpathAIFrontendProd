// src/pages/LetterView.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";

import { Download } from "lucide-react";

const FloatingHeart = ({ left, delay }) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="#f87171"
    width={24}
    height={24}
    style={{ position: "absolute", left, bottom: 50 }}
    initial={{ y: 0, opacity: 0 }}
    animate={{ y: -200, opacity: [0, 1, 0] }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
             4.42 3 7.5 3c1.74 0 3.41.81 
             4.5 2.09C13.09 3.81 14.76 3 
             16.5 3 19.58 3 22 5.42 22 
             8.5c0 3.78-3.4 6.86-8.55 
             11.54L12 21.35z" />
  </motion.svg>
);

export default function LetterView() {
  const { id } = useParams();
  const [letter, setLetter] = useState(null);
  const letterRef = useRef(null);
  const api = "https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/";

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${api}/letters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setLetter(await res.json());
    })();
  }, [api, id]);

  if (!letter) return null;

  const portraitUrl = letter.media?.[0];
  const paragraphs = letter.text.split(/\n{2,}/g);

  // Download handler
  const handleDownload = async () => {
    if (!letterRef.current) {
      console.warn("letterRef not attached!");
      return;
    }
    try {
      const dataUrl = await toPng(letterRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: null
      });
      const link = document.createElement("a");
      link.download = `${(letter.title || "letter").replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download letter as image", err);
    }
  };
  

  return (
    <div ref={letterRef} className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white overflow-hidden px-4">
      {/* Clouds */}
      {/* <motion.img
        src="/assets/images/cloud1.jpeg"
        alt="cloud"
        className="absolute top-0 left-0 w-64 opacity-50"
        initial={{ x: -50 }}
        animate={{ x: 50 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.img
        src="/assets/images/cloud2.jpeg"
        alt="cloud"
        className="absolute top-10 right-0 w-80 opacity-40"
        initial={{ x: 50 }}
        animate={{ x: -50 }}
        transition={{ duration: 25, repeat: Infinity, repeatType: "mirror" }}
      /> */}

      {/* Floating hearts */}
      <FloatingHeart left="30%" delay={0} />
      <FloatingHeart left="60%" delay={1.5} />
      <FloatingHeart left="45%" delay={3} />

      {/* Main letter container (with download button) */}
      <div className="relative z-10 max-w-xl w-full pt-8 pb-12 px-8 rounded-3xl shadow-2xl bg-white bg-opacity-80 backdrop-blur-md">
        {/* Download button */}
        <button
          onClick={handleDownload}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100"
          title="Download as PNG"
        >
          <Download className="w-5 h-5 text-gray-600" />
        </button>

        {/* Motion card that we'll capture */}
        <motion.div
          
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {/* Portrait */}
          {portraitUrl && <div className="flex justify-center -mt-20 mb-6">
            <motion.div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <img
                src={portraitUrl}
                // alt="Loved one portrait"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
}

          {/* Title */}
          <h2 className="text-3xl font-serif text-emerald-700 text-center mb-4">
            {letter.title || "A Letter to My Loved One"}
          </h2>

          {/* Body */}
          <article className="prose prose-lg prose-emerald mx-auto text-gray-800">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="font-semibold mt-6">
              {letter.signature}
            </p>
          </article>
        </motion.div>
      </div>
    </div>
  );
}
