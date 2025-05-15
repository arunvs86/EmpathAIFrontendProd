// import React, { useState } from "react";
// import PostList from "../components/PostList";

// function MainContent() {
//   const [posts, setPosts] = useState([
//     {
//       _id: "p1",
//       userId: "user-123",
//       content: "This is my first post about grief support.",
//       media: ["https://via.placeholder.com/150"],
//       categories: ["grief", "support"],
//       anonymous: false,
//       status: "live",
//       comments: [
//         {
//           userId: "user-456",
//           text: "I'm here to support you!",
//           createdAt: new Date().toISOString(),
//         },
//       ],
//       helpful_feedback: [{ userId: "user-789", feedback: "Thanks for sharing" }],
//       reported_by: [],
//       createdAt: new Date().toISOString(),
//       lastEditedAt: null,
//     },
//     {
//       _id: "p2",
//       userId: "user-999",
//       content: "Feeling a bit anxious today...",
//       media: [],
//       categories: ["anxiety"],
//       anonymous: true,
//       status: "live",
//       comments: [],
//       helpful_feedback: [],
//       reported_by: [],
//       createdAt: new Date().toISOString(),
//       lastEditedAt: null,
//     },
//     // ...more dummy posts
//   ]);

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Posts</h2>
//       <PostList posts={posts} />
//     </div>
//   );
// }

// export default MainContent;


import React, { useState, useEffect } from "react";
import PostList from "./PostList";
import PostComposer from "./PostComposer"

function MainContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Retrieve token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Not authenticated. Please log in.");
        }

        // Make GET request to /posts with Authorization header
        const response = await fetch("https://empathaiv2-backend.onrender.com/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch posts.");
        }

        const data = await response.json();
        
        setPosts(data); // data should be an array of posts
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p className="text-gray-700">Loading posts...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (posts.length === 0) {
    return <p className="text-gray-500">No posts found.</p>;
  }

  return (
    <div>
       <PostComposer onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
  <h2 className="text-2xl font-bold mb-4">Posts</h2>
  <PostList posts={posts} />
    </div>
  );
}

export default MainContent;
