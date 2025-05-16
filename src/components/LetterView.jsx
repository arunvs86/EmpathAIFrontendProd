// // src/pages/LetterView.jsx
// import React from "react";
// import { motion } from "framer-motion";

// /**
//  * Simple floating heart component
//  */
// const FloatingHeart = ({ left, delay }) => (
//   <motion.svg
//     viewBox="0 0 24 24"
//     fill="#f87171"
//     width={24}
//     height={24}
//     style={{ position: "absolute", left, bottom: 50 }}
//     initial={{ y: 0, opacity: 0 }}
//     animate={{ y: -200, opacity: [0, 1, 0] }}
//     transition={{
//       duration: 4,
//       delay,
//       repeat: Infinity,
//       ease: "easeInOut",
//     }}
//   >
//     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
//              4.42 3 7.5 3c1.74 0 3.41.81 
//              4.5 2.09C13.09 3.81 14.76 3 
//              16.5 3 19.58 3 22 5.42 22 
//              8.5c0 3.78-3.4 6.86-8.55 
//              11.54L12 21.35z" />
//   </motion.svg>
// );

// export default function LetterView() {
//   const portraitUrl = "/assets/images/portrait.jpeg";    // replace with your upload
//   const cloud1 = "/assets/images/cloud1.jpeg";           // light cloud png
//   const cloud2 = "/assets/images/cloud2.jpeg";           // another cloud png
//   const wreath = "/assets/images/wreath.jpeg";           // your wreath graphic

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white overflow-hidden px-4">
//       {/* Drift clouds */}
//       {/* <motion.img
//         src={cloud1}
//         alt="cloud"
//         className="absolute top-0 left-0 w-64 opacity-50"
//         initial={{ x: -50 }}
//         animate={{ x: 50 }}
//         transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
//       /> */}
//       {/* <motion.img
//         src={cloud2}
//         alt="cloud"
//         className="absolute top-10 right-0 w-80 opacity-40"
//         initial={{ x: 50 }}
//         animate={{ x: -50 }}
//         transition={{ duration: 25, repeat: Infinity, repeatType: "mirror" }}
//       /> */}

//       {/* Floating hearts */}
//       <FloatingHeart left="30%" delay={0} />
//       <FloatingHeart left="60%" delay={1.5} />
//       <FloatingHeart left="45%" delay={3} />

//       {/* Big wreath behind everything */}
//       <motion.img
//         src={cloud2}
//         alt="wreath"
//         className="absolute w-[600px] h-[600px] opacity-30"
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 0.3 }}
//         transition={{ duration: 1.2 }}
//       />

//       {/* Portrait circle */}
//       <motion.div
//         className="absolute w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl"
//         style={{ top: "calc(50% - 260px)" }}
//         initial={{ scale: 0.5, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ delay: 0.8, duration: 0.8 }}
//       >
//         <img
//           src={portraitUrl}
//           alt="Loved one portrait"
//           className="w-full h-full object-cover"
//         />
//       </motion.div>

//       {/* Main letter card */}
//       <motion.div
//         className="relative z-10 max-w-xl w-full pt-28 pb-12 px-8 rounded-3xl shadow-2xl"
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, delay: 1 }}
//       >
//         {/* Title */}
//         <h2 className="text-3xl font-serif text-emerald-700 text-center mb-6">
//           A Letter to Grandma
//         </h2>

//         {/* Body */}
//         <article className="prose prose-lg prose-emerald mx-auto text-gray-800">
//           <p>Dear Grandma,</p>
//           <p>
//             It’s been a year since you left us, and not a day goes by without me
//             thinking of your smile and warm hugs.
//           </p>
//           <p>
//             I miss our afternoon tea sessions, your stories of youth, and the way
//             you always knew how to calm my worries.
//           </p>
//           <p>
//             Though you’re gone from this world, your love remains with me in
//             every breath I take. I write this letter to send you my love,
//             gratitude, and to promise I’ll carry on the lessons you taught me.
//           </p>
//           <p>
//             Until we meet again, I send you all my love across the skies.
//           </p>
//           <p>Love always,</p>
//           <p className="font-semibold">[Your Name]</p>
//         </article>
//       </motion.div>
//     </div>
//   );
// }


// src/pages/LetterView.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

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

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://empathaiv2-backend.onrender.com/letters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setLetter(await res.json());
      }
    })();
  }, [id]);

  if (!letter) return null;

  const portraitUrl = letter.media?.[0] || "/assets/images/portrait.jpeg";
  const cloud1 = "/assets/images/cloud1.jpeg";
  const cloud2 = "/assets/images/cloud2.jpeg";
  const wreath = "/assets/images/wreath.jpeg";

  const paragraphs = letter.text.split(/\n{2,}/g);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white overflow-hidden px-4">
      {/* Drift clouds */}
      <motion.img
        src={cloud1}
        alt="cloud"
        className="absolute top-0 left-0 w-64 opacity-50"
        initial={{ x: -50 }}
        animate={{ x: 50 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.img
        src={cloud2}
        alt="cloud"
        className="absolute top-10 right-0 w-80 opacity-40"
        initial={{ x: 50 }}
        animate={{ x: -50 }}
        transition={{ duration: 25, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* Floating hearts */}
      <FloatingHeart left="30%" delay={0} />
      <FloatingHeart left="60%" delay={1.5} />
      <FloatingHeart left="45%" delay={3} />

      {/* Big wreath behind everything */}
      {/* <motion.img
        src={wreath}
        alt="wreath"
        className="absolute w-[600px] h-[600px] opacity-30"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 1.2 }}
      /> */}

      {/* Portrait circle */}
      <motion.div
        className="absolute w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl"
        style={{ top: "calc(50% - 260px)" }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <img
          src={portraitUrl}
          alt="Loved one portrait"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Main letter card */}
      <motion.div
        className="relative z-10 max-w-xl w-full pt-28 pb-12 px-8 rounded-3xl shadow-2xl bg-white bg-opacity-80 backdrop-blur-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        {/* Title */}
        <h2 className="text-3xl font-serif text-emerald-700 text-center mb-6">
          {letter.title || "A Letter to My Loved One"}
        </h2>

        {/* Body */}
        <article className="prose prose-lg prose-emerald mx-auto text-gray-800">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="font-semibold">{letter.signature || "[Your Name]"}</p>
        </article>
      </motion.div>
    </div>
  );
}
