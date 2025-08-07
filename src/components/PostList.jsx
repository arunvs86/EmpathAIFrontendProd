// import React, { useState, useEffect } from "react";
// import PostCard from "./PostCard";

// function PostList({ posts: initialPosts }) {
//   const [posts, setPosts] = useState(initialPosts);

//   const handlePostUpdated = (updatedPost) => {
//     setPosts((prevPosts) =>
//       prevPosts.map((post) =>
//         post._id === updatedPost._id ? updatedPost : post
//       )
//     );
//   };

//   const handlePostDeleted = (postId) => {
//     setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
//   };

//   useEffect(() => {
//     setPosts(initialPosts);
//   }, [initialPosts]);

//   if (!posts || posts.length === 0) {
//     return <p className="text-gray-500">No posts available.</p>;
//   }

//   return (
//     <div>
//       {posts.map((post) => (
//         <PostCard
//           key={post._id}
//           post={post}
//           onPostUpdated={handlePostUpdated}
//           onPostDeleted={handlePostDeleted}
//         />
//       ))}
//     </div>
//   );
// }

// export default PostList;


// import React, { useState, useEffect } from "react";
// import PostCard from "./PostCard";

// export default function PostList({ posts: initialPosts}) {
//   const [posts, setPosts] = useState(initialPosts);

//   const handlePostUpdated = updatedPost =>
//     setPosts(ps => ps.map(p => (p._id === updatedPost._id ? updatedPost : p)));

//   const handlePostDeleted = id => setPosts(ps => ps.filter(p => p._id !== id));

//   useEffect(() => {
//     setPosts(initialPosts);
//   }, [initialPosts]);

//   if (!posts.length) {
//     return <p className="text-white/80">No posts available.</p>;
//   }

//   return (
//     <div className="space-y-6">
//       {posts.map(p => (
//         <PostCard
//           key={p._id}
//           post={p}
//           onPostUpdated={handlePostUpdated}
//           onPostDeleted={handlePostDeleted}
//         />
//       ))}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { motion, AnimatePresence } from "framer-motion";

export default function PostList({ posts: initialPosts }) {
  const POSTS_PER_PAGE = 10;

  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [posts, setPosts] = useState(initialPosts);
  const [loadingMore, setLoadingMore] = useState(false);

  const handlePostUpdated = updatedPost =>
    setPosts(ps => ps.map(p => (p._id === updatedPost._id ? updatedPost : p)));

  const handlePostDeleted = id =>
    setPosts(ps => ps.filter(p => p._id !== id));

  useEffect(() => {
    setPosts(initialPosts);
    setVisibleCount(POSTS_PER_PAGE); // reset visible count on refresh
  }, [initialPosts]);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(v => v + POSTS_PER_PAGE);
      setLoadingMore(false);
    }, 400); // simulate async delay
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {visiblePosts.map(p => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PostCard
              post={p}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-60"
            disabled={loadingMore}
          >
            {loadingMore ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                Loading…
              </span>
            ) : (
              "Show More"
            )}
          </button>
        </div>
      )}

      {(!posts || posts.length === 0) && (
        <p className="text-white/80 text-center">No posts available.</p>
      )}
    </div>
  );
}
