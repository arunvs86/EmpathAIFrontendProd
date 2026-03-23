// src/pages/Signup.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Lottie from "lottie-react";
import signupAnim from '/src/signupAnim.json'
import { useTranslation } from 'react-i18next';

<Lottie animationData={signupAnim} />

// — Notification "toast" at top of form —
const NotificationPopup = ({ message, type, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const cls = type === "success"
    ? "bg-green-500/20 border-green-400/50 text-green-300"
    : "bg-red-500/20 border-red-400/50 text-red-300";

  return (
    <div ref={ref} className={`${cls} border px-4 py-3 rounded-lg relative mb-4`} role="alert">
      <span className="block sm:inline">{message}</span>
      <span onClick={onClose} className="absolute top-0 right-0 px-4 py-3 cursor-pointer text-xl">&times;</span>
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
  "Stress", "Loneliness", "Anger", "Fear", "I'm okay", "Happy", "Helpful"
];

// — Dark theme styles for react-select —
const selectStyles = {
  control: (base, state) => ({
    ...base,
    background: 'rgba(255,255,255,0.08)',
    borderColor: state.isFocused ? '#fbbf24' : 'rgba(255,255,255,0.2)',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(251,191,36,0.4)' : 'none',
    borderRadius: '0.5rem',
    color: 'white',
    '&:hover': { borderColor: 'rgba(255,255,255,0.4)' },
  }),
  menu: (base) => ({
    ...base,
    background: '#1e293b',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '0.5rem',
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? '#334155' : 'transparent',
    color: 'white',
    cursor: 'pointer',
  }),
  multiValue: (base) => ({
    ...base,
    background: 'rgba(251,191,36,0.2)',
    borderRadius: '0.375rem',
  }),
  multiValueLabel: (base) => ({ ...base, color: 'white' }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'rgba(255,255,255,0.6)',
    ':hover': { background: 'rgba(251,191,36,0.3)', color: 'white' },
  }),
  placeholder: (base) => ({ ...base, color: 'rgba(255,255,255,0.35)' }),
  singleValue: (base) => ({ ...base, color: 'white' }),
  input: (base) => ({ ...base, color: 'white' }),
};

// — Shared input class —
const inputCls = "w-full bg-white/8 border border-white/20 text-white placeholder-white/35 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition";
const selectCls = "w-full bg-slate-800 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition";
const labelCls = "block text-white/80 font-medium mb-1";

export default function Signup() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');

  const [notification, setNotification] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [dobYear, setDobYear]   = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay]     = useState("");

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

  const [formData, setFormData] = useState({
    username: "", email: "", password: "",
    dob: "", gender: "", country: "", city: "", bio: "", profile_picture: "",
    faith_support: false, isSueRyderReference: false, showFeelings: false,
    current_feelings: [],
    specialization_tags: [], experience_years: "",
    license_number: "", link: "", languages_spoken: [],
    session_duration: "", appointment_types: [],
    availability_preference: "weekly_schedule",
    permissions: [], bot_type: ""
  });

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/iso")
      .then(r => r.json())
      .then(d => d.data && setCountries(d.data.map(c => c.name).sort()));
  }, []);

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

  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCreatable = (field, sel) => {
    setFormData(p => ({ ...p, [field]: sel ? sel.map(s => s.value) : [] }));
  };

  const toggleList = (field, item) => {
    setFormData(p => {
      const list = p[field] || [];
      return {
        ...p,
        [field]: list.includes(item) ? list.filter(i => i !== item) : [...list, item]
      };
    });
  };

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
      const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/media/upload", {
        method: "POST",
        body: formDataObj,
      });
      const [uploaded] = await res.json();
      setFormData((prev) => ({ ...prev, profile_picture: uploaded.url }));
    } catch (err) {
      console.error("Upload error:", err);
      setNotification({ message: "Image upload failed", type: "error" });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.dob) {
      setNotification({ message: "Please select your DOB", type: "error" });
      return;
    }
    const userData = { ...formData, role: type, profile_picture: formData.profile_picture || "" };
    const payload = { userData };
    if (type === "therapist") {
      payload.roleData = {
        specialization_tags: formData.specialization_tags,
        experience_years: Number(formData.experience_years),
        license_number: formData.license_number,
        link: formData.link,
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
      const res = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      setNotification({ message: "Signup successful! Please check your email and verify your account. Please check your junk folder in case you couldn't find the email.", type: "success" });
      setTimeout(() => navigate("/login"), 10000);
    } catch (err) {
      setNotification({ message: err.message, type: "error" });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative">
      <button
        onClick={toggleLang}
        className="absolute top-4 right-4 z-10 text-xs px-2.5 py-1 rounded-full border border-white/20 text-white/70 hover:text-amber-300 hover:border-amber-300/50 transition"
      >
        {i18n.language === 'en' ? 'ES' : 'EN'}
      </button>

      {/* ── LEFT PANEL ── */}
      <div className="flex flex-col items-center justify-center px-12 py-12 bg-white/5 border-r border-white/10">
        <h2 className="text-4xl font-calligraphy font-bold mb-4 text-amber-300">{t('auth.joinTitle')}</h2>
        <p className="text-center text-lg text-white/80 italic mb-8">
          {t('auth.joinSubtitle')}
        </p>
        <div className="w-64 h-64 mb-8">
          <Lottie animationData={signupAnim} loop autoplay />
        </div>
        <ul className="space-y-3 text-base text-white/90">
          <li>🍃 {t('auth.bullet1')}</li>
          <li>✍️ {t('auth.bullet2')}</li>
          <li>🗣️ {t('auth.bullet3')}</li>
          <li>🤝 {t('auth.bullet4')}</li>
        </ul>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex items-start justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-xl py-8">
          <h1 className="text-3xl font-calligraphy font-bold text-center mb-6 text-amber-300">
            {t('auth.signUpTitle')}
          </h1>
          {notification && (
            <NotificationPopup {...notification} onClose={() => setNotification(null)} />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username / Email / Password / Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{t('auth.username')}</label>
                <input name="username" value={formData.username} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{t('auth.email')}</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{t('auth.password')}</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} required className={inputCls} placeholder="••••••••" />
              </div>
              <div>
                <label className={labelCls}>{t('auth.gender')}</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={selectCls}>
                  <option value="">{t('auth.selectGender')}</option>
                  <option value="male">{t('auth.male')}</option>
                  <option value="female">{t('auth.female')}</option>
                  <option value="non-binary">{t('auth.nonBinary')}</option>
                  <option value="prefer not to say">{t('auth.preferNotToSay')}</option>
                </select>
              </div>
            </div>

            {/* Country / City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{t('auth.country')}</label>
                <select name="country" value={formData.country} onChange={handleChange} className={selectCls}>
                  <option value="">{t('auth.selectCountry')}</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>{t('auth.city')}</label>
                <select name="city" value={formData.city} onChange={handleChange} disabled={!cities.length} className={`${selectCls} disabled:opacity-40`}>
                  <option value="">{t('auth.selectCity')}</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className={labelCls}>{t('auth.dob')}</label>
              <div className="flex gap-2">
                <select value={dobYear} onChange={e => setDobYear(e.target.value)} required className={selectCls}>
                  <option value="">{t('auth.year')}</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={dobMonth} onChange={e => setDobMonth(e.target.value)} required className={selectCls}>
                  <option value="">{t('auth.month')}</option>
                  {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
                <select value={dobDay} onChange={e => setDobDay(e.target.value)} required className={selectCls}>
                  <option value="">{t('auth.day')}</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className={labelCls}>{t('auth.bio')}</label>
              <textarea name="bio" rows={3} value={formData.bio} onChange={handleChange} className={inputCls} />
            </div>

            {/* Profile Picture */}
            <div>
              <label className={labelCls}>{t('auth.profilePicture')}</label>
              {formData.profile_picture && (
                <img src={formData.profile_picture} alt="Preview" className="h-20 w-20 rounded-full object-cover mb-2 border-2 border-white/20" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-white/70 file:bg-amber-400 file:text-slate-900 file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:cursor-pointer file:mr-3 file:font-medium"
              />
            </div>

            {/* Sue Ryder */}
            <div>
              <label className={labelCls}>Were you referred by Sue Ryder or Treetops?</label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="isSueRyderReference" value="true"
                    checked={formData.isSueRyderReference === true}
                    onChange={() => setFormData(p => ({ ...p, isSueRyderReference: true }))}
                    className="accent-amber-400"
                  />
                  <span className="text-white/80">{t('auth.yes')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="isSueRyderReference" value="false"
                    checked={formData.isSueRyderReference === false}
                    onChange={() => setFormData(p => ({ ...p, isSueRyderReference: false }))}
                    className="accent-amber-400"
                  />
                  <span className="text-white/80">{t('auth.no')}</span>
                </label>
              </div>
            </div>

            {/* Faith & Feelings */}
            <div className="flex items-center gap-3">
              <input name="faith_support" type="checkbox" checked={formData.faith_support} onChange={handleChange} className="accent-amber-400 w-4 h-4" />
              <label className="text-white/80 font-medium cursor-pointer">{t('auth.faithSupport')}</label>
            </div>
            <div className="flex items-center gap-3">
              <input name="showFeelings" type="checkbox" checked={formData.showFeelings} onChange={handleChange} className="accent-amber-400 w-4 h-4" />
              <label className="text-white/80 font-medium cursor-pointer">{t('auth.shareFeelings')}</label>
            </div>

            {formData.showFeelings && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/15 rounded-xl p-4">
                  {FEELINGS.map(f => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer text-white/80 text-sm">
                      <input type="checkbox" checked={formData.current_feelings.includes(f)}
                        onChange={() => toggleList("current_feelings", f)}
                        className="accent-amber-400 w-4 h-4"
                      />
                      {f}
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder={t('auth.customFeelingPlaceholder')}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val && !formData.current_feelings.includes(val)) {
                        setFormData(p => ({ ...p, current_feelings: [...p.current_feelings, val] }));
                        e.target.value = "";
                      }
                    }
                  }}
                  className={inputCls}
                />
              </div>
            )}

            {/* Therapist-only section */}
            {type === "therapist" && (
              <div className="space-y-4 pt-2">
                <h2 className="text-lg font-semibold text-amber-300 border-b border-white/15 pb-2">{t('auth.therapistDetails')}</h2>
                <div>
                  <label className={labelCls}>{t('auth.specializationTags')}</label>
                  <CreatableSelect isMulti options={SPECIALIZATIONS} styles={selectStyles}
                    onChange={sel => handleCreatable("specialization_tags", sel)}
                    value={SPECIALIZATIONS.filter(o => formData.specialization_tags.includes(o.value))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{t('auth.experienceYears')}</label>
                    <input name="experience_years" type="number" min="0" value={formData.experience_years} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('auth.licenseNumber')}</label>
                    <input name="license_number" value={formData.license_number} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('auth.link')}</label>
                    <input name="link" value={formData.link} onChange={handleChange} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>{t('auth.languagesSpoken')}</label>
                  <CreatableSelect isMulti options={LANGUAGES} styles={selectStyles}
                    onChange={sel => handleCreatable("languages_spoken", sel)}
                    value={LANGUAGES.filter(o => formData.languages_spoken.includes(o.value))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{t('auth.sessionDuration')}</label>
                    <input name="session_duration" type="number" min="15" value={formData.session_duration} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('auth.appointmentTypes')}</label>
                    <CreatableSelect isMulti styles={selectStyles}
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
                      ].filter(o => formData.appointment_types.includes(o.value))}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>{t('auth.availabilityPreference')}</label>
                  <select name="availability_preference" value={formData.availability_preference} onChange={handleChange} className={selectCls}>
                    <option value="weekly_schedule">{t('auth.weeklySchedule')}</option>
                    <option value="custom_dates">{t('auth.customDates')}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Admin */}
            {type === "admin" && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-amber-300 border-b border-white/15 pb-2">{t('auth.adminPermissions')}</h2>
                <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/15 rounded-xl p-4">
                  {PERMISSIONS.map(p => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer text-white/80 text-sm">
                      <input type="checkbox" checked={formData.permissions.includes(p)}
                        onChange={() => toggleList("permissions", p)} className="accent-amber-400 w-4 h-4"
                      />
                      {p.replace(/_/g, " ")}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Bot */}
            {type === "bot" && (
              <div>
                <label className={labelCls}>{t('auth.botType')}</label>
                <select name="bot_type" value={formData.bot_type} onChange={handleChange} className={selectCls}>
                  <option value="">{t('auth.selectBotType')}</option>
                  {BOT_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold py-2.5 rounded-lg transition mt-2"
            >
              {t('auth.signUpButton')}
            </button>

            <p className="text-center text-sm text-white/60">
              {t('auth.haveAccount')}{" "}
              <Link to="/login" className="text-amber-300 hover:text-amber-200 transition">
                {t('auth.loginLink')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
