

// src/components/RightSidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Link as LinkIcon, Calendar, Clock } from "lucide-react";
import { fetchUpcomingAppointments } from "../services/appointmentApi";

export default function RightSidebar() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [countdowns, setCountdowns] = useState({});

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
          updates[appt.id] = getTimeRemaining(appt.scheduled_at);
        }
        return updates;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [upcoming, activeSection]);

  const toggleSection = (section) =>
    setActiveSection(activeSection === section ? null : section);

  // Card styles for consistency with left sidebar
  const cardClass =
    "flex items-center flex-shrink-0 gap-2 px-3 py-2 bg-white/20 hover:border border-amber-300 bg-white/40 rounded-2xl shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200";
  const iconClass = "w-5 h-5 text-white flex-shrink-0";
  const labelClass = "text-white font-semibold text-sm whitespace-nowrap";

  function getTimeRemaining(scheduledTime) {
    const total = new Date(scheduledTime) - new Date();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  
    return {
      total,
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
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
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
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
                  const countdown = countdowns[appt.id] || getTimeRemaining(appt.scheduled_at);
                  const within15Min =
                    countdown.total <= 15 * 60 * 1000 && countdown.total > 0;
                  const apptTime = new Date(appt.scheduled_at).toLocaleString();
  
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
      </div>
    </aside>
  );
  
}
