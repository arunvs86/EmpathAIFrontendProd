import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function HabitEditor({ habit = {}, onSave, onCancel }) {
  const { t } = useTranslation();
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
        <h2 className="text-xl font-semibold mb-4">{habit._id ? t('habits.editPractice') : t('habits.newPractice')}</h2>
        <label className="block mb-2">
          {t('habits.name')}
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 mt-1" />
        </label>
        <label className="block mb-4 text-white/90">
          {t('habits.description')}
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1" />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">{t('common.cancel')}</button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">{t('common.save')}</button>
        </div>
      </form>
    </div>
  );
}