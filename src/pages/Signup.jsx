// src/pages/Signup.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Lottie from "lottie-react";
// import signupAnim from "/src/signupAnim.json?url";
import signupAnim from '/src/signupAnim.json'   // adjust path to wherever your JSON lives

<Lottie animationData={signupAnim} />

// — Notification “toast” at top of form —
const NotificationPopup = ({ message, type, onClose }) => {
  const ref = useRef(null);

  // Scroll to notification when shown
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const bg = type === "success" ? "bg-green-100" : "bg-red-100";
  const border = type === "success" ? "border-green-400" : "border-red-400";
  const text = type === "success" ? "text-green-700" : "text-red-700";

  return (
    <div
      ref={ref}
      className={`${bg} ${border} ${text} border px-4 py-3 rounded relative mb-4`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <span
        onClick={onClose}
        className="absolute top-0 right-0 px-4 py-3 cursor-pointer text-xl"
      >
        &times;
      </span>
    </div>
  );
};

// — Dropdown/checkbox options —
const SPECIALIZATIONS = [
  { value: "Anxiety", label: "Anxiety" },
  { value: "Depression", label: "Depression" },
  { value: "Grief", label: "Grief" },
  { value: "Stress", label: "Stress" },
  { value: "Trauma", label: "Trauma" },
  { value: "Relationship", label: "Relationship" },
  { value: "Addiction", label: "Addiction" },
];
const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Mandarin", label: "Mandarin" },
  { value: "Hindi", label: "Hindi" },
];
const PERMISSIONS = ["ban_users", "remove_posts", "approve_therapists"];
const BOT_TYPES = [
  { value: "chatbot", label: "Chatbot" },
  { value: "moderation_bot", label: "Moderation Bot" },
  { value: "recommendation_ai", label: "Recommendation AI" },
];
const FEELINGS = [
  "Anxiety", "Depression", "Denial", "Grief",
  "Stress", "Loneliness", "Anger", "Fear"
];

export default function Signup() {
  const { type } = useParams();           // role: user | therapist | admin | bot
  const navigate = useNavigate();

  // — Notification state —
  const [notification, setNotification] = useState(null);

  // — Country / City dropdown —
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  // — DOB pickers —
  const [dobYear, setDobYear]   = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay]     = useState("");

  // — build arrays for years, months, days —
  const years = useMemo(() => {
    const now = new Date().getFullYear() - 14;
    const min = now - 86;
    const arr = [];
    for (let y = now; y >= min; y--) arr.push(y);
    return arr;
  }, []);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const days = useMemo(() => {
    if (!dobYear || !dobMonth) return Array.from({ length: 31 }, (_, i) => i + 1);
    return Array.from(
      { length: new Date(dobYear, dobMonth, 0).getDate() },
      (_, i) => i + 1
    );
  }, [dobYear, dobMonth]);

  // — full form state —
  const [formData, setFormData] = useState({
    username: "", email: "", password: "",
    dob: "", gender: "", country: "", city: "", bio: "",profile_picture: "",
    faith_support: false, showFeelings: false,
    current_feelings: [],
    // therapist fields
    specialization_tags: [], experience_years: "",
    license_number: "", languages_spoken: [],
    session_duration: "", appointment_types: [],
    availability_preference: "weekly_schedule",
    // admin / bot
    permissions: [], bot_type: ""
  });

  // — load country list once —
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/iso")
      .then(r => r.json())
      .then(d => d.data && setCountries(d.data.map(c => c.name).sort()));
  }, []);

  // — load cities whenever country changes —
  useEffect(() => {
    if (!formData.country) return setCities([]);
    fetch("https://countriesnow.space/api/v0.1/countries/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: formData.country })
    })
      .then(r => r.json())
      .then(d => Array.isArray(d.data) && setCities(d.data.sort()));
  }, [formData.country]);

  // — generic onChange handler —
  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setFormData(p => ({
      ...p,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // — for creatable multi‐selects —
  const handleCreatable = (field, sel) => {
    setFormData(p => ({
      ...p,
      [field]: sel ? sel.map(s => s.value) : []
    }));
  };

  // — toggle item in a list field (feelings / permissions) —
  const toggleList = (field, item) => {
    setFormData(p => {
      const list = p[field] || [];
      return {
        ...p,
        [field]: list.includes(item)
          ? list.filter(i => i !== item)
          : [...list, item]
      };
    });
  };

  // — assemble dob ISO once year/month/day are set —
  useEffect(() => {
    if (dobYear && dobMonth && dobDay) {
      const mm = String(dobMonth).padStart(2, "0");
      const dd = String(dobDay).padStart(2, "0");
      setFormData(p => ({ ...p, dob: `${dobYear}-${mm}-${dd}` }));
    }
  }, [dobYear, dobMonth, dobDay]);


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      setNotification({ message: "Only image files allowed", type: "error" });
      return;
    }
    if (!file) return;
    try {
      const formDataObj = new FormData();
      formDataObj.append("media", file);
  
      const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//media/upload", {
        method: "POST",
        body: formDataObj,
      });

  
      const [uploaded] = await res.json(); // Expecting: [{ url: '...' }]
      setFormData((prev) => ({ ...prev, profile_picture: uploaded.url }));
    } catch (err) {
      console.error("Upload error:", err);
      setNotification({ message: "Image upload failed", type: "error" });    }
  };

  
  // — submit handler —
  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.dob) {
      setNotification({ message: "Please select your DOB", type: "error" });
      return;
    }

    // build payload
    const userData = { ...formData, role: type ,  profile_picture: formData.profile_picture || ""};
    const payload = { userData };
    if (type === "therapist") {
      payload.roleData = {
        specialization_tags: formData.specialization_tags,
        experience_years: Number(formData.experience_years),
        license_number: formData.license_number,
        languages_spoken: formData.languages_spoken,
        session_duration: Number(formData.session_duration),
        appointment_types: formData.appointment_types,
        availability_preference: formData.availability_preference
      };
    } else if (type === "admin") {
      payload.roleData = { permissions: formData.permissions };
    } else if (type === "bot") {
      payload.roleData = { bot_type: formData.bot_type };
    }

    try {
      const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      setNotification({ message: "Signup successful! Please check your email and verify your account", type: "success" });
      setTimeout(() => navigate("/login"), 10000);

    } catch (err) {
      setNotification({ message: err.message, type: "error" });
    }
  };

  // — auto‐dismiss notification after 5s —
  // useEffect(() => {
  //   if (!notification) return;
  //   const t = setTimeout(() => setNotification(null), 5000);
  //   return () => clearTimeout(t);
  // }, [notification]);

  return (
    <div
  className="min-h-screen grid grid-cols-1 md:grid-cols-2"   style={{
    // backgroundImage: "url('/assets/wallpaperSignup.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
      
      {/* ── LEFT PANEL ── */}
      <div className="flex flex-col  bg-gray items-center justify-center px-12 text-black/90">
        <h2 className="text-4xl font-bold mb-4">Join EmpathAI</h2>
        <p className="text-center text-2xl italic mb-8">
          A digital home where you can share your story, find support, and heal together.
        </p>
        <div className="w-64 h-64 mb-8">
          <Lottie animationData={signupAnim} loop autoplay />
        </div>
        <ul className="space-y-3 text-lg">
          <li>🍃 Connect with caring communities</li>
          <li>✍️ Write in your personal journal</li>
          <li>🗣️ Chat one-on-one with our AI listener</li>
          <li>🤝 Join grief & wellness support groups</li>
        </ul>
      </div>


  
      <div className="flex items-center justify-center p-8
                  bg-white/10">
        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-bold text-center mb-6">
            Sign Up
          </h1>
          {notification && (
            <NotificationPopup
              {...notification}
              onClose={() => setNotification(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username / Email / Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full border border-black rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-black rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-black rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-black rounded px-3 py-2"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </div>
            </div>

            {/* Country / City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-black rounded px-3 py-2"
                >
                  <option value="">Select Country</option>
                  {countries.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!cities.length}
                  className="w-full border border-black rounded px-3 py-2"
                >
                  <option value="">Select City</option>
                  {cities.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block font-semibold mb-1">Date of Birth</label>
              <div className="flex gap-2">
                <select
                  value={dobYear}
                  onChange={e => setDobYear(e.target.value)}
                  required
                  className="flex-1 border border-black rounded px-3 py-2"
                >
                  <option value="">Year</option>
                  {years.map(y => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select
                  value={dobMonth}
                  onChange={e => setDobMonth(e.target.value)}
                  required
                  className="flex-1 border border-black rounded px-3 py-2"
                >
                  <option value="">Month</option>
                  {months.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={dobDay}
                  onChange={e => setDobDay(e.target.value)}
                  required
                  className="flex-1 border border-black rounded px-3 py-2"
                >
                  <option value="">Day</option>
                  {days.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block font-semibold mb-1">
                Tell us about yourself
              </label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className="w-full border border-black rounded px-3 py-2"
              />
            </div>

            <div>
  <label className="block font-semibold mb-1">Profile Picture (optional)</label>
  {formData.profile_picture && (
    <img
      src={formData.profile_picture}
      alt="Preview"
      className="h-24 w-24 rounded-full object-cover mb-2"
    />
  )}
  <input
    type="file"
    accept="image/*"
    onChange={handleFileUpload}
    className="w-full border border-black rounded px-3 py-2"
  />
</div>


            {/* Faith & Feelings */}
            <div className="flex items-center space-x-2">
              <input
                name="faith_support"
                type="checkbox"
                checked={formData.faith_support}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="font-semibold">
                Explore faith / spiritual support?
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                name="showFeelings"
                type="checkbox"
                checked={formData.showFeelings}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="font-semibold">
                Share what you’re currently feeling?
              </label>
            </div>
            {formData.showFeelings && (
              <div className="grid grid-cols-2 gap-2 border border-black rounded p-3">
                {FEELINGS.map(f => (
                  <label key={f} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.current_feelings.includes(f)}
                      onChange={() => toggleList("current_feelings", f)}
                      className="mr-2"
                    />
                    {f}
                  </label>
                ))}
              </div>
            )}

            {/* Therapist‐only section */}
            {type === "therapist" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Therapist Details</h2>
                <div>
                  <label className="block font-semibold mb-1">
                    Specialization Tags
                  </label>
                  <CreatableSelect
                    isMulti
                    options={SPECIALIZATIONS}
                    onChange={sel => handleCreatable("specialization_tags", sel)}
                    value={SPECIALIZATIONS.filter(o =>
                      formData.specialization_tags.includes(o.value)
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">
                      Experience (yrs)
                    </label>
                    <input
                      name="experience_years"
                      type="number"
                      min="0"
                      value={formData.experience_years}
                      onChange={handleChange}
                      className="w-full border border-black rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      License Number
                    </label>
                    <input
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleChange}
                      className="w-full border border-black rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    Languages Spoken
                  </label>
                  <CreatableSelect
                    isMulti
                    options={LANGUAGES}
                    onChange={sel => handleCreatable("languages_spoken", sel)}
                    value={LANGUAGES.filter(o =>
                      formData.languages_spoken.includes(o.value)
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">
                      Session Duration (mins)
                    </label>
                    <input
                      name="session_duration"
                      type="number"
                      min="15"
                      value={formData.session_duration}
                      onChange={handleChange}
                      className="w-full border border-black rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Appointment Types
                    </label>
                    <CreatableSelect
                      isMulti
                      options={[
                        { value: "text", label: "text" },
                        { value: "voice", label: "voice" },
                        { value: "video", label: "video" }
                      ]}
                      onChange={sel => handleCreatable("appointment_types", sel)}
                      value={[
                        { value: "text", label: "text" },
                        { value: "voice", label: "voice" },
                        { value: "video", label: "video" }
                      ].filter(o =>
                        formData.appointment_types.includes(o.value)
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    Availability Preference
                  </label>
                  <select
                    name="availability_preference"
                    value={formData.availability_preference}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="weekly_schedule">Weekly Schedule</option>
                    <option value="custom_dates">Custom Dates</option>
                  </select>
                </div>
              </div>
            )}

            {/* Admin / Bot Sections */}
            {type === "admin" && (
              <div>
                <h2 className="text-xl font-semibold">Admin Permissions</h2>
                <div className="grid grid-cols-2 gap-2">
                  {PERMISSIONS.map(p => (
                    <label key={p} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(p)}
                        onChange={() => toggleList("permissions", p)}
                        className="mr-2"
                      />
                      {p.replace(/_/g, " ")}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {type === "bot" && (
              <div>
                <h2 className="text-xl font-semibold">Bot Type</h2>
                <select
                  name="bot_type"
                  value={formData.bot_type}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Bot Type</option>
                  {BOT_TYPES.map(b => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded"
            >
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
        </div>
      </div>
  );
}
