// import React, { useState, useRef } from "react";
// import socket from "../services/socket";

// function VoiceRecorder({ chatId, onUpload }) {
//   const [rec, setRec] = useState(false);
//   const mediaRef = useRef(null);
//   const chunksRef = useRef([]);

//   const start = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRef.current = new MediaRecorder(stream);
//     chunksRef.current = [];
//     mediaRef.current.ondataavailable = e => chunksRef.current.push(e.data);
//     mediaRef.current.onstop = upload;
//     mediaRef.current.start();
//     setRec(true);
//   };

//   const stop = () => {
//     mediaRef.current.stop();
//     setRec(false);
//   };

//   const upload = async () => {
//     const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//     const fd = new FormData();
//     fd.append("voice", blob);
//     fd.append("chatId", chatId);
  
//     const token = localStorage.getItem("token");
//     const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/media/voice", {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: fd,
//     });
  
//     if (!res.ok) {
//       const errText = await res.text();
//       console.error("Voice upload failed:", res.status, errText);
//       return;
//     }
  
//     const { message } = await res.json();
//     // socket.emit("newMessage", { chatId, message });
//     if (onUpload) onUpload(message);

//   };
  

//   return (
//     <button onClick={rec ? stop : start}
//             className={rec ? "bg-red-500" : "bg-blue-500"}
//             title={rec ? "Stop recording" : "Record voice"}>
//       {rec ? "◼︎" : "🎤"}
//     </button>
//   );
// }

// export default VoiceRecorder;

import React, { useState, useRef } from "react";

function VoiceRecorder({ chatId, onUpload }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    // 1) Grab the mic stream
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    // 2) Create & wire up MediaRecorder
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.onstop = upload;  // when you stop, fire upload()
    mr.start();

    setRecording(true);
  };

  const stop = () => {
    // 1) Stop the recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    // 2) Then stop all mic tracks so the mic light goes off
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setRecording(false);
  };

  const upload = async () => {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const fd = new FormData();
    fd.append("voice", blob);
    fd.append("chatId", chatId);

    const token = localStorage.getItem("token");
    const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/media/voice", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) {
      console.error("Voice upload failed:", res.status, await res.text());
      return;
    }
    const { message } = await res.json();
    if (onUpload) {
      onUpload(message);
    }
  };

  return (
    <button
      onClick={recording ? stop : start}
      className={recording ? "bg-red-500 p-2 rounded" : "bg-white/10 p-2 rounded"}
      title={recording ? "Stop recording" : "Record voice"}
    >
      {recording ? "◼︎" : "🎤"}
    </button>
  );
}

export default VoiceRecorder;
