// src/components/ProfileJournals.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CreatableSelect from 'react-select/creatable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };

// Journal Entry Editor
function JournalEditor({ entry, onSave, onCancel }) {
  const [title, setTitle] = useState(entry?.title || '');
  const [body, setBody] = useState(entry?.body || '');
  const [mood, setMood] = useState(entry?.mood || '😃');
  const [tags, setTags] = useState(entry?.tags?.map(t => ({ value: t, label: t })) || []);
  const [isPrivate, setIsPrivate] = useState(entry?.private ?? true);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      ...entry,
      title,
      body,
      mood,
      tags: tags.map(t => t.value),
      private: isPrivate,
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeInUp}
      className="bg-white shadow-lg rounded-2xl p-6 mb-8"
    >
      <motion.div className="flex justify-between items-center mb-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.4 } }}
      >
        <h2 className="text-2xl font-semibold text-gray-900">
          {entry ? 'Edit Entry' : 'New Entry'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 text-2xl">×</button>
      </motion.div>
      <motion.form onSubmit={handleSubmit} className="space-y-4"
        initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.input variants={fadeInUp}
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-300"
        />
        <motion.textarea variants={fadeInUp}
          placeholder="What's on your mind?"
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-300"
        />
        <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
          <select
            value={mood}
            onChange={e => setMood(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="😃">😃 Happy</option>
            <option value="😔">😔 Sad</option>
            <option value="😡">😡 Angry</option>
            <option value="😌">😌 Calm</option>
          </select>
          <CreatableSelect
            isMulti
            value={tags}
            onChange={setTags}
            placeholder="Add tags..."
            className="flex-1"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={e => setIsPrivate(e.target.checked)}
              className="h-5 w-5 text-emerald-600 border-gray-300 rounded"
            />
            <span className="text-gray-700">Private</span>
          </label>
        </motion.div>
        <motion.div variants={fadeInUp} className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
          >Cancel</button>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >Save</button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}

// Journal Entry Card
function JournalEntryCard({ entry, onEdit, onDelete }) {
  const dateObj = new Date(entry.date);
  const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <motion.div
      initial="hidden" animate="visible"
      variants={fadeInUp}
      className="bg-white rounded-2xl shadow-sm p-6 mb-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {entry.title || 'Untitled'}
        </h3>
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl animate-pulse">{entry.mood}</span>
        {entry.tags.map(tag => (
          <span key={tag} className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-gray-700 mb-4 whitespace-pre-line">{entry.body}</p>
      <div className="flex justify-end gap-4">
        <button onClick={() => onEdit(entry)} className="text-emerald-600 hover:underline">Edit</button>
        <button onClick={() => onDelete(entry._id)} className="text-red-600 hover:underline">Delete</button>
      </div>
    </motion.div>
  );
}

export default function ProfileJournals() {
  const { userId } = useParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://empathaiv2-backend.onrender.com/journals?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async payload => {
    const token = localStorage.getItem('token');
    const method = editingEntry ? 'PUT' : 'POST';
    const url = editingEntry ?
      `https://empathaiv2-backend.onrender.com/journals/${editingEntry._id}` :
      'https://empathaiv2-backend.onrender.com/journals';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    await fetchEntries();
    setShowEditor(false);
    setEditingEntry(null);
  };

  const handleEdit = entry => {
    setEditingEntry(entry);
    setShowEditor(true);
  };

  const handleDelete = async id => {
    if (!confirm('Delete this entry?')) return;
    const token = localStorage.getItem('token');
    await fetch(`https://empathaiv2-backend.onrender.com/journals/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchEntries();
  };

  // Prepare highlighted dates
  console.log(entries)
  const dateSet = new Set(entries.map(e => new Date(e.date).toDateString()));

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">My Journal</h2>
        <button
          onClick={() => { setEditingEntry(null); setShowEditor(true); }}
          className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-colors"
        >+ New Entry</button>
      </div>

      <AnimatePresence>{showEditor && (
        <JournalEditor
          entry={editingEntry}
          onSave={handleSave}
          onCancel={() => { setShowEditor(false); setEditingEntry(null); }}
        />
      )}</AnimatePresence>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-white shadow-lg rounded-2xl p-6 mb-8"
      >
        <Calendar
          prevLabel={<ChevronLeft className="text-emerald-600 hover:scale-110 transition-transform" />}
          nextLabel={<ChevronRight className="text-emerald-600 hover:scale-110 transition-transform" />}
          onClickDay={date => {
            const clicked = entries.find(
              e => new Date(e.date).toDateString() === date.toDateString()
            );
            if (clicked) handleEdit(clicked);
            else {
              setEditingEntry({ date: date.toISOString(), title: '', body: '', mood: '😃', tags: [], private: true });
              setShowEditor(true);
            }
          }}
          tileContent={({ date, view }) =>
            view === 'month' && dateSet.has(date.toDateString()) ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-2 w-2 bg-emerald-600 rounded-full mx-auto mt-1"
              />
            ) : null
          }
          tileClassName={({ date, view }) =>
            view === 'month' && dateSet.has(date.toDateString()) ? 'bg-emerald-50 hover:bg-emerald-100 transition-colors' : 'hover:bg-gray-100 transition-colors'
          }
          className="react-calendar border-none rounded-lg"
        />
      </motion.div>

      {loading ? (
        <p className="text-gray-600">Loading entries...</p>
      ) : (
        entries.map(entry => (
          <JournalEntryCard
            key={entry._id}
            entry={entry}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </motion.div>
  );
}
