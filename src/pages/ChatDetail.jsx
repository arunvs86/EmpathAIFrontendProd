import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../services/socket";
import { getUserChats, getMessages, sendMessage } from "../services/chatApi";

function ChatDetail() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chatDetails, setChatDetails] = useState(null); // Enriched chat info from getUserChats
  const [messages, setMessages] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser.id;
  const botId = "c7291129-8ed5-40d6-a504-b96f957ceb88";

  // Fetch enriched chat details from getUserChats and find the chat with chatId
  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const chats = await getUserChats(); // returns enriched chats with participants
        const chat = chats.find((c) => c._id === chatId);
        setChatDetails(chat || null);
      } catch (err) {
        console.error("Error fetching chat details:", err);
        setError("Failed to load chat details");
      }
    };
    fetchChatDetails();
  }, [chatId]);

  // Fetch messages and set up socket listeners
  useEffect(() => {
    const fetchData = async () => {
      try {
        const msgDoc = await getMessages(chatId);
        setMessages(msgDoc.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      }
    };

    fetchData();
    socket.emit("joinRoom", chatId);
    socket.on("newMessage", (data) => {
      if (data && data.message && data.message.chatId === chatId) {
        setMessages((prev) => {
          if (prev.some((msg) => msg._id === data.message._id)) return prev;
          return [...prev, data.message];
        });
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [chatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Derive the other participant's details
  const otherParticipant =
    chatDetails &&
    chatDetails.participants &&
    chatDetails.participants.find((p) => p.id !== currentUserId);

  const headerTitle = otherParticipant
    ? otherParticipant.id === botId
      ? "Chat with EmpathAI Bot"
      : `Chat with ${otherParticipant.username}`
    : "Chat Detail";

  const handleSend = async () => {
    if (!newContent.trim()) return;
    try {
      // 1) Send the user's message via REST; the endpoint returns the new message with a unique _id
      const createdMsg = await sendMessage({
        chatId,
        content: newContent,
        messageType: "text",
      });
      setMessages((prev) => [...prev, createdMsg]);
      socket.emit("newMessage", { chatId, message: createdMsg });
      const userMessage = newContent;
      setNewContent("");

      // 2) If chatting with the bot, call the chatbot API and persist the bot's response
      if (otherParticipant && otherParticipant.id === botId) {
        const botResponse = await fetch("https://flask-app-275410178944.europe-west2.run.app/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userMessage,
            session_id: "etrghdfhjfryddr", // using chatId as session identifier
          }),
        });
        if (!botResponse.ok) {
          throw new Error("Failed to fetch chatbot response");
        }
        const botData = await botResponse.json();

        // Here we call sendMessage again with an override for senderId to persist the bot message.
        // This requires your backend to support an optional 'overrideSenderId' field.
        const botMsg = await sendMessage({
          chatId,
          content: botData.response,
          messageType: "text",
          overrideSenderId: botId,  // New property to instruct backend to store bot's ID as sender.
        });
        setMessages((prev) => [...prev, botMsg]);
        socket.emit("newMessage", { chatId, message: botMsg });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  const renderMessageBubble = (msg, idx) => {
    const isCurrentUser = msg.senderId === currentUserId;
    const bubbleAlign = isCurrentUser ? "justify-end" : "justify-start";
    const bubbleBg = isCurrentUser ? "bg-emerald-100" : "bg-gray-100";
    const textAlign = isCurrentUser ? "text-right" : "text-left";
    const avatarUrl = "/assets/avatar.png"; // Placeholder avatar

    return (
      <div key={idx} className={`flex w-full mb-2 ${bubbleAlign}`}>
        {!isCurrentUser && (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-6 h-6 rounded-full object-cover mr-2 self-end"
          />
        )}
        <div className={`max-w-[65%] p-2 rounded-lg ${bubbleBg} ${textAlign} shadow-sm`}>
          <p className="text-sm text-gray-800">{msg.content}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(msg.createdAt).toLocaleString()}
          </p>
        </div>
        {isCurrentUser && (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-6 h-6 rounded-full object-cover ml-2 self-end"
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto mt-4 bg-white shadow-md rounded border border-gray-200 flex flex-col h-[70vh]">
      {/* Header (fixed) */}
      <div className="px-3 py-2 border-b border-gray-300">
        <h2 className="text-sm font-bold">{headerTitle}</h2>
      </div>

      {/* Scrollable messages */}
      <div className="flex-1 overflow-auto p-3">
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {messages.map((msg, idx) => renderMessageBubble(msg, idx))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar (fixed) */}
      <div className="px-3 py-2 border-t border-gray-300">
        <div className="flex space-x-2">
          <input
            className="flex-grow border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatDetail;

