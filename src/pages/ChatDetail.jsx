import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../services/socket";
import { getUserChats, getMessages, sendMessage } from "../services/chatApi";
import VoiceRecorder from "../components/VoiceRecorder"
import { useUnreadChats } from "../contexts/UnreadChatsContext";

function ChatDetail() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chatDetails, setChatDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const [botTyping, setBotTyping] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser.id;
  const botId = "c7291129-8ed5-40d6-a504-b96f957ceb88";

  const { setUnreadChats } = useUnreadChats();

  // On mount or chatId change: remove from unread
  useEffect(() => {
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem("unreadChats") || "{}");
    } catch {}
    if (stored[chatId]) {
      const { [chatId]: _, ...rest } = stored;
      setUnreadChats(rest);
    }
  }, [chatId, setUnreadChats]);
  
  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const chats = await getUserChats();
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
        // ─── PATCH: seed transcript fields on initial load ──────────────
        const seeded = (msgDoc.messages || []).map(m => ({
          ...m,
          transcript: m.transcript || null,
          transcriptStatus: m.transcript ? "complete" : null
        }));
        setMessages(seeded);
        // ───────────────────────────────────────────────────────────────
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      }
    };

    fetchData();
    socket.emit("joinRoom", chatId);

    socket.on("newMessage", (data) => {
      if (data?.message?.chatId === chatId) {
        const m = data.message;
        setMessages((prev) => {
          if (prev.some((msg) => msg._id === m._id)) return prev;
          // ─── PATCH: seed transcript fields on new voice messages ───
          return [...prev, { ...m, transcript: null, transcriptStatus: null }];
          // ───────────────────────────────────────────────────────────
        });
      }
    });

    socket.on("transcriptionReady", ({ messageId, transcript }) => {
      setMessages(prev =>
        prev.map(m =>
          m._id === messageId
            ? { ...m, transcript, transcriptStatus: "complete" }
            : m
        )
      );
    });

    return () => {
      socket.off("newMessage");
      socket.off("transcriptionReady");
    };
  }, [chatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ─── INSERTED: helper to fetch transcript from your backend ─────────────────
  const fetchTranscript = async (messageId, audioUrl) => {
    setMessages(prev =>
      prev.map(m =>
        m._id === messageId
          ? { ...m, transcriptStatus: "loading" }
          : m
      )
    );
  
    try {
      const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { transcript } = await res.json();
  
      setMessages(prev =>
        prev.map(m =>
          m._id === messageId
            ? { ...m, transcript, transcriptStatus: "complete" }
            : m
        )
      );
    } catch (err) {
      console.error("Transcription error:", err);
      setMessages(prev =>
        prev.map(m =>
          m._id === messageId
            ? { ...m, transcriptStatus: "error" }
            : m
        )
      );
    }
  };
  
  // ────────────────────────────────────────────────────────────────────────────

  console.log("Chat details:", chatDetails)
  // Derive the other participant...
  const otherParticipant =
    chatDetails?.participants?.find((p) => p.id !== currentUserId);

    let headerTitle = "Chat";

    if (chatDetails?.isGroup) {
      headerTitle = `Chat with ${chatDetails.groupName}`;
    } else if (otherParticipant?.id === botId) {
      headerTitle = "Chat with EmpathAI Bot";
    } else if (otherParticipant) {
      headerTitle = `Chat with ${otherParticipant.username}`;
    }
    
  

    const handleVoiceUpload = async (message) => {
      // 1) Show the raw voice message immediately
      setMessages((prev) => [
        ...prev,
        { ...message, transcript: null, transcriptStatus: "loading" },
      ]);
      socket.emit("newMessage", { chatId, message });
  
      // 2) If chatting with the bot, transcribe & forward
      if (otherParticipant?.id === botId) {
        setBotTyping(true); // 

        try {
          // a) fetch transcript
          const tRes = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//api/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audioUrl: message.content }),
          });
          if (!tRes.ok) throw new Error(`Transcription failed: ${tRes.status}`);
          const { transcript } = await tRes.json();
  
          // b) update that bubble with the transcript
          setMessages((prev) =>
            prev.map((m) =>
              m._id === message._id
                ? { ...m, transcript, transcriptStatus: "complete" }
                : m
            )
          );
  
          // c) call your bot API with the transcript text
          const botResponse = await fetch(
            "https://flask-app-275410178944.europe-west2.run.app/ask",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                question: transcript,
                session_id: chatId,
              }),
            }
          );
          if (!botResponse.ok) {
            throw new Error("Failed to fetch chatbot response");
          }
          const botData = await botResponse.json();
          console.log("text length:", botData.response)          
          // d) persist the bot’s reply
          const botMsg = await sendMessage({
            chatId,
            content: botData.response,
            messageType: "text",
            overrideSenderId: botId,
          });
          setMessages((prev) => [...prev, botMsg]);
          socket.emit("newMessage", { chatId, message: botMsg });
        } catch (err) {
          console.error("Voice→Bot pipeline error:", err);
          // mark the transcript bubble as errored
          setMessages((prev) =>
            prev.map((m) =>
              m._id === message._id
                ? { ...m, transcriptStatus: "error" }
                : m
            )
          );
        }finally{
          setBotTyping(false); 
        }
      }
    };

  const handleSend = async () => {
    if (!newContent.trim()) return;
    try {
      const createdMsg = await sendMessage({
        chatId,
        content: newContent,
        messageType: "text",
      });
      setMessages((prev) => [...prev, createdMsg]);
      socket.emit("newMessage", { chatId, message: createdMsg });
      const userMessage = newContent;
      setNewContent("");

      if (otherParticipant?.id === botId) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 15000 ms = 15 seconds

        setBotTyping(true); // 

        const botResponse = await fetch("https://flask-app-275410178944.europe-west2.run.app/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userMessage,
            session_id: currentUserId, // using chatId as session identifier
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
        socket.emit("newMessage", { chatId, message: botMsg });      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }finally{
      setBotTyping(false);
    }
  };

  const renderMessageBubble = (msg, idx) => {
    const isCurrentUser = msg.senderId === currentUserId;
    const bubbleAlign = isCurrentUser ? "justify-end" : "justify-start";
    const bubbleBg = isCurrentUser ? "bg-emerald-100" : "bg-gray-100";
    const textAlign = isCurrentUser ? "text-right" : "text-left";
    const avatarUrl = "/assets/avatar.png";

    const senderName = msg.sender?.username;



    return (
      <div key={idx} className={`flex w-full mb-2 ${bubbleAlign}`}>
        {!isCurrentUser && (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-6 h-6 rounded-full object-cover mr-2 self-end"
          />
        )}

        {/* <div className={`max-w-[65%] p-2 rounded-lg ${bubbleBg} ${textAlign} shadow-sm`}> */}
        <div className={`max-w-[65%] p-2 rounded-lg ${bubbleBg} ${textAlign} shadow-sm`}>
                {senderName && (
          <p className="text-xs font-semibold text-gray-600 mb-1">
            {msg.sender.id === currentUserId ? "You" : senderName}
          </p>
        )}
          {msg.messageType === "voice" ? (
            <>
              {/* Audio player */}
              <audio src={msg.content} controls preload="none" className="w-full rounded" />

              {/* ─── INSERTED: Show transcript button / status / text ───────────── */}
              <div className="mt-1">
                {msg.transcriptStatus === "loading" && (
                  <span className="text-xs text-gray-500">Transcribing…</span>
                )}
                {msg.transcriptStatus === "error" && (
                  <button
                    onClick={() => fetchTranscript(msg._id, msg.content)}
                    className="text-xs text-red-600 underline"
                  >
                    Retry transcript
                  </button>
                )}
                {msg.transcriptStatus === null && (
                  <button
                    onClick={() => fetchTranscript(msg._id, msg.content)}
                    className="text-xs text-blue-600 underline"
                  >
                    Show transcript
                  </button>
                )}
                {msg.transcript && (
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Transcript:</strong> {msg.transcript}
                  </p>
                )}
              </div>
              {/* ──────────────────────────────────────────────────────────────── */}

              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-800">{msg.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </>
          )}
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
    <div className="bg-white/10 shadow-md rounded border border-gray-200 flex flex-col h-[60vh]">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-300">
        <h2 className="text-sm font-bold">{headerTitle}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3">
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {messages.map((msg, idx) => renderMessageBubble(msg, idx))}
        {console.log("botTyping",botTyping)}
        {botTyping && (
    <div className="flex justify-start w-full mb-2">
      <div className="bg-gray-200 text-gray-600 text-sm rounded-full px-3 py-1 animate-pulse shadow-sm">
        ...
      </div>
    </div>
  )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="px-3 py-2 border-t border-gray-300">
        <div className="flex space-x-2">
        <textarea
        rows={1}
        className="flex-grow resize-none border placeholder-white placeholder-bold rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        onKeyDown={(e) => {
          // plain Enter sends; Shift+Enter allows new line
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Type a message..."
      />
          <div className="flex space-x-2">
            {/* <VoiceRecorder
              chatId={chatId}
              onUpload={(message) => {
                setMessages((prev) => [...prev, { ...message, transcript: null, transcriptStatus: null }]);
                socket.emit("newMessage", { chatId, message });
              }}
            /> */}
             <VoiceRecorder
            chatId={chatId}
              onUpload={handleVoiceUpload}
                />
          </div>
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
