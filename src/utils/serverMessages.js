// src/utils/serverMessages.js
//
// Backend services/controllers return their success & error messages in English.
// This module translates a received server message into the current UI language.
//
// Usage:
//   import { translateServerMessage as tServer } from "../utils/serverMessages";
//   alert(tServer(err.message));
//   setNotification({ message: tServer(data.error), type: "error" });
//
// Behaviour:
//   - English UI  → returns the message unchanged.
//   - Spanish UI  → exact-match lookup, then dynamic-pattern match,
//                   else falls back to the original English (never blank).

import i18n from "../i18n";

// ── 1) Exact static messages (English → Spanish) ─────────────────
const ES_MESSAGES = {
  "Account deleted successfully.": "Cuenta eliminada con éxito.",
  "All sessions revoked successfully.": "Todas las sesiones han sido revocadas con éxito.",
  "Alternatives required for propose_reschedule (ISO datetimes in Europe/London).":
    "Se requieren alternativas para proponer la reprogramación (fechas ISO en Europa/Londres).",
  "Alternatives required for propose_reschedule.":
    "Se requieren alternativas para proponer la reprogramación.",
  "Appointment cancelled successfully!": "¡Cita cancelada con éxito!",
  "Appointment has already been processed.": "La cita ya ha sido procesada.",
  "Appointment not found or unauthorized.": "Cita no encontrada o no autorizada.",
  "Appointment not found.": "Cita no encontrada.",
  "Appointment not in a state that can be proposed.":
    "La cita no está en un estado que permita proponer cambios.",
  "Appointment request sent successfully!": "¡Solicitud de cita enviada con éxito!",
  "Availability created successfully!": "¡Disponibilidad creada con éxito!",
  "Availability updated successfully!": "¡Disponibilidad actualizada con éxito!",
  "Cannot cancel an appointment that is already processed.":
    "No se puede cancelar una cita que ya ha sido procesada.",
  "Comment deleted successfully!": "¡Comentario eliminado con éxito!",
  "Comment not found.": "Comentario no encontrado.",
  "Community deleted successfully.": "Comunidad eliminada con éxito.",
  "Community not found": "Comunidad no encontrada",
  "Community not found.": "Comunidad no encontrada.",
  "Email already in use.": "El correo electrónico ya está en uso.",
  "Email not verified. Please verify your email before logging in.":
    "Correo no verificado. Por favor, verifica tu correo antes de iniciar sesión.",
  "Email verified successfully!": "¡Correo verificado con éxito!",
  "Error fetching messages.": "Error al obtener los mensajes.",
  "Error fetching user chats.": "Error al obtener los chats del usuario.",
  "Error sending message.": "Error al enviar el mensaje.",
  "Failed to delete account.": "No se pudo eliminar la cuenta.",
  "Failed to fetch chatbot response": "No se pudo obtener la respuesta del chatbot",
  "Failed to fetch user details": "No se pudieron obtener los datos del usuario",
  "Failed to fetch user details for messages":
    "No se pudieron obtener los datos del usuario para los mensajes",
  "Failed to fetch user details from PostgreSQL":
    "No se pudieron obtener los datos del usuario desde PostgreSQL",
  "Failed to send message": "No se pudo enviar el mensaje",
  "Internal server error.": "Error interno del servidor.",
  "Invalid action. Use 'flag', 'remove', or 'ignore'.":
    "Acción no válida. Usa 'flag', 'remove' o 'ignore'.",
  "Invalid alternative datetime.": "Fecha alternativa no válida.",
  "Invalid chosen_time.": "Hora seleccionada no válida.",
  "Invalid date or slot.": "Fecha u horario no válido.",
  "Invalid date/slot.": "Fecha/horario no válido.",
  "Invalid decision. Use 'accept' or 'reject'.":
    "Decisión no válida. Usa 'accept' o 'reject'.",
  "Invalid email": "Correo electrónico no válido",
  "Invalid newScheduledAt.": "Nueva fecha programada no válida.",
  "Invalid or expired password reset token.":
    "Token de restablecimiento de contraseña no válido o caducado.",
  "Invalid or expired token.": "Token no válido o caducado.",
  "Invalid password.": "Contraseña no válida.",
  "Invalid refresh token or already logged out.":
    "Token de actualización no válido o ya has cerrado sesión.",
  "Invalid refresh token.": "Token de actualización no válido.",
  "Invalid refresh token. Please log in again.":
    "Token de actualización no válido. Por favor, inicia sesión de nuevo.",
  "Invalid role.": "Rol no válido.",
  "Invalid scheduled_at format.": "Formato de fecha programada no válido.",
  "Join request sent successfully!": "¡Solicitud para unirte enviada con éxito!",
  "Letter deleted": "Carta eliminada",
  "Letter not found.": "Carta no encontrada.",
  "Logged out successfully. Token invalidated.":
    "Sesión cerrada con éxito. Token invalidado.",
  "Member added successfully.": "Miembro añadido con éxito.",
  "Member removed successfully.": "Miembro eliminado con éxito.",
  "Missing LEMONFOX_API_KEY in env": "Falta LEMONFOX_API_KEY en el entorno",
  "No account found with this email.":
    "No se encontró ninguna cuenta con este correo electrónico.",
  "No availability found for this therapist.":
    "No se encontró disponibilidad para este terapeuta.",
  "No availability set for this therapist.":
    "Este terapeuta no ha establecido disponibilidad.",
  "No contact email configured (set CONTACT_EMAIL or SMTP_USER)":
    "No hay correo de contacto configurado (define CONTACT_EMAIL o SMTP_USER)",
  "No messages found for this chat.": "No se encontraron mensajes para este chat.",
  "No pending proposal.": "No hay ninguna propuesta pendiente.",
  "No pending request found for this user.":
    "No se encontró ninguna solicitud pendiente para este usuario.",
  "No pending reschedule request for this appointment.":
    "No hay ninguna solicitud de reprogramación pendiente para esta cita.",
  "No user IDs provided.": "No se proporcionaron identificadores de usuario.",
  "Not found.": "No encontrado.",
  "Only confirmed appointments can be rescheduled.":
    "Solo se pueden reprogramar las citas confirmadas.",
  "Password reset link sent to your email.":
    "Se ha enviado un enlace para restablecer la contraseña a tu correo electrónico.",
  "Password reset successful. You can now log in with your new password.":
    "Restablecimiento de contraseña exitoso. Ya puedes iniciar sesión con tu nueva contraseña.",
  "Post deleted successfully.": "Publicación eliminada con éxito.",
  "Post not found": "Publicación no encontrada",
  "Post not found.": "Publicación no encontrada.",
  "Post removed successfully!": "¡Publicación eliminada con éxito!",
  "Post reported successfully!": "¡Publicación reportada con éxito!",
  "Query param `topic` is required": "El parámetro `topic` es obligatorio",
  "Registration successful. Please verify your email.":
    "Registro exitoso. Por favor, verifica tu correo electrónico.",
  "Reschedule accepted and confirmed.": "Reprogramación aceptada y confirmada.",
  "Reschedule proposal rejected. Original time kept.":
    "Propuesta de reprogramación rechazada. Se mantiene la hora original.",
  "Reschedule proposals sent.": "Propuestas de reprogramación enviadas.",
  "Reschedule request sent successfully!":
    "¡Solicitud de reprogramación enviada con éxito!",
  "Server error creating chat.": "Error del servidor al crear el chat.",
  "Slot already taken.": "El horario ya está ocupado.",
  "Successfully joined the community!": "¡Te has unido a la comunidad con éxito!",
  "Successfully left the community!": "¡Has abandonado la comunidad con éxito!",
  "The community could not be found": "No se pudo encontrar la comunidad",
  "Therapist has not set any availability.":
    "El terapeuta no ha establecido ninguna disponibilidad.",
  "Therapist has not set availability.":
    "El terapeuta no ha establecido disponibilidad.",
  "Therapist is not available at the requested time.":
    "El terapeuta no está disponible a la hora solicitada.",
  "Therapist not found": "Terapeuta no encontrado",
  "Therapist not found for this user.": "No se encontró terapeuta para este usuario.",
  "Therapist not found.": "Terapeuta no encontrado.",
  "Therapist record not found.": "No se encontró el registro del terapeuta.",
  "Therapist user not found.": "No se encontró el usuario terapeuta.",
  "This is a private community. Send a join request instead.":
    "Esta es una comunidad privada. Envía una solicitud para unirte.",
  "This is a public community. You can join directly.":
    "Esta es una comunidad pública. Puedes unirte directamente.",
  "This post does not belong to the specified community.":
    "Esta publicación no pertenece a la comunidad especificada.",
  "Time slot removed successfully!": "¡Horario eliminado con éxito!",
  "Transcription API error": "Error de la API de transcripción",
  "Unable to transcribe audio": "No se pudo transcribir el audio",
  Unauthorized: "No autorizado",
  "Unauthorized to delete this account.": "No autorizado para eliminar esta cuenta.",
  "Unauthorized to delete this comment.": "No autorizado para eliminar este comentario.",
  "Unauthorized to delete this community.": "No autorizado para eliminar esta comunidad.",
  "Unauthorized to delete this post.": "No autorizado para eliminar esta publicación.",
  "Unauthorized to update this community.": "No autorizado para actualizar esta comunidad.",
  "Unauthorized to update this post.": "No autorizado para actualizar esta publicación.",
  "Unauthorized: Admins only.": "No autorizado: solo administradores.",
  "Unauthorized: Only admins or moderators can approve requests.":
    "No autorizado: solo los administradores o moderadores pueden aprobar solicitudes.",
  "Unauthorized: Only moderators can add members.":
    "No autorizado: solo los moderadores pueden añadir miembros.",
  "Unauthorized: Only moderators can remove members.":
    "No autorizado: solo los moderadores pueden eliminar miembros.",
  "Unauthorized: Only moderators or admins can ban users.":
    "No autorizado: solo los moderadores o administradores pueden banear usuarios.",
  "Unauthorized: Only moderators or admins can remove posts.":
    "No autorizado: solo los moderadores o administradores pueden eliminar publicaciones.",
  "Unauthorized: Only moderators or admins can unban users.":
    "No autorizado: solo los moderadores o administradores pueden desbanear usuarios.",
  "Unauthorized: Only users or therapists can cancel sessions.":
    "No autorizado: solo los usuarios o terapeutas pueden cancelar sesiones.",
  "Unauthorized: You can only cancel your own appointments.":
    "No autorizado: solo puedes cancelar tus propias citas.",
  "Unauthorized: You can only cancel your own sessions.":
    "No autorizado: solo puedes cancelar tus propias sesiones.",
  "Unauthorized: You can only reschedule your own appointments.":
    "No autorizado: solo puedes reprogramar tus propias citas.",
  "Unauthorized: only moderators or the creator can view requests.":
    "No autorizado: solo los moderadores o el creador pueden ver las solicitudes.",
  "Unknown policy.": "Política desconocida.",
  "User banned successfully!": "¡Usuario baneado con éxito!",
  "User fetch failed": "No se pudo obtener el usuario",
  "User is already a member.": "El usuario ya es miembro.",
  "User is not a member of this community.":
    "El usuario no es miembro de esta comunidad.",
  "User is not banned.": "El usuario no está baneado.",
  "User not found or already deleted.": "Usuario no encontrado o ya eliminado.",
  "User not found.": "Usuario no encontrado.",
  "User unbanned successfully!": "¡Usuario desbaneado con éxito!",
  "You are already a member of this community.": "Ya eres miembro de esta comunidad.",
  "You are not part of this community. Please click join and post once approved":
    "No formas parte de esta comunidad. Haz clic en unirte y publica una vez aprobado.",
  "You have already reported this post.": "Ya has reportado esta publicación.",
  "You have already requested to join this community.":
    "Ya has solicitado unirte a esta comunidad.",
  "Your account has been banned.": "Tu cuenta ha sido baneada.",
  "Your account has been deactivated.": "Tu cuenta ha sido desactivada.",
  "Your post was removed due to content violations.":
    "Tu publicación fue eliminada por violaciones de contenido.",
  "audioUrl is required": "audioUrl es obligatorio",
  "chatId is required.": "chatId es obligatorio.",
  "chosen_time is required.": "chosen_time es obligatorio.",
  "date & slot are required.": "date y slot son obligatorios.",
  "date and timeSlot are required.": "date y timeSlot son obligatorios.",
  "date is required.": "date es obligatorio.",
  "date, oldSlot and newSlot are required.": "date, oldSlot y newSlot son obligatorios.",
  "date=YYYY-MM-DD is required": "date=YYYY-MM-DD es obligatorio",
  "name, email and message are required":
    "nombre, correo electrónico y mensaje son obligatorios",
  "proposed_slots is required (array of ISO datetimes).":
    "proposed_slots es obligatorio (array de fechas ISO).",
  "recipientId is required for one-to-one chat.":
    "recipientId es obligatorio para el chat individual.",
  "🚨 Your post was removed due to content moderation.":
    "🚨 Tu publicación fue eliminada por moderación de contenido.",
};

// ── 2) Dynamic messages (interpolated values kept, verbs translated) ──
// Verb map for past-participle words the backend interpolates.
const VERB_ES = {
  created: "creada",
  updated: "actualizada",
  deleted: "eliminada",
  confirmed: "confirmada",
  rejected: "rechazada",
  accepted: "aceptada",
  approved: "aprobada",
};
const verb = (w) => VERB_ES[w] || w;

const DYNAMIC_PATTERNS = [
  // "Post created/updated/deleted successfully!"
  { re: /^Post (\w+) successfully!$/, es: (m) => `¡Publicación ${verb(m[1])} con éxito!` },
  // "Appointment confirmed/rejected successfully!"
  { re: /^Appointment (\w+) successfully!$/, es: (m) => `¡Cita ${verb(m[1])} con éxito!` },
  // "Reschedule request accepted/rejected successfully!"
  { re: /^Reschedule request (\w+) successfully!$/, es: (m) => `¡Solicitud de reprogramación ${verb(m[1])} con éxito!` },
  // "Join request approved/rejected successfully!"
  { re: /^Join request (\w+) successfully!$/, es: (m) => `¡Solicitud para unirte ${verb(m[1])} con éxito!` },
  // "Unknown topic: <topic>"
  { re: /^Unknown topic: (.+)$/, es: (m) => `Tema desconocido: ${m[1]}` },
  // "Slot <slot> on <date> is now booked."
  { re: /^Slot (.+) on (.+) is now booked\.$/, es: (m) => `El horario ${m[1]} del ${m[2]} ahora está reservado.` },
  // "Slot <slot> on <date> marked as booked."
  { re: /^Slot (.+) on (.+) marked as booked\.$/, es: (m) => `El horario ${m[1]} del ${m[2]} marcado como reservado.` },
  // "Slot updated from <old> to <new> (policy: <policy>)."
  { re: /^Slot updated from (.+) to (.+) \(policy: (.+)\)\.$/, es: (m) => `Horario actualizado de ${m[1]} a ${m[2]} (política: ${m[3]}).` },
  // "Time slot <slot> on <date> removed (policy: <policy>)."
  { re: /^Time slot (.+) on (.+) removed \(policy: (.+)\)\.$/, es: (m) => `Horario ${m[1]} del ${m[2]} eliminado (política: ${m[3]}).` },
  // "All slots on <date> removed (policy: <policy>)."
  { re: /^All slots on (.+) removed \(policy: (.+)\)\.$/, es: (m) => `Todos los horarios del ${m[1]} eliminados (política: ${m[2]}).` },
  // "Conflict: <n> confirmed exists — cannot modify."
  { re: /^Conflict: (\d+) confirmed exists .*cannot modify\.$/, es: (m) => `Conflicto: existen ${m[1]} confirmada(s) — no se puede modificar.` },
  // "Cannot modify: <a> confirmed and <b> pending appointment(s) in this slot."
  { re: /^Cannot modify: (\d+) confirmed and (\d+) pending appointment\(s\) in this slot\.$/, es: (m) => `No se puede modificar: ${m[1]} confirmada(s) y ${m[2]} pendiente(s) en este horario.` },
];

/**
 * Translate a server-provided message into the current UI language.
 * @param {string} msg - the message received from the backend
 * @returns {string} translated message (or the original if unknown / English UI)
 */
export function translateServerMessage(msg) {
  if (msg == null) return msg;
  const text = String(msg).trim();
  if (i18n.language !== "es") return msg;

  // Exact match
  if (ES_MESSAGES[text]) return ES_MESSAGES[text];

  // Dynamic pattern match
  for (const { re, es } of DYNAMIC_PATTERNS) {
    const m = text.match(re);
    if (m) return es(m);
  }

  // Unknown → keep original (never blank)
  return msg;
}

export default translateServerMessage;
