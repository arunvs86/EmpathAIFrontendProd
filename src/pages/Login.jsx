import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Notification Popup Component
const NotificationPopup = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const borderColor = type === "success" ? "border-green-400" : "border-red-400";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";
  return (
    <div
      className={`${bgColor} ${borderColor} ${textColor} border px-4 py-3 rounded relative mb-4`}
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
      const response = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//auth/login", {
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
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setNotification({ message: error.message, type: "error" });
    }
  };

  // Handle forgot password submission
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const response = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net//auth/forgot-password", {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-md px-8 py-6">
        {notification && (
          <NotificationPopup
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <h1 className="text-3xl font-bold mb-6 text-center text-emerald-600">
          {showForgot ? "Reset Password" : "Welcome to EmpathAI"}
        </h1>

        {showForgot ? (
          <form onSubmit={handleForgotSubmit}>
            <div className="mb-4">
              <label htmlFor="forgotEmail" className="block text-gray-700 font-semibold mb-2">
                Enter your email to reset password
              </label>
              <input
                type="email"
                id="forgotEmail"
                name="forgotEmail"
                placeholder="Email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                className="text-sm text-gray-600 hover:underline"
                onClick={() => setShowForgot(false)}
              >
                ← Back to Login
              </button>
              <button
                type="submit"
                disabled={forgotLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              {/* <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                  className="mr-2"
                />
                Remember me
              </label> */}
              <button
                type="button"
                className="text-sm text-emerald-600 hover:underline"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                Login
              </button>
            </div>
          </form>
        )}

        {!showForgot && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate("/signup/user")}
                className="text-emerald-600 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
