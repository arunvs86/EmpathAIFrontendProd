// // frontend/src/pages/ChatList.jsx
// import React, { useEffect, useState } from "react";
// import { getUserChats } from "../services/chatApi";
// import ChatCard from "../components/ChatCard";

// function ChatList() {
//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("User not authenticated");
//         const data = await getUserChats();
//         setChats(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchChats();
//   }, []);

//   if (loading) return <p className="p-4">Loading chats...</p>;
//   if (error) return <p className="p-4 text-red-600">{error}</p>;
//   if (chats.length === 0)
//     return <p className="p-4 text-gray-600">No chats available.</p>;

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6">Your Chats</h2>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {chats.map((chat) => (
//           <ChatCard key={chat._id} chat={chat} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ChatList;

// frontend/src/pages/ChatList.jsx
import React, { useEffect, useState } from "react";
import { getUserChats } from "../services/chatApi";
import ChatCard from "../components/ChatCard";

function ChatList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");
        const data = await getUserChats();
        setChats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) return <p className="p-4">Loading chats...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (chats.length === 0) {
    return <p className="p-4 text-gray-600">No chats available.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
          Your Chats
        </h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {chats.map((chat) => (
            <ChatCard key={chat._id} chat={chat} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatList;
