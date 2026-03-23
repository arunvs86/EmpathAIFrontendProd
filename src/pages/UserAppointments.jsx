import React, { useEffect, useState } from "react";
import {
  fetchUpcomingAppointments,
  cancelAppointment,
  requestReschedule,
} from "../services/appointmentApi";
import AppointmentCard from "../components/AppointmentCard";
import { useTranslation } from 'react-i18next';

export default function UserAppointments() {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load appointments on mount
  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    setLoading(true);
    try {
      const data = await fetchUpcomingAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Cancel appointment
  async function handleCancel(id) {
    await cancelAppointment(id);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
    );
  }

  // Request reschedule
  async function handleReschedule(id, newDate) {
    await requestReschedule(id, newDate);
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "reschedule_pending" } : a
      )
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">{t('appt.myTitle')}</h1>
      {loading && <p className="text-white/70">{t('appt.loading')}</p>}
      {!loading && appointments.length === 0 && <p className="text-white/70">{t('appt.noUpcoming')}</p>}
      {appointments.map((appt) => (
        <AppointmentCard
          key={appt.id}
          appointment={appt}
          role="user"
          onCancel={handleCancel}
          onReschedule={handleReschedule}
        />
      ))}
    </div>
  );
}
