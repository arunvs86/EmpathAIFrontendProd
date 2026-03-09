// pages/ProfilePosts.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostList from "../components/PostList";

export default function ProfilePosts() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/posts/user/${userId}?page=1&limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setPosts)
      .catch(console.error);
  }, [userId, token]);

  if (!posts.length) {
    return <p className="text-gray-500">No posts yet.</p>;
  }
  return <PostList posts={posts} />;
}
