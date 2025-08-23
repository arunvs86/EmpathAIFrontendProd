// src/components/ConflictModal.jsx
import React, { useMemo, useState } from "react";

/**
 * props:
 * - open, onClose
 * - mode: 'delete' | 'edit' | 'deleteDate'
 * - ctx: { date, slot?, newSlot?, conflicts: {confirmed:[], pending:[], total}, suggested: [{label, iso}], onConfirm(policy, {alternatives?, newSlot?}) }
 */
export default function ConflictModal({ open, onClose, mode, ctx }) {
  const [policy, setPolicy] = useState("block_on_conflict");
  const [selected, setSelected] = useState(new Set());
  const [newSlot, setNewSlot] = useState(ctx?.newSlot || "");

  const hasConflicts = (ctx?.conflicts?.total || 0) > 0;

  const disabledExplain = useMemo(() => {
    if (policy === "propose_reschedule" && selected.size === 0) {
      return "Pick at least one alternative";
    }
    if (mode === "edit" && !newSlot) {
      return "Pick a replacement slot";
    }
    return null;
  }, [policy, selected, mode, newSlot]);

  if (!open) return null;

  const handleToggle = (iso) => {
    const s = new Set(selected);
    s.has(iso) ? s.delete(iso) : s.add(iso);
    setSelected(s);
  };

  const handleConfirm = () => {
    const alternatives = [...selected];
    ctx.onConfirm(policy, { alternatives, newSlot });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-5">
        <div className="mb-3">
          <h3 className="text-lg font-semibold">
            {mode === "delete" && `Delete slot ${ctx?.slot} on ${ctx?.date}?`}
            {mode === "edit" && `Edit slot ${ctx?.slot} on ${ctx?.date}`}
            {mode === "deleteDate" && `Delete all slots on ${ctx?.date}?`}
          </h3>
          {hasConflicts ? (
            <p className="text-sm text-red-600 mt-1">
              Conflicts: {ctx.conflicts.confirmed?.length || 0} confirmed,{" "}
              {ctx.conflicts.pending?.length || 0} pending.
            </p>
          ) : (
            <p className="text-sm text-emerald-700 mt-1">No conflicts.</p>
          )}
        </div>

        {/* Mode: edit needs a replacement slot */}
        {mode === "edit" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Replace with</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
            >
              <option value="" disabled>Pick a new slot…</option>
              {(ctx?.replacements || []).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Policy radio */}
        <div className="mb-3 space-y-2">
          <p className="text-sm font-medium">Conflict policy</p>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="pol"
              checked={policy === "block_on_conflict"}
              onChange={() => setPolicy("block_on_conflict")}
            />
            <span>Block on conflict (default)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="pol"
              checked={policy === "reject_pending"}
              onChange={() => setPolicy("reject_pending")}
              disabled={ctx?.conflicts?.confirmed?.length > 0}
            />
            <span className={ctx?.conflicts?.confirmed?.length > 0 ? "text-gray-400" : ""}>
              Reject pending (cannot if confirmed exists)
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="pol"
              checked={policy === "propose_reschedule"}
              onChange={() => setPolicy("propose_reschedule")}
            />
            <span>Propose reschedule (pick alternatives)</span>
          </label>
        </div>

        {/* Alternatives picker for proposals */}
        {policy === "propose_reschedule" && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Alternative times</p>
            <div className="max-h-40 overflow-auto border rounded p-2 space-y-2">
              {(ctx?.suggested || []).map((opt) => (
                <label key={opt.iso} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.has(opt.iso)}
                    onChange={() => handleToggle(opt.iso)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
              {(!ctx?.suggested || ctx.suggested.length === 0) && (
                <div className="text-sm text-gray-500">No other free slots found.</div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 rounded border" onClick={onClose}>Cancel</button>
          <button
            className={`px-4 py-2 rounded text-white ${
              disabledExplain ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
            onClick={handleConfirm}
            disabled={!!disabledExplain}
            title={disabledExplain || ""}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
