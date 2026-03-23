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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-white">{habit._id ? t('habits.editPractice') : t('habits.newPractice')}</h2>
        <label className="block mb-2 text-white/80 font-medium">
          {t('habits.name')}
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" />
        </label>
        <label className="block mb-4 text-white/80 font-medium">
          {t('habits.description')}
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition">{t('common.cancel')}</button>
          <button type="submit" className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold rounded-lg transition">{t('common.save')}</button>
        </div>
      </form>
    </div>
  );
}