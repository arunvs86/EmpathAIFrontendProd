import React, { useState,useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from 'react-i18next';

export default function ProfileEditModal({ userId, onClose, onSaved }) {
  const { t } = useTranslation();
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
    experience_years: isTherapist ? (stored?.Therapist?.experience_years ?? "") : "",
    license_number: isTherapist ? (stored?.Therapist?.license_number ?? "") : "",
    link: isTherapist ? (stored?.Therapist?.link ?? ""):"",
    // languages_spoken: isTherapist ? stored.languages_spoken.join(",") : undefined,
    languages_spoken: isTherapist && Array.isArray(stored?.Therapist?.languages_spoken)
  ? stored.Therapist.languages_spoken.join(",")
  : "",
  specialization_tags: isTherapist && Array.isArray(stored?.Therapist?.specialization_tags)
  ? stored.Therapist.specialization_tags.join(",")
  : "",

    session_duration: isTherapist ? (stored?.Therapist?.session_duration ?? "") : "",
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

  useEffect(() => {
    if (!isTherapist) return;
  
    const needsFetch =
      !stored?.Therapist ||
      stored?.Therapist?.license_number == null || // pick any key you consider required
      stored?.Therapist?.experience_years == null;
  
    if (!needsFetch) return;
  
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/therapists/therapistByUser/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const t = await res.json();
  
        // Prefill the form with what we got
        setForm((f) => ({
          ...f,
          experience_years: t?.experience_years ?? f.experience_years ?? "",
          license_number:   t?.license_number   ?? f.license_number   ?? "",
          link:             t?.link             ?? f.link             ?? "",
          languages_spoken: Array.isArray(t?.languages_spoken)
            ? t.languages_spoken.join(",")
            : (f.languages_spoken || ""),
          specialization_tags: Array.isArray(t?.specialization_tags)
            ? t.specialization_tags.join(",")
            : (f.specialization_tags || ""),
          session_duration: t?.session_duration ?? f.session_duration ?? "",
          appointment_types: Array.isArray(t?.appointment_types)
            ? t.appointment_types.join(",")
            : (f.appointment_types || ""),
        }));
  
        // Cache in localStorage so next open is instant
        const merged = { ...stored, Therapist: t };
        localStorage.setItem("user", JSON.stringify(merged));
      } catch (_) {
        /* ignore */
      }
    })();
  }, [isTherapist, userId]);

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("media", file);

      const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/media/upload", {
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
      const res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/users/${userId}`, {
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
          link: form.link,
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

      const res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/users/${userId}`, {
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


const inputCls = "w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition";
const selectCls = "w-full bg-slate-800 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition";
const labelCls = "block text-sm font-medium text-white/80 mt-4 mb-1";

return createPortal(
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-auto">
    <div className="bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-lg space-y-2 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
      <h2 className="text-xl font-semibold text-white">{t('profile.editTitle')}</h2>

      {/* Upload + preview */}
      <div className="space-y-2 mt-2">
        <label className={labelCls}>
          {t('profile.profilePicture')}
        </label>
        <div className="flex items-center gap-4">
          {form.profile_picture ? (
            <div className="relative">
              <img
                src={form.profile_picture}
                alt="Preview"
                className="h-24 w-24 rounded-full object-cover border-2 border-amber-400 shadow"
              />
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, profile_picture: "" }))}
                className="absolute top-0 right-0 bg-slate-800 border border-white/20 rounded-full text-xs px-2 py-0.5 hover:bg-red-500/20 text-red-300 shadow-sm"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="h-24 w-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm text-white/50">
              {t('profile.noPicture')}
            </div>
          )}

          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicUpload}
              className="block w-full text-sm text-white/60"
            />
            {uploading && <p className="text-xs text-white/50 mt-1">{t('profile.uploading')}</p>}
          </div>
        </div>
      </div>

      {/* Fields */}
      <label className={labelCls}>{t('profile.username')}</label>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        className={inputCls}
        placeholder="Username"
      />

      <label className={labelCls}>{t('profile.bio')}</label>
      <textarea
        name="bio"
        value={form.bio}
        onChange={handleChange}
        className={inputCls}
        placeholder="Bio"
      />

      <label className={labelCls}>{t('profile.dob')}</label>
      <input
        type="date"
        name="dob"
        value={form.dob}
        onChange={handleChange}
        className={inputCls}
      />

      <label className={labelCls}>{t('profile.gender')}</label>
      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        className={selectCls}
      >
        <option value="">{t('profile.selectGender')}</option>
        <option value="male">{t('profile.male')}</option>
        <option value="female">{t('profile.female')}</option>
        <option value="non-binary">{t('profile.nonBinary')}</option>
        <option value="prefer not to say">{t('profile.preferNotToSay')}</option>
      </select>

      <label className={labelCls}>{t('profile.country')}</label>
      <input
        type="text"
        name="country"
        value={form.country}
        onChange={handleChange}
        className={inputCls}
        placeholder="Country"
      />

      <label className={labelCls}>{t('profile.city')}</label>
      <input
        type="text"
        name="city"
        value={form.city}
        onChange={handleChange}
        className={inputCls}
        placeholder="City"
      />

      <label className="flex items-center gap-2 mt-4 text-white/80 cursor-pointer">
        <input
          type="checkbox"
          name="faith_support"
          checked={form.faith_support}
          onChange={handleChange}
          className="accent-amber-400"
        />
        {t('profile.faithSupport')}
      </label>

      {/* Therapist-only */}
      {isTherapist && (
        <>
          <label className={labelCls}>{t('profile.experienceYears')}</label>
          <input
            type="number"
            name="experience_years"
            value={form.experience_years}
            onChange={handleChange}
            className={inputCls}
            placeholder="Years of Experience"
          />

          <label className={labelCls}>{t('profile.licenseNumber')}</label>
          <input
            name="license_number"
            value={form.license_number}
            onChange={handleChange}
            className={inputCls}
            placeholder="License Number"
          />

          <label className={labelCls}>{t('profile.link')}</label>
          <input
            name="link"
            value={form.link}
            onChange={handleChange}
            className={inputCls}
            placeholder="Link"
          />

          <label className={labelCls}>{t('profile.languagesSpoken')}</label>
          <input
            name="languages_spoken"
            value={form.languages_spoken}
            onChange={handleChange}
            className={inputCls}
            placeholder={t('profile.languagesPlaceholder')}
          />

          <label className={labelCls}>{t('profile.specializationTags')}</label>
          <input
            name="specialization_tags"
            value={form.specialization_tags}
            onChange={handleChange}
            className={inputCls}
            placeholder={t('profile.specializationPlaceholder')}
          />

          <label className={labelCls}>{t('profile.sessionDuration')}</label>
          <input
            type="number"
            name="session_duration"
            value={form.session_duration}
            onChange={handleChange}
            className={inputCls}
            placeholder="Session Duration (mins)"
          />

          <label className={labelCls}>{t('profile.appointmentTypes')}</label>
          <input
            name="appointment_types"
            value={form.appointment_types}
            onChange={handleChange}
            className={inputCls}
            placeholder={t('profile.appointmentTypesPlaceholder')}
          />
        </>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
        <button
          onClick={() =>
            deleteConfirm
              ? handleDeleteAccount()
              : setDeleteConfirm(true)
          }
          className="text-red-300 text-sm hover:text-red-200 hover:underline transition"
        >
          {deleteConfirm ? t('profile.confirmDelete') : t('profile.deleteAccount')}
        </button>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition"
          >
            {t('profile.cancel')}
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              submitting ? "bg-white/20 text-white/50 cursor-not-allowed" : "bg-amber-400 hover:bg-amber-500 text-slate-900"
            }`}
          >
            {submitting ? t('profile.saving') : t('profile.saveChanges')}
          </button>
        </div>
      </div>
    </div>
  </div>,
  document.body
);
}
