import React, { useState } from "react";

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     // Build payload with default category "grief support"
//     const payload = {
//       content,
//       media: [], // no media feature for now
//       categories: ["grief support"],
//     };

//     // Retrieve token from localStorage
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("Not authenticated. Please log in.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//posts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

// // Clone the response so we can safely attempt to parse JSON,
//     // but still fall back to text if JSON.parse blows up.
//     const clone = response.clone();

//     let body;
//     try {
//       body = await response.json();      // attempt JSON parse once
//     } catch (parseErr) {
//       const text = await clone.text();   // if JSON fails, grab raw text
//       throw new Error(text || "Unexpected non-JSON response");
//     }
    
//       if (!response.ok) {
//         // const errorData = await response.json();
//         throw new Error(body.error || body.message || "Post creation failed");
//       }

//       // const result = await response.json();
//       // console.log("Post created:", result);
//       // Call the callback to indicate post creation (e.g., switch tab or refresh feed)
//       if (onPostCreated) onPostCreated(body);
//       // Clear the content field
//       setContent("");
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const payload = {
    content,
    media: [],
    categories: ["grief support"],
  };

  const token = localStorage.getItem("token");
  if (!token) {
    setError("Not authenticated. Please log in.");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // — parse the body exactly once —
    const body = await response.json();

    if (!response.ok) {
      // use the field your server actually returns (error or message)
      throw new Error(body.error || body.message || "Post creation failed");
    }

    console.log("Post created:", body);
    if (onPostCreated) onPostCreated(body);
    setContent("");
  } catch (err) {
    console.error("Submit failed:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
      <h2 className="text-xl font-bold text-emerald-600 mb-4">Create a New Post</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          rows="4"
          required
        />
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
