import React, { useState } from 'react';

export default function HabitEditor({ habit = {}, onSave, onCancel }) {
  const [name, setName] = useState(habit.name || '');
  const [description, setDescription] = useState(habit.description || '');

  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      ...habit,
      name: name.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{habit._id ? 'Edit Practice' : 'New Practice'}</h2>
        <label className="block mb-2">
          Name
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 mt-1" />
        </label>
        <label className="block mb-4 text-white/90">
          Description
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1" />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}