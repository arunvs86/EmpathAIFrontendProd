import React from "react";

const MAP = {
  pending: { text: "Awaiting review", cls: "bg-amber-100 text-amber-800" },
  confirmed: { text: "Confirmed", cls: "bg-emerald-100 text-emerald-800" },
  rejected: { text: "Rejected", cls: "bg-red-100 text-red-700" },
  cancelled: { text: "Cancelled", cls: "bg-gray-200 text-gray-700" },
  reschedule_pending: { text: "Reschedule pending", cls: "bg-blue-100 text-blue-800" },
  no_show: { text: "No show", cls: "bg-gray-100 text-gray-700" },
};

export default function StatusBadge({ status }) {
  const s = MAP[status] || { text: status, cls: "bg-gray-100 text-gray-700" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s.cls}`}>
      {s.text}
    </span>
  );
}
