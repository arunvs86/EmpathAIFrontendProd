import React, { useState, useEffect } from 'react';

export default function HabitLogEditor({ date, habits, logs = [], onSave, onCancel }) {
  const [state, setState] = useState({});

  useEffect(() => {
    const dstr = date.toDateString();
    const init = {};
    habits.forEach(h => {
      init[h._id] = logs
        .filter(l => l.habitId === h._id)
        .some(l => new Date(l.date).toDateString() === dstr);
    });
    setState(init);
  }, [date, habits, logs]);

  const toggle = id => setState(s => ({ ...s, [id]: !s[id] }));

  const handleSubmit = e => {
    e.preventDefault();
    onSave(date, state);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold">Log for {date.toLocaleDateString()}</h3>
        <div className="mt-4 space-y-2">
          {habits.map(h => (
            <label key={h._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!state[h._id]}
                onChange={() => toggle(h._id)}
              />
              {h.name}
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}