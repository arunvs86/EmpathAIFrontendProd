import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";

function CommunityDetail({ communityId, onBack }) {
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // For creating a post
  const [newPostContent, setNewPostContent] = useState("");
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Fetch community
        let response = await fetch(`https://empathaiv2-backend.onrender.com/communities/${communityId}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to fetch community");
        }
        const communityData = await response.json();

        // 2) Fetch posts for this community
        //    If your endpoint is GET /api/posts?community_id=xxx or something else
        response = await fetch(`https://empathaiv2-backend.onrender.com/posts/community/${communityId}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to fetch community posts");
        }
        const postData = await response.json();

        setCommunity(communityData);
        setPosts(postData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [communityId]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setCreateError("Not authenticated. Please log in.");
      setCreateLoading(false);
      return;
    }

    try {
      const response = await fetch("https://empathaiv2-backend.onrender.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newPostContent,
          community_id: communityId,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create post");
      }
      const newPost = await response.json();
      // Insert the new post at the top
      setPosts((prev) => [newPost, ...prev]);
      setNewPostContent("");
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) return <p className="text-gray-700">Loading community...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!community) return <p className="text-gray-500">Community not found.</p>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-emerald-600">
          {community.name}
        </h2>
        <button
          onClick={onBack}
          className="text-emerald-600 hover:underline"
        >
          Back
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <p className="text-gray-700 mb-2">{community.description}</p>
        <span
          className={`px-2 py-1 text-xs rounded ${
            community.type === "public"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {community.type === "public" ? "Public" : "Private"}
        </span>
      </div>

      {/* Create Post Form */}
      <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Create a Post in {community.name}
        </h3>
        {createError && <p className="text-red-600 mb-2">{createError}</p>}
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            rows="3"
            required
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={createLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {createLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts in this community yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default CommunityDetail;
