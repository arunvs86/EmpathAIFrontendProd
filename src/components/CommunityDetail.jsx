// src/components/CommunityDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import { dedupe } from "../utils/localStorageUtils";
import { createGroupChat } from "../services/chatApi";
import PostComposer from "./PostComposer";
import { createChat } from "../services/chatApi"; // if it's not already imported

export default function CommunityDetail({ communityId, onBack }) {
  const navigate      = useNavigate();
  const params        = useParams();
  const id            = communityId || params.id;
  const currentUser   = JSON.parse(localStorage.getItem("user") || "{}");

  const [community,       setCommunity]       = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [posts,           setPosts]           = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState("");
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    type: "public",
    banner_image: ""
  });
  
  // Load favorite status
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("myFavorites") || "[]");
    setIsFavorited(favs.some(f => f.id === id && f.type === "community"));
  }, [id]);

  // Fetch community & posts
  useEffect(() => {
    (async () => {
      try {
        // 1) Community
        let res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities/${id}`);
        if (!res.ok) throw new Error((await res.json()).error);
        const communityData = await res.json();

        // 2) Posts (always fetch, but we'll conditionally render)
        res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/posts/community/${id}`);
        if (!res.ok) throw new Error((await res.json()).error);
        const postData = await res.json();

        setCommunity(communityData);
        setPosts(postData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!community) return;
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities/${community._id}/members`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch members");
        setMembers(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchMembers();
  }, [community]);

  useEffect(() => {
    if (community && showEditModal) {
      setEditForm({
        name: community.name,
        description: community.description,
        type: community.type,
        banner_image: community.banner_image || ""
      });
    }
  }, [community, showEditModal]);
  

  // Load pending join requests (for mods/admins)
  useEffect(() => {
    if (
      !community ||
      (community.createdBy !== currentUser.id &&
       !community.moderators.includes(currentUser.id))
    ) return;

    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities/${community._id}/requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to load requests");
        setPendingRequests(await res.json());
      } catch (err) {
        console.error(err);
      }
    })();
  }, [community, currentUser.id]);

  // Record recently viewed
  useEffect(() => {
    if (!community) return;
    const key = "recentlyViewedCommunities";
    let arr = JSON.parse(localStorage.getItem(key) || "[]")
      .filter(item => item.id !== id);
    arr.unshift({
      id,
      name: community.name,
      link: `/communities/${id}`
    });
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 10)));
  }, [community, id]);

  // Toggle favorite
  const toggleFavorite = () => {
    const key  = "myFavorites";
    const favs = JSON.parse(localStorage.getItem(key) || "[]");
    let updated;
    if (favs.find(f => f.id === id && f.type === "community")) {
      updated = favs.filter(f => !(f.id === id && f.type === "community"));
    } else {
      updated = [...favs, { id, type: "community", name: community.name, link: `/communities/${id}` }];
    }
    updated = dedupe(updated, ["type", "id"]);
    localStorage.setItem(key, JSON.stringify(updated));
    setIsFavorited(!isFavorited);
  };

  // Handle join/request/leave
  const handleJoin = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities/${id}/join`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error((await res.json()).error);
    setCommunity(c => ({ ...c, members: [...c.members, currentUser.id] }));
  };

  const handleRequestToJoin = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities/${id}/request`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error((await res.json()).error);
    alert("Join request sent");
  };

  const handleLeave = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities/${id}/leave`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error((await res.json()).error);
    setCommunity(c => ({
      ...c,
      members: c.members.filter(uid => uid !== currentUser.id),
    }));
  };

  // ─── APPROVE / REJECT HANDLER ───────────────────
  const handleRequest = async (userId, action) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities/${id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userId, action })
        }
      );
      if (!res.ok) throw new Error((await res.json()).error);
      // Refresh pending requests list
      setPendingRequests(pr =>
        pr.filter(u => u.id !== userId)
      );
      // If approved, also add to members
      if (action === "approve") {
        setCommunity(c => ({
          ...c,
          members: [...c.members, userId]
        }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-gray-200">Loading community…</p>;
  if (error)   return <p className="text-red-400">{error}</p>;
  if (!community) return <p className="text-gray-200">Community not found.</p>;

  const MemberRow = ({ member }) => {
    const isMod = community.moderators.includes(currentUser.id);
    const isSelf = member.id === currentUser.id;
  
    const handleRemove = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities/${community._id}/remove-member`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId: member.id })
          }
        );
        if (!res.ok) throw new Error((await res.json()).error);
  
        setMembers(prev => prev.filter(m => m.id !== member.id));
        setCommunity(c => ({
          ...c,
          members: c.members.filter(id => id !== member.id)
        }));
      } catch (err) {
        alert("Failed to remove member");
        console.error(err);
      }
    };
  
    const handleMessageClick = async () => {
      try {
        if (!currentUser.id || member.id === currentUser.id) return;
        const token = localStorage.getItem("token");
        const chat = await createChat(member.id);
        navigate(`/chats/${chat._id}`);
      } catch (err) {
        console.error("Error creating chat:", err);
        alert("Failed to message user.");
      }
    };

   
    
  
    return (
      <div className="flex justify-between items-center py-2">
        <div className="flex items-center space-x-3">
          <img src={member.profile_picture} alt="" className="w-8 h-8 rounded-full" />
          <a href={`/profile/${member.id}`} className="text-amber-300 hover:text-amber-200 hover:underline">
            {member.username}
          </a>
        </div>
        <div className="flex space-x-2">
          {!isSelf && (
            <button
              className="text-xs bg-amber-400/20 border border-amber-400/50 text-amber-300 px-3 py-1 rounded-full hover:bg-amber-400/30 transition"
              onClick={handleMessageClick}
            >
              Message
            </button>
          )}
          {isMod && !isSelf && (
            <button
              className="text-xs bg-red-500 text-white px-3 py-1 rounded-full"
              onClick={handleRemove}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    );
  };
  
  const handleDeleteCommunity = async () => {
    if (!window.confirm("Are you sure you want to delete this community?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities/${community._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).error);
      alert("Community deleted.");
      navigate("/communities");
    } catch (err) {
      alert("Failed to delete community.");
      console.error(err);
    }
  };
  

  return (
    <div className="space-y-8">
      {/* Hero Header */}

      {community.banner_image && (
  <img
    src={community.banner_image}
    alt="Community Banner"
    className="w-full h-48 object-cover rounded-xl mb-6"
  />
)}

      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h1 className="font-calligraphy text-4xl text-white">
            {community.name}
          </h1>
          <p className="text-gray-100 mt-1 leading-snug">
            {community.description}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={toggleFavorite} className="text-2xl text-white/80 hover:text-white">
            {isFavorited ? "★" : "☆"}
          </button>
          {community.members.includes(currentUser.id) && (
    <>
      <button
        onClick={async () => {
          const chat = await createGroupChat(id);
          navigate(`/chats/${chat._id}`);
        }}
        className="bg-white/80 text-gray-800 px-4 py-2 rounded-full hover:bg-white"
      >
        Community Chat
      </button>

      <button
        onClick={() => setShowMembers(true)}
        className="bg-amber-400/20 border border-amber-400/50 text-amber-300 px-4 py-2 rounded-full hover:bg-amber-400/30 transition"
      >
        Show Members
      </button>
    </>
  )}

{community.createdBy === currentUser.id && (
  <>
    <button
      onClick={() => setShowEditModal(true)}
      className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600"
    >
      Edit
    </button>
    <button
      onClick={handleDeleteCommunity}
      className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
    >
      Delete
    </button>
  </>
)}

        </div>
      </div>

      {/* Membership Actions */}
      <div className="flex space-x-4">
        {!community.members.includes(currentUser.id) ? (
          community.type === "public" ? (
            <button onClick={handleJoin} className="bg-white/20 hover:bg-amber-500/40 text-white px-4 py-2 rounded-full transition">
              Join Community
            </button>
          ) : (
            <button onClick={handleRequestToJoin} className="bg-blue-400 text-white px-4 py-2 rounded-full">
              Request to Join
            </button>
          )
        ) : (
          <button onClick={handleLeave} className="bg-red-400 text-white px-4 py-2 rounded-full">
            Leave Community
          </button>
        )}
      </div>

      {/* Pending Join Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Join Requests</h2>
          <ul className="space-y-2">
            {pendingRequests.map(u => (
              <li key={u.id} className="flex justify-between items-center">
                <span className="text-gray-900">{u.username}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleRequest(u.id, "approve")}
                    className="px-3 py-1 bg-green-300 rounded-full text-green-800"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRequest(u.id, "reject")}
                    className="px-3 py-1 bg-red-300 rounded-full text-red-800"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create Post Form */}
      {community.members.includes(currentUser.id) ? (
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6">
        <h2 className="font-calligraphy text-3xl text-white mb-4">
          Share in {community.name}
        </h2>
        <PostComposer
          onPostCreated={newPost => setPosts(posts => [newPost, ...posts])}
          communityId={id}
        />
      </div>) : (
        <p className="text-gray-200">
          You must join this community to create a new post.
        </p>
      )}

      {/* Posts List (only for members) */}
      {community.members.includes(currentUser.id) ? (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-gray-200">No posts in this community yet.</p>
          ) : (
            posts.map(post => <PostCard key={post._id} post={post} />)
          )}
        </div>
      ) : (
        <p className="text-gray-200">
          You must join this community to see the posts.
        </p>
      )}

{showMembers && (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-900/95 backdrop-blur-md border border-white/20 w-full max-w-md max-h-[80vh] rounded-2xl p-6 overflow-y-auto space-y-4 relative shadow-2xl">
        <button
          className="absolute top-2 right-4 text-white/60 hover:text-white text-lg transition"
          onClick={() => setShowMembers(false)}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-white">Moderators</h2>
        {members.filter(m => community.moderators.includes(m.id)).map(m => (
          <MemberRow key={m.id} member={m} />
        ))}

        <hr className="my-2 border-white/10" />

        <h2 className="text-lg font-semibold text-white">Members</h2>
        {members
          .filter(m => !community.moderators.includes(m.id))
          .map(m => (
            <MemberRow key={m.id} member={m} />
          ))}
      </div>
    </div>
  )}

{showEditModal && (
  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
    <div className="bg-slate-900/95 backdrop-blur-md border border-white/20 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl">
      <button
        className="absolute top-2 right-4 text-white/60 hover:text-white text-lg transition"
        onClick={() => setShowEditModal(false)}
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-4 text-white">Edit Community</h2>

      <div className="space-y-4">
        <input
          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
          value={editForm.name}
          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Community Name"
        />
        <textarea
          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition resize-none"
          rows={3}
          value={editForm.description}
          onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Description"
        />
        <select
          className="w-full bg-slate-800 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
          value={editForm.type}
          onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-white/60 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-white/10 file:text-white/80 hover:file:bg-white/20 transition"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const fd = new FormData();
            fd.append("media", file);
            const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/media/upload", {
              method: "POST",
              body: fd
            });
            const [uploaded] = await res.json();
            setEditForm(f => ({ ...f, banner_image: uploaded.url }));
          }}
        />

        {editForm.banner_image && (
          <img src={editForm.banner_image} alt="Preview" className="h-32 rounded-xl w-full object-cover" />
        )}

        <button
          onClick={async () => {
            try {
              const token = localStorage.getItem("token");
              const res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities/${community._id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
              });
              if (!res.ok) throw new Error((await res.json()).error);
              const updated = await res.json();
              setCommunity(updated);
              setShowEditModal(false);
              alert("Community updated.");
            } catch (err) {
              alert("Failed to update community.");
              console.error(err);
            }
          }}
          className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-2 rounded-lg transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

    </div>

    
  );
  
}
