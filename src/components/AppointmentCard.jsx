import React, { useState } from "react";
import { formatUk } from "../utils/datetime";
import StatusBadge from "./StatusBadge";
import { useTranslation } from 'react-i18next';

export default function AppointmentCard({
  appointment,
  role, // "user" or "therapist"
  onCancel,
  onReschedule,
  onDecision,
  onRescheduleDecision,
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleClick = async (action, ...args) => {
    if (!action) return;
    setLoading(true);
    try {
      await action(...args);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const otherPartyName =
    appointment.counterpart ||
    (role === "user"
      ? appointment.therapist?.username
      : appointment.user?.username) ||
    "Unknown";

  const status = appointment.status;
  const canUserReschedule = status === "confirmed";
  const canUserCancel = ["pending", "confirmed", "reschedule_pending"].includes(status);

  const showTherapistAcceptReject = role === "therapist" && status === "pending";
  const showTherapistCancel = role === "therapist" && status === "confirmed";
  const showTherapistRescheduleDecision = role === "therapist" && status === "reschedule_pending";

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-md mb-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-semibold text-lg text-white">{otherPartyName}</h3>
          <p className="text-white/70 text-sm mt-0.5">{formatUk(appointment.scheduled_at)}</p>

          {status === "reschedule_pending" && appointment.proposed_scheduled_at && (
            <p className="text-sm text-amber-300 mt-1">
              {t('appt.proposed')}: {formatUk(appointment.proposed_scheduled_at)}
            </p>
          )}

          <div className="mt-2">
            <StatusBadge status={status} />
          </div>

          {appointment.meet_url && status === "confirmed" && (
            <p className="text-xs text-white/50 mt-1">{t('appt.meetLink')}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          {role === "user" && status !== "cancelled" && status !== "rejected" && (
            <>
              {canUserReschedule && !!onReschedule && (
                <button
                  onClick={() => handleClick(onReschedule, appointment.id)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-amber-500/80 hover:bg-amber-500 text-white text-sm rounded-lg disabled:opacity-60 transition"
                >
                  {loading ? t('appt.working') : t('appt.reschedule')}
                </button>
              )}
              {canUserCancel && !!onCancel && (
                <button
                  onClick={() => handleClick(onCancel, appointment.id)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-sm rounded-lg disabled:opacity-60 transition"
                >
                  {loading ? t('appt.cancelling') : t('appt.cancel')}
                </button>
              )}
            </>
          )}

          {role === "therapist" && (
            <>
              {showTherapistAcceptReject && !!onDecision && (
                <>
                  <button
                    onClick={() => handleClick(onDecision, appointment.id, "accept")}
                    disabled={loading}
                    className="px-3 py-1.5 bg-green-500/80 hover:bg-green-500 text-white text-sm rounded-lg disabled:opacity-60 transition"
                  >
                    {loading ? t('appt.accepting') : t('appt.accept')}
                  </button>
                  <button
                    onClick={() => handleClick(onDecision, appointment.id, "reject")}
                    disabled={loading}
                    className="px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-sm rounded-lg disabled:opacity-60 transition"
                  >
                    {loading ? t('appt.rejecting') : t('appt.reject')}
                  </button>
                </>
              )}

              {showTherapistCancel && !!onCancel && (
                <button
                  onClick={() => handleClick(onCancel, appointment.id)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-sm rounded-lg disabled:opacity-60 transition"
                >
                  {loading ? t('appt.cancelling') : t('appt.cancel')}
                </button>
              )}

              {showTherapistRescheduleDecision && !!onRescheduleDecision && (
                <>
                  <button
                    onClick={() => handleClick(onRescheduleDecision, appointment.id, "accept")}
                    disabled={loading}
                    className="px-3 py-1.5 bg-green-500/80 hover:bg-green-500 text-white text-sm rounded-lg disabled:opacity-60 transition"
                  >
                    {loading ? t('appt.approving') : t('appt.acceptReschedule')}
                  </button>
                  <button
                    onClick={() => handleClick(onRescheduleDecision, appointment.id, "reject")}
                    disabled={loading}
                    className="px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-sm rounded-lg disabled:opacity-60 transition"
                  >
                    {loading ? t('appt.rejecting') : t('appt.rejectReschedule')}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
