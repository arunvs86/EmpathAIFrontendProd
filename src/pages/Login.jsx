import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

// Notification Popup Component
const NotificationPopup = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500/20 border-green-400/50 text-green-300" : "bg-red-500/20 border-red-400/50 text-red-300";
  return (
    <div
      className={`${bgColor} border px-4 py-3 rounded-lg relative mb-4`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <span
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
      >
        &times;
      </span>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [notification, setNotification] = useState(null);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle the "Remember me" checkbox
  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData.error || "Login failed");
      }
      const result = await response.json();

      // Store token and user
      if (result.accessToken) localStorage.setItem("token", result.accessToken);
      if (result.user) localStorage.setItem("user", JSON.stringify(result.user));

      setNotification({ message: result.message || "Login successful!", type: "success" });
      setTimeout(() => navigate("/about"), 1500);
    } catch (error) {
      setNotification({ message: error.message, type: "error" });
    }
  };

  // Handle forgot password submission
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const response = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
      }
      const result = await response.json();
      setNotification({ message: result.message, type: "success" });
      setShowForgot(false);
      setForgotEmail("");
    } catch (err) {
      setNotification({ message: err.message, type: "error" });
    } finally {
      setForgotLoading(false);
    }
  };

  // Auto-dismiss notifications
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-8 shadow-2xl relative">
        <button
          onClick={toggleLang}
          className="absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full border border-white/20 text-white/70 hover:text-amber-300 hover:border-amber-300/50 transition"
        >
          {i18n.language === 'en' ? 'ES' : 'EN'}
        </button>
        {notification && (
          <NotificationPopup
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <h1 className="text-3xl font-calligraphy font-bold mb-6 text-center text-amber-300">
          {showForgot ? t('auth.resetTitle') : t('auth.welcomeTitle')}
        </h1>

        {showForgot ? (
          <form onSubmit={handleForgotSubmit}>
            <div className="mb-4">
              <label htmlFor="forgotEmail" className="block text-white/80 font-semibold mb-2">
                Enter your email to reset password
              </label>
              <input
                type="email"
                id="forgotEmail"
                name="forgotEmail"
                placeholder={t('auth.emailLabel')}
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                className="text-sm text-white/70 hover:text-amber-300 transition"
                onClick={() => setShowForgot(false)}
              >
                ← {t('auth.backToLogin')}
              </button>
              <button
                type="submit"
                disabled={forgotLoading}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition disabled:opacity-60"
              >
                {forgotLoading ? "Sending..." : t('auth.sendResetLink')}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-white/80 font-semibold mb-2">
                {t('auth.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-white/80 font-semibold mb-2">
                {t('auth.passwordLabel')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                className="text-sm text-amber-300 hover:text-amber-200 transition"
                onClick={() => setShowForgot(true)}
              >
                {t('auth.forgotPassword')}
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold py-2 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
              >
                {t('auth.loginButton')}
              </button>
            </div>
          </form>
        )}

        {!showForgot && (
          <div className="mt-6 text-center">
            <p className="text-white/70">
              {t('auth.noAccount')}{' '}
              <button
                type="button"
                onClick={() => navigate("/signup/user")}
                className="text-amber-300 hover:text-amber-200 transition"
              >
                {t('auth.signUpLink')}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
