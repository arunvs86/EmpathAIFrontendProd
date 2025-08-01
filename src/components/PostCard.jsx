import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createChat } from "../services/chatApi";
import { createPortal } from "react-dom";

function Modal({ children, onClose }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>,
    document.body
  );
}

function PostCard({ post, onPostUpdated, onPostDeleted }) {
  console.log("postInPH", post)
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

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportError, setReportError] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const [isSaved, setIsSaved] = useState(post.savedBy?.includes(currentUser.id));

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
      const response = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//posts/${post._id}`, {
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
      const response = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//posts/${post._id}`, {
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
        `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//posts/${post._id}/comments`
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
        `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//posts/${post._id}/comment`,
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
      console.log("addedComment",addedComment)
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

  const handleReport = async () => {
    if (!reportReason) {
      setReportError("Please select a reason.");
      return;
    }
    setReportLoading(true);
    setReportError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//posts/${post._id}/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            reason:      reportReason,
            description: reportDesc
          })
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Report failed");
      // locally flag the post
      onPostUpdated({
        ...post,
        status:      "flagged",
        reported_by: [...(post.reported_by||[]), currentUser.id]
      });
      setShowReportModal(false);
    } catch (err) {
      setReportError(err.message);
    } finally {
      setReportLoading(false);
    }
  };

  const handleToggleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
  
      const res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//posts/${post._id}/bookmark`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to toggle save");
      }
  
      setIsSaved(!isSaved);
      // update parent if needed:
      onPostUpdated({
        ...post,
        savedBy: isSaved
          ? post.savedBy?.filter(id => id !== currentUser.id)
          : [...(post.savedBy || []), currentUser.id],
      });
  
    } catch (err) {
      console.error("Bookmark error:", err.message);
    }
  };
  

  return (
    <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl hover:border border-amber-300 shadow-lg mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
        <NavLink to={`/profile/${post.userId}`}>

          <img src={avatarUrl} className="w-10 h-10 rounded-full"  alt="avatar" />
          </NavLink>
          <div className="text-white">
            <h2 className="font-semibold">{displayName}</h2>
            <p className="text-xs opacity-80">{createdAt}</p>
          </div>
        </div>

        <button
  onClick={handleToggleSave}
  title={isSaved ? "Unsave post" : "Save post"}
  className="text-yellow-300 hover:text-yellow-400 text-lg ml-auto"
>
  {isSaved ? "🔖" : "📑"}
</button>

        
        <span
          className={`px-2 py-1 text-s rounded-full font-bold hover:border border-amber-300 ${
            // post.status === "live"
            //   ? "bg-white/10"
            //   : 
              post.status === "flagged"
              ? "bg-red-200/20"
              : ""
          } text-white/90`}
        >
          {post.status === 'flagged' ? post.status : ""}
        </span>
      </div>

      {/* Community & Edited */}
      {(communityName || lastEdited) && (
        <div className="px-4 pb-2 flex justify-between text-xs text-white/80">
          {communityName && <span>Community: {communityName}</span>}
          {lastEdited && <span>Edited: {lastEdited}</span>}
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-3">
        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full bg-white/30 placeholder-white/70 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
              rows="4"
            />
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                className="text-white/80 hover:underline text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-white/30 hover:bg-white/40 text-white font-semibold py-2 px-4 rounded-lg text-sm"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-white whitespace-pre-line leading-relaxed">{post.content}</p>
        )}
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {post.media?.length > 0 && (
  <div className="px-4 pb-3">
    {post.media.length === 1 ? (
      // Single media: full-width, taller
      <div className="w-full">
        {(() => {
          const url = post.media[0];
          const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
          const isAudio = /\.(mp3|wav|ogg)$/i.test(url);
          if (isVideo) {
            return (
              <video
                src={url}
                controls
                className="w-full h-96 object-cover rounded-lg"
              />
            );
          } else if (isAudio) {
            return (
              <audio
                src={url}
                controls
                className="w-full"
              />
            );
          } else {
            return (
              <img
                src={url}
                alt=""
                className="w-full h-96 object-cover rounded-lg"
              />
            );
          }
        })()}
      </div>
    ) : (
      // Multiple media: responsive grid
      <div
        className={[
          "grid gap-3",
          post.media.length === 2
            ? "grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        ].join(" ")}
      >
        {post.media.map((url, i) => {
          const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
          const isAudio = /\.(mp3|wav|ogg)$/i.test(url);
          if (isVideo) {
            return (
              <video
                key={i}
                src={url}
                controls
                className="w-full h-48 object-cover rounded-lg"
              />
            );
          } else if (isAudio) {
            return (
              <audio
                key={i}
                src={url}
                controls
                className="w-full rounded-lg"
              />
            );
          } else {
            return (
              <img
                key={i}
                src={url}
                alt=""
                className="w-full h-48 object-cover rounded-lg"
              />
            );
          }
        })}
      </div>
    )}
  </div>
)}


      {/* Categories & Actions */}
      <div className="px-4 py-3 flex items-center justify-between text-lg font-bold">
        <div className="flex flex-wrap gap-2">
          {post.categories?.map((cat, i) => (
            <span
              key={i}
              className="bg-white/10 text-white/90 text-xs px-2 py-1 rounded-full hover:border border-amber-300"
            >
              {cat}
            </span>
          ))}
        </div>
        {isOwner && !isEditing && (
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-white/90 hover:underline text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-300 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-white/10 flex justify-between items-center">
       {/* Comments toggle on the left */}
       <button
         onClick={handleToggleComments}
         className="text-white/90 hover:underline text-sm"
       >
         {showComments ? "Hide Comments" : 'Comments'}
       </button>
       {/* Report + Message grouped on the right */}
       <div className="flex items-center gap-4">
         <button
           onClick={() => setShowReportModal(true)}
           className="text-yellow-300 hover:underline text-sm"
         >
           Report
         </button>
         {!isOwner && (
           <button
             onClick={handleMessageClick}
             className="bg-white/10 text-white py-1 px-3 rounded-lg text-sm hover:border border-amber-300"
           >
             Message
           </button>
         )}
       </div>
     </div>


      {/* Comments */}
      {showComments && (
        <div className="px-4 py-3 bg-white/10 space-y-4">
          <form onSubmit={handleAddComment} className="space-y-2">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full bg-white/10 placeholder-white/90 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-300"
              rows="2"
            />
            <button
              type="submit"
              className="bg-white/10 font-bold hover:border border-amber-300 text-white py-1 px-4 rounded-lg text-sm"
            >
              Add Comment
            </button>
          </form>
          {loadingComments && <p className="text-white/80 text-sm">Loading…</p>}
          {comments.map(c => (
            <div key={c._id} className="flex items-start gap-3">
              <img
                src={c.profile_picture || "/assets/avatar.png"}
                className="w-6 h-6 rounded-full"
                alt=""
              />
              <div className="text-white text-sm">
                <p className="font-semibold">{c.username ||c.commentUsername || c.userId}</p>
                <p className="opacity-80 text-xs">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
                <p>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

{showReportModal && (
        <Modal onClose={() => setShowReportModal(false)}>
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md text-black">
            <h2 className="text-xl font-semibold mb-4">Report Post</h2>

            <label className="block mb-2">
              Reason:
              <select
                className="mt-1 w-full p-2 border rounded"
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
              >
                <option value="">-- Select reason --</option>
                <option value="spam">Spam</option>
                <option value="abuse">Abuse</option>
                <option value="misinformation">Misinformation</option>
                <option value="harmful content">Harmful Content</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block mb-4">
              Details (optional):
              <textarea
                className="mt-1 w-full p-2 border rounded"
                rows="3"
                value={reportDesc}
                onChange={e => setReportDesc(e.target.value)}
                placeholder="Additional context..."
              />
            </label>

            {reportError && (
              <p className="text-red-600 text-sm mb-2">{reportError}</p>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={reportLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={reportLoading}
              >
                {reportLoading ? "Reporting…" : "Report"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
export default PostCard;
