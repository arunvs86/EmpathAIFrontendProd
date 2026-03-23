// src/components/CreateCommunity.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCommunity({ onCommunityCreated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    banner_image: "",
    type: "public",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    console.log("formData", formData)
    try {
      const res = await fetch(
        "https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/communities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Community creation failed");
      }
      const newCommunity = await res.json();
      onCommunityCreated?.(newCommunity);
      navigate("/communities");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 space-y-6">
      <h2 className="text-3xl font-calligraphy text-white">
        Create a New Community
      </h2>

      {error && <p className="text-red-300">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 text-white/80 font-medium">
            Community Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="e.g. Grief Support"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-white/80 font-medium">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Short description…"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition resize-none"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block mb-1 text-white/80 font-medium">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-white/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
  <label className="block mb-1 text-white/80 font-medium">
    Banner Image (optional)
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formDataUpload = new FormData();
      formDataUpload.append("media", file);

      try {
        const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/media/upload", {
          method: "POST",
          body: formDataUpload,
        });
        const [uploaded] = await res.json();
        setFormData(f => ({ ...f, banner_image: uploaded.url }));
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload banner image.");
      }
    }}
    className="block w-full text-sm text-white/60 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-white/10 file:text-white/80 hover:file:bg-white/20 transition"
  />
  {formData.banner_image && (
    <img
      src={formData.banner_image}
      alt="Preview"
      className="mt-2 rounded-xl w-full h-32 object-cover"
    />
  )}
</div>


        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold rounded-lg px-6 py-2 transition disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create Community"}
          </button>
        </div>
      </form>
    </div>
  );
}
