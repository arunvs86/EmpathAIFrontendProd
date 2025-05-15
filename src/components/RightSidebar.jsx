import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { fetchUpcomingAppointments } from "../services/appointmentApi";


function RightSidebar({}) {
  const navigate = useNavigate();
  // activeSection can be "helpful", "appointments", "upcoming", or "availability"
  const [activeSection, setActiveSection] = useState(null);

  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isTherapist = currentUser.role === "therapist";

  useEffect(() => {
    if (activeSection !== "upcoming") return;
    setLoading(true);
    setErr("");
    fetchUpcomingAppointments()
      .then((data) => setUpcoming(data))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [activeSection]);

  return (
    <aside className="w-full h-full p-4 space-y-6">
      {/* Helpful Links Accordion */}
      <div className="bg-white shadow rounded">
        <button
          onClick={() => toggleSection("helpful")}
          className="w-full text-left px-4 py-3 border-b border-gray-200 focus:outline-none"
        >
          <h3 className="text-lg font-semibold text-gray-700">Helpful Links</h3>
        </button>
        {activeSection === "helpful" && (
          <div className="p-4">
            <ul className="space-y-2 text-emerald-600">
              <li>
                <a
                  href="https://www.mind.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Mind UK
                </a>
              </li>
              <li>
                <a
                  href="https://www.cruse.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Cruse Bereavement Care
                </a>
              </li>
              <li>
                <a
                  href="https://www.samaritans.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Samaritans
                </a>
              </li>
              <li>
                <a
                  href="https://www.relate.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Relate UK
                </a>
              </li>
              <li>
                <a
                  href="https://www.mentalhealth.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Mental Health Foundation
                </a>
              </li>
              <li>
                <a
                  href="https://www.youngminds.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Young Minds
                </a>
              </li>
              <li>
                <a
                  href="https://www.griefencounter.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Grief Encounter
                </a>
              </li>
              <li>
                <a
                  href="https://www.childbereavementuk.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Child Bereavement UK
                </a>
              </li>
              <li>
                <a
                  href="https://www.sobs.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Survivors of Bereavement by Suicide (SOBS)
                </a>
              </li>
              <li>
                <a
                  href="https://www.crisistextline.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Crisis Text Line UK
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Book Appointments Accordion */}
      <div className="bg-white shadow rounded">
        <button
          onClick={() => toggleSection("appointments")}
          className="w-full text-left px-4 py-3 border-b border-gray-200 focus:outline-none"
        >
          <h3 className="text-lg font-semibold text-gray-700">Book Appointments</h3>
        </button>
        {activeSection === "appointments" && (
          <div className="p-4">
            <button
              onClick={() => navigate("/therapists")}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700"
            >
              Find a Therapist
            </button>
          </div>
        )}
      </div>

      {/* Upcoming Appointments Accordion */}
      <div className="bg-white shadow rounded">
        <button
          onClick={() => toggleSection("upcoming")}
          className="w-full text-left px-4 py-3 border-b border-gray-200 focus:outline-none"
        >
          <h3 className="text-lg font-semibold text-gray-700">
            Upcoming Appointments
          </h3>
        </button>
        {activeSection === "upcoming" && (
          <div className="p-4">
            {loading && <p>Loading…</p>}
            {err && <p className="text-red-500">{err}</p>}
            {!loading && !err && upcoming.length === 0 && (
              <p className="text-gray-600">No upcoming appointments.</p>
            )}
            {!loading &&
              !err &&
              upcoming.map((appt) => {
                const when = new Date(appt.scheduled_at).toLocaleString();
                return (
                  <div key={appt.id} className="mb-3">
                    <p className="text-gray-800">
                      With <strong>{appt.counterpart}</strong> on {when}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </div>


      {/* Therapist Availability Accordion (only visible to therapists) */}
      {isTherapist && (
        <div className="bg-white shadow rounded">
          <button
            onClick={() => navigate("/therapist/availability")}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700"
          >
            Add your Availability
          </button>
        </div>
      )}
    </aside>
  );
}

export default RightSidebar;
