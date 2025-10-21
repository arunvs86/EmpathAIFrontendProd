// src/components/RightSidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Link as LinkIcon, Calendar, Clock, Mail, X } from "lucide-react";
import { fetchUpcomingAppointments } from "../services/appointmentApi";
 import { DateTime } from "luxon";

const API = "https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net";

export default function RightSidebar() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [countdowns, setCountdowns] = useState({});

  // NEW: contact modal state
  const [openContact, setOpenContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactMsg, setContactMsg] = useState({ type: null, text: "" });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isTherapist = user.role === "therapist";

  useEffect(() => {
    if (activeSection === "upcoming") {
      setLoading(true);
      setErr("");
      fetchUpcomingAppointments()
        .then((data) => setUpcoming(data))
        .catch((e) => setErr(e.message))
        .finally(() => setLoading(false));
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== "upcoming") return;
    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updates = {};
        for (const appt of upcoming) {
          // updates[appt.id] = getTimeRemaining(appt.scheduled_at);
          updates[appt.id] = getTimeRemaining(appt.scheduled_at, appt.scheduled_at_uk_iso);
        }
        return updates;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [upcoming, activeSection]);

  const toggleSection = (section) =>
    setActiveSection(activeSection === section ? null : section);

  // Card styles
  const cardClass =
    "flex items-center flex-shrink-0 gap-2 px-3 py-2 bg-white/20 hover:border border-amber-300 bg-white/40 rounded-2xl shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200";
  const iconClass = "w-5 h-5 text-white flex-shrink-0";
  const labelClass = "text-white font-semibold text-sm whitespace-nowrap";

  function getTimeRemaining(scheduledAt, scheduledAtUkIso) {
       // Normalize to a UK DateTime first
       const target = scheduledAtUkIso
         ? DateTime.fromISO(scheduledAtUkIso, { setZone: true })
         : DateTime.fromISO(scheduledAt, { setZone: true }).setZone("Europe/London");
    
       const nowUk = DateTime.now().setZone("Europe/London");
       const diffMs = target.toMillis() - nowUk.toMillis();
    
       const total = diffMs;
       const totalSec = Math.max(0, Math.floor(total / 1000));
       const hours = Math.floor(totalSec / 3600);
       const minutes = Math.floor((totalSec % 3600) / 60);
       const seconds = totalSec % 60;
    
       return {
         total,
         hours: String(hours).padStart(2, "0"),
         minutes: String(minutes).padStart(2, "0"),
         seconds: String(seconds).padStart(2, "0"),
       };

  // --- Contact modal helpers ---
  const validateContact = ({ name, email, message }) => {
    if (!name?.trim()) return "Please enter your name.";
    if (!email?.trim()) return "Please enter your email.";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) return "Please enter a valid email address.";
    if (!message?.trim()) return "Please enter your message.";
    return null;
  };

  const submitContact = async (e) => {
    e.preventDefault();
    setContactMsg({ type: null, text: "" });

    // prefill from user if blank
    const payload = {
      name: contactForm.name?.trim() || user?.username || "Anonymous",
      email: contactForm.email?.trim() || user?.email || "",
      message: contactForm.message?.trim(),
      page: window.location.pathname,
    };

    const validationErr = validateContact(payload);
    if (validationErr) {
      setContactMsg({ type: "error", text: validationErr });
      return;
    }

    setContactSubmitting(true);
    try {
      const res = await fetch(`${API}/users/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // public endpoint; no auth needed
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to send message");
      setContactMsg({ type: "success", text: "Thanks! We’ve received your message." });
      setContactForm({ name: "", email: "", message: "" });
      // auto-close after a moment
      setTimeout(() => setOpenContact(false), 1200);
    } catch (e) {
      setContactMsg({ type: "error", text: e.message || "Something went wrong." });
    } finally {
      setContactSubmitting(false);
    }
  };
  }
  return (
    <aside className="w-full h-full p-4">
      <div className="flex flex-col gap-3">
        {/* Helpful Links */}
        <div>
          <button onClick={() => toggleSection("helpful")} className={cardClass}>
            <LinkIcon className={iconClass} />
            <span className={labelClass}>Helpful Links</span>
          </button>
          {activeSection === "helpful" && (
            <ul className="ml-8 space-y-1 text-white/90 text-sm">
              {[
                ["Mind UK", "https://www.mind.org.uk"],
                ["Cruse", "https://www.cruse.org.uk"],
                ["Samaritans", "https://www.samaritans.org"],
                ["Relate UK", "https://www.relate.org.uk"],
                ["Mental Health Foundation", "https://www.mentalhealth.org.uk"],
                ["Young Minds", "https://www.youngminds.org.uk"],
                ["Grief Encounter", "https://www.griefencounter.org.uk"],
                ["Child Bereavement UK", "https://www.childbereavementuk.org"],
                ["SOBS", "https://www.sobs.org.uk"],
                ["Crisis Text Line UK", "https://www.crisistextline.uk"],
              ].map(([label, url]) => (
                <li key={label}>
                  <a href={url} target="_blank" rel="noreferrer" className="hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Book Appointments */}
        <div>
          <button onClick={() => navigate("/therapists")} className={cardClass}>
            <Calendar className="w-4 h-4" />
            <span className={labelClass}>Book Appointments</span>
          </button>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <button onClick={() => toggleSection("upcoming")} className={cardClass}>
            <Clock className={iconClass} />
            <span className={labelClass}>Upcoming Appointments</span>
          </button>

          {activeSection === "upcoming" && (
            <ul className="ml-8 space-y-2 text-white/90 text-sm mt-2">
              {loading && <li>Loading…</li>}
              {err && <li className="text-red-300">{err}</li>}
              {!loading && !err && upcoming.length === 0 && <li>No upcoming.</li>}
              {!loading &&
                !err &&
                upcoming.map((appt) => {
                  // const countdown = countdowns[appt.id] || getTimeRemaining(appt.scheduled_at);
                  const countdown = countdowns[appt.id] || getTimeRemaining(appt.scheduled_at, appt.scheduled_at_uk_iso);

                  const within15Min = countdown.total <= 15 * 60 * 1000 && countdown.total > 0;

                  // const apptTime = new Date(appt.scheduled_at).toLocaleString();
                  const ukISO = appt.scheduled_at_uk_iso || DateTime
   .fromISO(appt.scheduled_at, { setZone: true })
   .setZone("Europe/London")
   .toISO({ suppressMilliseconds: true, includeOffset: true });

 const apptDT = DateTime.fromISO(ukISO, { setZone: true }); // stays in UK zone
 const apptTime = apptDT.toFormat("dd LLL yyyy, HH:mm 'UK'");

                  return (
                    <li key={appt.id} className="space-y-1">
                      <div>
                        With <strong>{appt.counterpart}</strong> at {apptTime}
                      </div>

                      <div className="relative group">
                        <button
                          disabled={!within15Min}
                          onClick={() => window.open(appt.meet_url, "_blank")}
                          className={`mt-1 text-xs px-3 py-1 rounded-lg transition
                            ${
                              within15Min
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-400 text-gray-200 cursor-not-allowed"
                            }`}
                        >
                          Join Session
                        </button>

                        {!within15Min && (
                          <div className="absolute z-10  ml-2 mt-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-52">
                            Link will be enabled 15 minutes before the meeting
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>

        {/* Therapist Availability */}
        {isTherapist && (
          <button
            onClick={() => navigate("/therapist/availability")}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Add Availability</span>
          </button>
        )}

        {/* Contact Us (opens modal) */}
        <button onClick={() => setOpenContact(true)} className={cardClass}>
          <Mail className={iconClass} />
          <span className={labelClass}>Get in touch with us</span>
        </button>
      </div>

      {/* Modal */}
      {openContact && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenContact(false)} />
          {/* Dialog */}
          <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white/95 backdrop-blur p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Get in touch with us</h3>
              <button
                onClick={() => setOpenContact(false)}
                className="p-1 rounded hover:bg-gray-200"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <form onSubmit={submitContact} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Your name</label>
                <input
                  type="text"
                  className="w-full text-gray-800 rounded-lg border px-3 py-2"
                  value={contactForm.name}
                  onChange={(e) => setContactForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder={user?.username ? `${user.username} (editable)` : "Jane Doe"}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full text-gray-800 rounded-lg border px-3 py-2"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((s) => ({ ...s, email: e.target.value }))}
                  placeholder={user?.email ? `${user.email} (editable)` : "you@example.com"}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full text-gray-800 rounded-lg border px-3 py-2"
                  value={contactForm.message}
                  onChange={(e) => setContactForm((s) => ({ ...s, message: e.target.value }))}
                  placeholder="How can we help?"
                />
              </div>

              {contactMsg.text && (
                <div
                  className={`text-sm ${
                    contactMsg.type === "error" ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {contactMsg.text}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border"
                  onClick={() => setOpenContact(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className={`px-4 py-2 rounded-lg text-white ${
                    contactSubmitting ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {contactSubmitting ? "Sending…" : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
  }