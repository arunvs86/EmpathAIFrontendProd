// src/services/socket.js
import { io } from "socket.io-client";

// Connect to your backend Socket.IO server (adjust URL/port as needed)
const socket = io(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/`, {
  // You can add options such as auth tokens if needed:
  // auth: { token: localStorage.getItem("token") }
});

export default socket;
