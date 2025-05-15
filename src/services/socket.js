// src/services/socket.js
import { io } from "socket.io-client";

// Connect to your backend Socket.IO server (adjust URL/port as needed)
const socket = io(`https://empathaiv2-backend.onrender.com`, {
  // You can add options such as auth tokens if needed:
  // auth: { token: localStorage.getItem("token") }
});

export default socket;
