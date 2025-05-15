// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // for messaging
// import { createChat } from "../services/chatApi"; // we'll assume this exists
// // import current code as is

// function PostCard({ post, onPostUpdated, onPostDeleted }) {
//   const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const isOwner = currentUser && currentUser.id === post.userId;

//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(post.content);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Comments state
//   const [showComments, setShowComments] = useState(false);
//   const [comments, setComments] = useState(post.comments || []);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [newComment, setNewComment] = useState("");

//   const createdAt = post.createdAt ? new Date(post.createdAt).toLocaleString() : "";
//   const lastEdited = post.lastEditedAt ? new Date(post.lastEditedAt).toLocaleString() : null;
//   const displayName = post.anonymous ? "Anonymous" : post.username;
//   const avatarUrl = post.profile_picture || "/assets/avatar.png";
//   const communityName = post.communityId?.name || null;

//   const navigate = useNavigate(); // For messaging

//   // =========================
//   // 1) EDIT POST
//   // =========================
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     const token = localStorage.getItem("token");

//     try {
//       const response = await fetch(`https://empathaiv2-backend.onrender.com/posts/${post._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           content: editContent,
//           lastEditedAt: new Date().toISOString(),
//         }),
//       });
//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.error || "Failed to update post");
//       }
//       const updatedPost = await response.json();
//       onPostUpdated(updatedPost);
//       setIsEditing(false);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // 2) DELETE POST
//   // =========================
//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;
//     setLoading(true);
//     setError("");
//     const token = localStorage.getItem("token");

//     try {
//       const response = await fetch(`https://empathaiv2-backend.onrender.com/posts/${post._id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.error || "Failed to delete post");
//       }
//       onPostDeleted(post._id);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // 3) TOGGLE COMMENTS
//   // =========================
//   const handleToggleComments = async () => {
//     setShowComments(!showComments);
//     if (!showComments && comments.length === 0) {
//       await fetchComments();
//     }
//   };

//   const fetchComments = async () => {
//     setLoadingComments(true);
//     setError("");
//     try {
//       const response = await fetch(`https://empathaiv2-backend.onrender.com/posts/${post._id}/comments`);
//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.error || "Failed to fetch comments");
//       }
//       const data = await response.json();
//       setComments(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingComments(false);
//     }
//   };

//   const handleAddComment = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim()) return;
//     setError("");
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("Not authenticated. Please log in.");
//       return;
//     }
//     try {
//       const response = await fetch(`https://empathaiv2-backend.onrender.com/posts/${post._id}/comment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ text: newComment }),
//       });
//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.error || "Failed to add comment");
//       }
//       const addedComment = await response.json();
//       setComments((prev) => [addedComment, ...prev]);
//       setNewComment("");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // =========================
//   // 4) MESSAGE POST AUTHOR
//   // =========================
//   const handleMessageClick = async () => {
//     try {
//       if (!currentUser.id) {
//         alert("Please log in first.");
//         return;
//       }
//       // Avoid messaging yourself
//       if (post.userId === currentUser.id) {
//         alert("You can't message yourself.");
//         return;
//       }

//       // We'll call createChat with the post's author
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Not authenticated");
//         return;
//       }
//       const chat = await createChat(post.userId);
//       // Navigate to that chat
//       navigate(`/chats/${chat._id}`);
//     } catch (err) {
//       console.error("Error creating chat:", err);
//       alert("Failed to create or retrieve chat.");
//     }
//   };

//   return (
//     <div className="relative bg-white rounded-md shadow-sm border border-gray-200 mb-6 overflow-hidden hover:shadow-lg transition-all duration-200">
//       {/* Green accent border on the left */}
//       <div className="absolute top-0 left-0 h-full w-1 bg-emerald-500" />

//       {/* Header: Avatar, User Info & Timestamp */}
//       <div className="flex items-center justify-between p-4 bg-gray-50">
//         <div className="flex items-center space-x-3">
//           <img
//             src={avatarUrl}
//             alt="Avatar"
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <div>
//             <h2 className="text-sm font-bold text-gray-800">{displayName}</h2>
//             <p className="text-xs text-gray-500">{createdAt}</p>
//           </div>
//         </div>
//         <span
//           className={`px-3 py-1 text-xs font-semibold rounded-full ${
//             post.status === "live"
//               ? "bg-green-100 text-green-700"
//               : post.status === "flagged"
//               ? "bg-yellow-100 text-yellow-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {post.status}
//         </span>
//       </div>

//       {/* Sub-header: Community & Last Edited */}
//       {(communityName || lastEdited) && (
//         <div className="px-4 pt-2 text-xs text-gray-500 flex items-center justify-between">
//           {communityName && (
//             <p>
//               <span className="font-medium">Community:</span> {communityName}
//             </p>
//           )}
//           {lastEdited && <p className="italic">Last edited: {lastEdited}</p>}
//         </div>
//       )}

//       {/* Content Section */}
//       <div className="px-4 py-3">
//         {isEditing ? (
//           <form onSubmit={handleEditSubmit}>
//             <textarea
//               value={editContent}
//               onChange={(e) => setEditContent(e.target.value)}
//               className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//               rows="4"
//               required
//             />
//             <div className="flex justify-end mt-3 space-x-3">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsEditing(false);
//                   setEditContent(post.content);
//                 }}
//                 className="text-sm text-gray-600 hover:underline"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
//               >
//                 {loading ? "Saving..." : "Save"}
//               </button>
//             </div>
//           </form>
//         ) : (
//           <p className="text-gray-800 text-sm mb-2 whitespace-pre-line leading-relaxed">
//             {post.content}
//           </p>
//         )}
//         {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
//       </div>

//       {/* Media Section */}
//       {post.media && post.media.length > 0 && (
//         <div className="px-4 pb-3 grid grid-cols-2 gap-4">
//           {post.media.map((url, index) => (
//             <img
//               key={index}
//               src={url}
//               alt={`media-${index}`}
//               className="w-full h-32 object-cover rounded"
//             />
//           ))}
//         </div>
//       )}

//       {/* Footer: Categories, Stats, and Edit/Delete Actions */}
//       <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
//         <div className="flex items-center space-x-4">
//           {/* Categories */}
//           {post.categories && post.categories.length > 0 && (
//             <div className="flex space-x-2">
//               {post.categories.map((cat, idx) => (
//                 <span
//                   key={idx}
//                   className="bg-emerald-100 text-emerald-700 px-2 py-1 text-xs rounded"
//                 >
//                   {cat}
//                 </span>
//               ))}
//             </div>
//           )}
//           {/* Stats */}
//           <div className="text-xs flex space-x-3">
//             <span>{post.comments?.length || 0} comments</span>
//             {/* <span>{post.helpful_feedback?.length || 0} helpful</span> */}
//             <span>{post.reported_by?.length || 0} reports</span>
//           </div>
//         </div>
//         {/* Edit/Delete */}
//         {isOwner && !isEditing && (
//           <div className="flex space-x-4">
//             <button
//               onClick={() => setIsEditing(true)}
//               className="text-emerald-600 hover:underline"
//             >
//               Edit
//             </button>
//             <button
//               onClick={handleDelete}
//               disabled={loading}
//               className="text-red-600 hover:underline"
//             >
//               Delete
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Bottom Bar: Show Comments & Message */}
//       <div className="px-4 py-2 flex items-center justify-end bg-gray-50 space-x-4">
//         <button
//           onClick={handleToggleComments}
//           className="text-sm text-emerald-600 hover:underline"
//         >
//           {showComments ? "Hide Comments" : "Show Comments"}
//         </button>

//         {/* NEW: Message Button */}
//         {(!isOwner || post.userId !== currentUser.id) && (
//           <button
//             onClick={handleMessageClick}
//             className="text-sm text-white bg-emerald-600 px-3 py-1 rounded hover:bg-emerald-700"
//           >
//             Message
//           </button>
//         )}
//       </div>

//       {/* Comments Section */}
//       {showComments && (
//         <div className="bg-gray-50 px-4 py-3">
//           {loadingComments && (
//             <p className="text-gray-500 text-sm">Loading comments...</p>
//           )}

//           {/* Add Comment Form */}
//           <form onSubmit={handleAddComment} className="mb-4">
//             <textarea
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               placeholder="Write a comment..."
//               className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
//               rows="2"
//             />
//             <div className="flex justify-end mt-2">
//               <button
//                 type="submit"
//                 className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
//               >
//                 Add Comment
//               </button>
//             </div>
//           </form>

//           {/* Display Comments */}
//           {comments.length === 0 ? (
//             <p className="text-gray-500 text-sm">No comments yet.</p>
//           ) : (
//             <div className="space-y-3">
//               {comments.map((comment) => (
//                 <div key={comment._id} className="flex items-start space-x-3">
//                   <img
//                     src={comment.profile_picture || "/assets/avatar.png"}
//                     alt="Comment Avatar"
//                     className="w-6 h-6 rounded-full object-cover"
//                   />
//                   <div>
//                     <p className="text-sm font-bold text-gray-800">
//                       {comment.commentUsername || comment.userId}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {new Date(comment.createdAt).toLocaleString()}
//                     </p>
//                     <p className="text-sm text-gray-800">{comment.text}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default PostCard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChat } from "../services/chatApi";

function PostCard({ post, onPostUpdated, onPostDeleted }) {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = currentUser && currentUser.id === post.userId;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const createdAt = post.createdAt
    ? new Date(post.createdAt).toLocaleString()
    : "";
  const lastEdited = post.lastEditedAt
    ? new Date(post.lastEditedAt).toLocaleString()
    : null;
  const displayName = post.anonymous ? "Anonymous" : post.username;
  const avatarUrl = post.profile_picture || "/assets/avatar.png";
  const communityName = post.communityId?.name || null;
  const navigate = useNavigate();

  // 1) EDIT POST
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://empathaiv2-backend.onrender.com/posts/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editContent,
          lastEditedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update post");
      }
      const updatedPost = await response.json();
      onPostUpdated(updatedPost);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2) DELETE POST
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://empathaiv2-backend.onrender.com/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete post");
      }
      onPostDeleted(post._id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3) TOGGLE COMMENTS
  const handleToggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      await fetchComments();
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    setError("");
    try {
      const response = await fetch(
        `https://empathaiv2-backend.onrender.com/posts/${post._id}/comments`
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated. Please log in.");
      return;
    }
    try {
      const response = await fetch(
        `https://empathaiv2-backend.onrender.com/posts/${post._id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add comment");
      }
      const addedComment = await response.json();
      setComments((prev) => [addedComment, ...prev]);
      setNewComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  // 4) MESSAGE POST AUTHOR
  const handleMessageClick = async () => {
    try {
      if (!currentUser.id) {
        alert("Please log in first.");
        return;
      }
      if (post.userId === currentUser.id) {
        alert("You can't message yourself.");
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Not authenticated");
        return;
      }
      const chat = await createChat(post.userId);
      navigate(`/chats/${chat._id}`);
    } catch (err) {
      console.error("Error creating chat:", err);
      alert("Failed to create or retrieve chat.");
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow border border-gray-200 mb-6 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Accent line */}
      <div className="absolute top-0 left-0 h-full w-1 bg-emerald-500" />

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50">
        <div className="flex items-center space-x-3">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-sm font-bold text-gray-800">{displayName}</h2>
            <p className="text-xs text-gray-500">{createdAt}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            post.status === "live"
              ? "bg-green-100 text-green-700"
              : post.status === "flagged"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {post.status}
        </span>
      </div>

      {/* Community & Last Edited */}
      {(communityName || lastEdited) && (
        <div className="px-4 pt-2 text-xs text-gray-500 flex items-center justify-between">
          {communityName && (
            <p>
              <span className="font-medium">Community:</span> {communityName}
            </p>
          )}
          {lastEdited && <p className="italic">Last edited: {lastEdited}</p>}
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-3">
        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              rows="4"
              required
            />
            <div className="flex justify-end mt-3 space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content);
                }}
                className="text-sm text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-800 text-sm mb-2 whitespace-pre-line leading-relaxed">
            {post.content}
          </p>
        )}
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      </div>

      {/* ★ Improved Media Section */}
      {post.media && post.media.length > 0 && (
        <div className="px-4 pb-3">
          <div className="grid grid-cols-1 md:grid-cols gap-4">
            {post.media.map((url, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-lg group bg-gray-100"
              >
                <img
                  src={url}
                  alt={`media-${idx}`}
                  className="w-full max-h-96 object-cover transform transition-transform duration-200 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer: categories, stats, actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          {post.categories && post.categories.length > 0 && (
            <div className="flex space-x-2">
              {post.categories.map((cat, i) => (
                <span
                  key={i}
                  className="bg-emerald-100 text-emerald-700 px-2 py-1 text-xs rounded"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
          <div className="text-xs flex space-x-3">
            <span>{post.comments?.length || 0} comments</span>
            <span>{post.reported_by?.length || 0} reports</span>
          </div>
        </div>
        {isOwner && !isEditing && (
          <div className="flex space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-emerald-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Comments toggle & message */}
      <div className="px-4 py-2 flex items-center justify-end bg-gray-50 space-x-4">
        <button
          onClick={handleToggleComments}
          className="text-sm text-emerald-600 hover:underline"
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
        {(!isOwner || post.userId !== currentUser.id) && (
          <button
            onClick={handleMessageClick}
            className="text-sm text-white bg-emerald-600 px-3 py-1 rounded hover:bg-emerald-700"
          >
            Message
          </button>
        )}
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="bg-gray-50 px-4 py-3">
          {loadingComments && (
            <p className="text-gray-500 text-sm">Loading comments...</p>
          )}
          <form onSubmit={handleAddComment} className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              rows="2"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                Add Comment
              </button>
            </div>
          </form>
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-start space-x-3"
                >
                  <img
                    src={comment.profile_picture || "/assets/avatar.png"}
                    alt="Comment Avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {comment.commentUsername || comment.userId}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-800">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;
