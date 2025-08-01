import React, { useState } from "react";
import { createPortal } from "react-dom";

export default function ProfileEditModal({ userId, onClose, onSaved }) {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const isTherapist = stored.role === "therapist";
  console.log("stored", stored.Therapist)
  const [form, setForm] = useState({
    username: stored.username || "",
    bio: stored.bio || "",
    profile_picture: stored.profile_picture || "",
    dob: stored.dob || "",
    gender: stored.gender || "",
    country: stored.country || "",
    city: stored.city || "",
    faith_support: stored.faith_support || false,
    // therapist fields
    experience_years: isTherapist ? stored?.Therapist?.experience_years : undefined,
    license_number: isTherapist ? stored?.Therapist?.license_number : undefined,
    // languages_spoken: isTherapist ? stored.languages_spoken.join(",") : undefined,
    languages_spoken: isTherapist && Array.isArray(stored?.Therapist?.languages_spoken)
  ? stored.Therapist.languages_spoken.join(",")
  : "",
  specialization_tags: isTherapist && Array.isArray(stored?.Therapist?.specialization_tags)
  ? stored.Therapist.specialization_tags.join(",")
  : "",

    session_duration: isTherapist ? stored?.Therapist?.session_duration : undefined,
    // appointment_types: isTherapist ? stored.appointment_types.join(",") : undefined,
    appointment_types: isTherapist && Array.isArray(stored?.Therapist?.appointment_types) ? stored.Therapist.appointment_types.join(",")
    : "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("media", file);

      const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//media/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const [uploaded] = await res.json(); // [{ url }]
      setForm(f => ({ ...f, profile_picture: uploaded.url }));
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete account");

      localStorage.clear();
      window.location.href = "/signup/user";
    } catch (err) {
      alert("Account deletion failed: " + err.message);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        username: form.username,
        bio: form.bio,
        profile_picture: form.profile_picture,
        dob: form.dob,
        gender: form.gender,
        country: form.country,
        city: form.city,
        faith_support: form.faith_support,
        ...(isTherapist && {
          experience_years: Number(form.experience_years),
          license_number: form.license_number,
          languages_spoken: form.languages_spoken.split(",").map(s => s.trim()),
          specialization_tags: form.specialization_tags
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
          .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()),
          session_duration: Number(form.session_duration),
          appointment_types: form.appointment_types.split(",").map(s => s.trim())
        })
      };

      const res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      const updated = await res.json();
      localStorage.setItem("user", JSON.stringify(updated.user || updated));
      onSaved();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };


return createPortal(
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-auto">
    <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4 my-8 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold">Edit Profile</h2>

      {/* Upload + preview */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Profile Picture
        </label>
        <div className="flex items-center gap-4">
          {form.profile_picture ? (
            <div className="relative">
              <img
                src={form.profile_picture}
                alt="Preview"
                className="h-24 w-24 rounded-full object-cover border-2 border-emerald-400 shadow"
              />
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, profile_picture: "" }))}
                className="absolute top-0 right-0 bg-white border rounded-full text-xs px-2 py-0.5 hover:bg-red-100 text-red-600 shadow-sm"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
              No Picture
            </div>
          )}

          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicUpload}
              className="block w-full text-sm text-gray-500"
            />
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
          </div>
        </div>
      </div>

      {/* Fields */}
      <label className="block text-sm font-medium text-gray-700 mt-4">Username</label>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        placeholder="Username"
      />

      <label className="block text-sm font-medium text-gray-700 mt-4">Bio</label>
      <textarea
        name="bio"
        value={form.bio}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        placeholder="Bio"
      />

      <label className="block text-sm font-medium text-gray-700 mt-4">Date of Birth</label>
      <input
        type="date"
        name="dob"
        value={form.dob}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <label className="block text-sm font-medium text-gray-700 mt-4">Gender</label>
      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="non-binary">Non-binary</option>
        <option value="prefer not to say">Prefer not to say</option>
      </select>

      <label className="block text-sm font-medium text-gray-700 mt-4">Country</label>
      <input
        type="text"
        name="country"
        value={form.country}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        placeholder="Country"
      />

      <label className="block text-sm font-medium text-gray-700 mt-4">City</label>
      <input
        type="text"
        name="city"
        value={form.city}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        placeholder="City"
      />

      <label className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          name="faith_support"
          checked={form.faith_support}
          onChange={handleChange}
        />
        Include faith-based support
      </label>

      {/* Therapist-only */}
      {isTherapist && (
        <>
          <label className="block text-sm font-medium text-gray-700 mt-4">Years of Experience</label>
          <input
            type="number"
            name="experience_years"
            value={form.experience_years}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Years of Experience"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">License Number</label>
          <input
            name="license_number"
            value={form.license_number}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="License Number"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Languages Spoken</label>
          <input
            name="languages_spoken"
            value={form.languages_spoken}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Languages (comma-separated)"
          />

<label className="block text-sm font-medium text-gray-700 mt-4">Specialization Tags</label>
          <input
            name="specialization_tags"
            value={form.specialization_tags}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Specialization Tags (comma separated)"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Session Duration (mins)</label>
          <input
            type="number"
            name="session_duration"
            value={form.session_duration}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Session Duration (mins)"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Appointment Types</label>
          <input
            name="appointment_types"
            value={form.appointment_types}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Appointment Types (comma-separated)"
          />
        </>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() =>
            deleteConfirm
              ? handleDeleteAccount()
              : setDeleteConfirm(true)
          }
          className="text-red-600 text-sm hover:underline"
        >
          {deleteConfirm ? "Click again to confirm delete" : "Delete Account"}
        </button>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className={`px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  </div>,
  document.body
);
}
