// import React from "react";
// import PostCard from "./PostCard";

// function PostList({ posts }) {
//   if (!posts || posts.length === 0) {
//     return <p className="text-gray-500">No posts available.</p>;
//   }

//   return (
//     <div>
//       {posts.map((post) => (
//         <PostCard key={post._id} post={post} />
//       ))}
//     </div>
//   );
// }

// export default PostList;


import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";

function PostList({ posts: initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);

  const handlePostUpdated = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  if (!posts || posts.length === 0) {
    return <p className="text-gray-500">No posts available.</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onPostUpdated={handlePostUpdated}
          onPostDeleted={handlePostDeleted}
        />
      ))}
    </div>
  );
}

export default PostList;

