// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import 'react-calendar/dist/Calendar.css';
// import CreatableSelect from 'react-select/creatable';
// import { motion, AnimatePresence } from 'framer-motion';
// import CustomCalendar from './CustomCalendar';

// const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
// const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };

// function JournalEditor({ entry, onSave, onCancel }) {
//   const [title, setTitle] = useState(entry?.title || '');
//   const [body, setBody] = useState(entry?.body || '');
//   const [mood, setMood] = useState(entry?.mood || '😃');
//   const [tags, setTags] = useState(entry?.tags?.map(t => ({ value: t, label: t })) || []);
//   const [isPrivate, setIsPrivate] = useState(entry?.private ?? true);
//   const [attachments, setAttachments] = useState(entry?.attachments || []);

//   const [recording, setRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append('media', file);
//     const res = await fetch('https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/media/upload', { method: 'POST', body: formData });
//     const [uploaded] = await res.json();
//     setAttachments(prev => [...prev, uploaded.url]);
//   };

//   const handleStartRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];
//       mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
//       mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//         const formData = new FormData();
//         formData.append('media', audioBlob, 'voice_note.webm');
//         const res = await fetch('https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/media/upload', { method: 'POST', body: formData });
//         const [uploaded] = await res.json();
//         setAttachments(prev => [...prev, uploaded.url]);
//       };
//       mediaRecorder.start();
//       setRecording(true);
//     } catch (err) {
//       alert('Microphone permission denied or error starting recording.');
//     }
//   };

//   const handleStopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // ✅ Stop mic
//       mediaRecorderRef.current = null;
//     }
//     setRecording(false);
//   };

//   const handleRemoveAttachment = (url) => {
//     setAttachments(prev => prev.filter(att => att !== url));
//   };

//   const handleSubmit = e => {
//     e.preventDefault();
//     onSave({
//       ...entry,
//       title,
//       body,
//       mood,
//       tags: tags.map(t => t.value),
//       private: isPrivate,
//       attachments,
//     });
//   };

//   return (
//     <motion.div variants={fadeInUp} initial="hidden" animate="visible" exit="hidden" className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-lg">
//       <motion.div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-calligraphy text-gray-900">{entry ? 'Edit Entry' : 'New Entry'}</h2>
//         <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 text-2xl">×</button>
//       </motion.div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (optional)" className="w-full border rounded-lg px-4 py-2" />
//         <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="What's on your mind?" className="w-full border rounded-lg px-4 py-2" rows={4} />
//         <div className="flex items-center gap-4">
//           <select value={mood} onChange={e => setMood(e.target.value)} className="border rounded-lg px-3 py-2">
//             <option value="😃">😃 Happy</option>
//             <option value="😔">😔 Sad</option>
//             <option value="😡">😡 Angry</option>
//             <option value="😌">😌 Calm</option>
//           </select>
//           {/* <textarea value={tags} onChange={setTags} placeholder="Add your hashtags" className="flex-1" /> */}

//           {/* <CreatableSelect isMulti value={tags} onChange={setTags} placeholder="Tags..." className="flex-1" />
//           <label className="flex items-center space-x-2">
//             <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} className="h-5 w-5" />
//             <span>Private</span> */}
//           {/* </label> */}
//         </div>

//         <div className="space-y-2">
//   <label className="block text-sm font-medium text-white">
//     Attach Image
//   </label>

//   <div className="relative w-fit">
//     <label className="cursor-pointer inline-flex items-center bg-emerald-600 text-white text-sm px-4 py-2 rounded hover:bg-emerald-700 transition">
//       Upload File
//       <input
//         type="file"
//         onChange={handleFileUpload}
//         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//       />
//     </label>
//   </div>

//   <div className="flex flex-wrap gap-3 mt-2">
//     {attachments.map((url, i) => (
//       <div key={i} className="relative">
//         {url.match(/\.(jpg|png|jpeg|gif)$/i) ? (
//           <img
//             src={url}
//             alt="attachment"
//             className="w-20 h-20 object-cover rounded shadow"
//           />
//         ) : (
//           <audio controls src={url} className="w-48" />
//         )}
//         <button
//           onClick={() => handleRemoveAttachment(url)}
//           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2"
//         >
//           ×
//         </button>
//       </div>
//     ))}
//   </div>
// </div>


//         <div className="flex items-center gap-4">
//           {!recording ? (
//             <button type="button" onClick={handleStartRecording} className="px-4 py-2 bg-blue-600 text-white rounded">🎙️ Start Recording</button>
//           ) : (
//             <button type="button" onClick={handleStopRecording} className="px-4 py-2 bg-red-600 text-white rounded">⏹️ Stop Recording</button>
//           )}
//         </div>

//         <div className="flex justify-end gap-4">
//           <button type="button" onClick={onCancel} className="px-5 py-2 text-white rounded hover:bg-white/10">Cancel</button>
//           <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save</button>
//         </div>
//       </form>
//     </motion.div>
//   );
// }

// function JournalEntryCard({ entry, onEdit, onDelete }) {
//   const dateObj = new Date(entry.date);
//   const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
//   return (
//     <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 mb-6">
//       <div className="flex justify-between mb-2">
//         <h3 className=" text-xl font-semibold px-2 py-1 rounded-full mr-1">{entry.title}</h3>
//         <span className="text-sm text-gray-900">{formattedDate}</span>
//       </div>
//       <div className="mb-2">{entry.mood}</div>
//       {entry.tags.map(tag => <span key={tag} className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full mr-1">{tag}</span>)}
//       <p className="my-2 whitespace-pre-line">{entry.body}</p>
//       {entry.attachments?.map((url, i) => (
//         <div key={i} className="my-2">
//           {url.match(/\.(jpg|png|jpeg|gif)$/i) ? <img src={url} className="rounded w-40" /> : <audio controls src={url} className="w-64" />}
//         </div>
//       ))}
//       <div className="flex justify-end gap-3">
//         <button onClick={() => onEdit(entry)} className="text-emerald-600 hover:underline">Edit</button>
//         <button onClick={() => onDelete(entry._id)} className="text-red-600 hover:underline">Delete</button>
//       </div>
//     </motion.div>
//   );
// }

// export default function ProfileJournals() {
//   const { userId } = useParams();
//   const [entries, setEntries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showEditor, setShowEditor] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);

//   useEffect(() => { fetchEntries(); }, []);

//   const fetchEntries = async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/journals?userId=${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setEntries(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async payload => {
//     const token = localStorage.getItem('token');
//     const isEditing = editingEntry && editingEntry._id;
//     const method = isEditing ? 'PUT' : 'POST';
//     const url = isEditing ? `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/journals/${editingEntry._id}` : 'https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/journals';
//     await fetch(url, {
//       method,
//       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//       body: JSON.stringify(payload)
//     });
//     await fetchEntries();
//     setShowEditor(false);
//     setEditingEntry(null);
//   };

//   const handleEdit = entry => { setEditingEntry(entry); setShowEditor(true); };
//   const handleDelete = async id => {
//     if (!confirm('Delete this entry?')) return;
//     const token = localStorage.getItem('token');
//     await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/journals/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
//     fetchEntries();
//   };

//   const dateSet = new Set(entries.map(e => new Date(e.date).toDateString()));

//   return (
//     <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
//       <div className="flex justify-between items-center mb-6">
//       <h2 className="text-4xl font-calligraphy text-white drop-shadow-lg"> My Journal</h2>
// <button
//   onClick={() => { setEditingEntry(null); setShowEditor(true); }}
//   className="bg-emerald-600 hover:bg-emerald-700 transition text-white px-6 py-2 rounded-full shadow-md text-lg"
// >
//   New Entry
// </button>

//       </div>

//       <AnimatePresence>
//         {showEditor && (
//           <JournalEditor
//             entry={editingEntry}
//             onSave={handleSave}
//             onCancel={() => { setShowEditor(false); setEditingEntry(null); }}
//           />
//         )}
//       </AnimatePresence>

//       <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-8">
//         <CustomCalendar
//           entries={entries}
//           onDateClick={date => {
//             window.scrollTo({ top: 0, behavior: 'smooth' }); // 👈 NEW: Scroll to top
          
//             const clicked = entries.find(e => new Date(e.date).toDateString() === date.toDateString());
//             if (clicked) handleEdit(clicked);
//             else {
//               setEditingEntry({ date: date.toISOString(), title: '', body: '', mood: '😃', tags: [], private: true });
//               setShowEditor(true);
//             }
//           }}
//         />
//       </div>

//       {loading ? <p className="text-gray-200">Loading entries...</p> : (
//         entries.map(entry => (
//           <JournalEntryCard key={entry._id} entry={entry} onEdit={handleEdit} onDelete={handleDelete} />
//         ))
//       )}
//     </motion.div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CreatableSelect from 'react-select/creatable';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCalendar from './CustomCalendar';

const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };

function JournalEditor({ entry, onSave, onCancel }) {
  const [title, setTitle] = useState(entry?.title || '');
  const [body, setBody] = useState(entry?.body || '');
  const [mood, setMood] = useState(entry?.mood || '😃');
  const [tags, setTags] = useState(entry?.tags?.map(t => ({ value: t, label: t })) || []);
  const [isPrivate, setIsPrivate] = useState(entry?.private ?? true);
  const [attachments, setAttachments] = useState(entry?.attachments || []);

  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('media', file);
    const res = await fetch('https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/media/upload', { method: 'POST', body: formData });
    const [uploaded] = await res.json();
    setAttachments(prev => [...prev, uploaded.url]);
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('media', audioBlob, 'voice_note.webm');
        const res = await fetch('https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/media/upload', { method: 'POST', body: formData });
        const [uploaded] = await res.json();
        setAttachments(prev => [...prev, uploaded.url]);
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      alert('Microphone permission denied or error starting recording.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
    }
    setRecording(false);
  };

  const handleRemoveAttachment = (url) => {
    setAttachments(prev => prev.filter(att => att !== url));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      ...entry,
      title,
      body,
      mood,
      tags: tags.map(t => t.value),
      private: isPrivate,
      attachments,
    });
  };

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" exit="hidden" className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-lg">
      <motion.div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-calligraphy text-gray-900">{entry ? 'Edit Entry' : 'New Entry'}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 text-2xl">×</button>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (optional)" className="w-full border rounded-lg px-4 py-2" />
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="What's on your mind?" className="w-full border rounded-lg px-4 py-2" rows={4} />
        <div className="flex items-center gap-4">
          <select value={mood} onChange={e => setMood(e.target.value)} className="border rounded-lg px-3 py-2">
            <option value="😃">😃 Happy</option>
            <option value="😔">😔 Sad</option>
            <option value="😡">😡 Angry</option>
            <option value="😌">😌 Calm</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Attach Image</label>
          <div className="relative w-fit">
            <label className="cursor-pointer inline-flex items-center bg-emerald-600 text-white text-sm px-4 py-2 rounded hover:bg-emerald-700 transition shadow">
              📎 Upload File
              <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </label>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {attachments.map((url, i) => (
              <div key={i} className="relative">
                {url.match(/\.(jpg|png|jpeg|gif)$/i) ? (
                  <img src={url} alt="attachment" className="w-20 h-20 object-cover rounded shadow" />
                ) : (
                  <audio controls src={url} className="w-48" />
                )}
                <button onClick={() => handleRemoveAttachment(url)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2">×</button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!recording ? (
            <button type="button" onClick={handleStartRecording} className="px-4 py-2 bg-blue-600 text-white rounded">🎙️ Start Recording</button>
          ) : (
            <button type="button" onClick={handleStopRecording} className="px-4 py-2 bg-red-600 text-white rounded">⏹️ Stop Recording</button>
          )}
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-5 py-2 text-white rounded hover:bg-white/10">Cancel</button>
          <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save</button>
        </div>
      </form>
    </motion.div>
  );
}

function JournalEntryCard({ entry, onEdit, onDelete }) {
  const dateObj = new Date(entry.date);
  const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white/40 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-xl hover:shadow-2xl transition-all">
      <div className="flex justify-between mb-2">
        <h3 className="text-2xl font-semibold text-gray-800">{entry.title}</h3>
        <span className="text-sm text-gray-700">{formattedDate}</span>
      </div>
      <div className="mb-3">
        <span className="inline-block text-lg bg-white text-gray-800 px-3 py-1 rounded-full shadow">{entry.mood}</span>
      </div>
      {entry.tags.map(tag => (
        <span key={tag} className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full mr-1">#{tag}</span>
      ))}
      <p className="my-3 text-gray-800">{entry.body}</p>
      {entry.attachments?.map((url, i) => (
        <div key={i} className="my-2">
          {url.match(/\.(jpg|png|jpeg|gif)$/i) ? <img src={url} className="rounded w-40" /> : <audio controls src={url} className="w-64" />}
        </div>
      ))}
      <div className="flex justify-end gap-3">
        <button onClick={() => onEdit(entry)} className="bg-white/10 text-white py-1 px-3 rounded-lg text-lg border border-amber-300 hover:underline">Edit</button>
        <button onClick={() => onDelete(entry._id)} className="bg-white/10 text-white py-1 px-3 rounded-lg text-lg border border-amber-300 text-red-900 hover:underline">Delete</button>
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
  const editorRef = useRef(null);

  const fetchEntries = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/journals?userId=${userId}`, {
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
    const isEditing = editingEntry && editingEntry._id;
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/journals/${editingEntry._id}` : 'https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/journals';
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async id => {
    if (!confirm('Delete this entry?')) return;
    const token = localStorage.getItem('token');
    await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/journals/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchEntries();
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-calligraphy text-white drop-shadow-lg">📝 My Journal</h2>
        <button onClick={() => { setEditingEntry(null); setShowEditor(true); }} className="bg-emerald-600 hover:bg-emerald-700 transition text-white px-6 py-2 rounded-full shadow-md text-lg">➕ New Entry</button>
      </div>

      <AnimatePresence>
        {showEditor && (
          <div ref={editorRef}>
          <JournalEditor
            entry={editingEntry}
            onSave={handleSave}
            onCancel={() => { setShowEditor(false); setEditingEntry(null); }}
          />
        </div>
        )}
      </AnimatePresence>

      <div className="bg-white/20 rounded-2xl p-6 mb-8">
        <CustomCalendar
          entries={entries}
          // onDateClick={date => {
          //   window.scrollTo({ top: 0, behavior: 'smooth' }); // 🪄 Smooth scroll to top
          //   const clicked = entries.find(e => new Date(e.date).toDateString() === date.toDateString());
          //   if (clicked) handleEdit(clicked);
          //   else {
          //     setEditingEntry({ date: date.toISOString(), title: '', body: '', mood: '😃', tags: [], private: true });
          //     setShowEditor(true);
          //     window.scrollTo({ top: 0, behavior: 'smooth' });
          //   }
          // }}
          onDateClick={date => {
            const clicked = entries.find(e => new Date(e.date).toDateString() === date.toDateString());
          
            if (clicked) {
              handleEdit(clicked);
            } else {
              setEditingEntry({ date: date.toISOString(), title: '', body: '', mood: '😃', tags: [], private: true });
              setShowEditor(true);
            }
          
            // Smooth scroll after short delay to ensure editor is rendered
            setTimeout(() => {
              editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100); // 👈 small delay to wait for DOM update
          }}
        />
      </div>

      {loading ? <p className="text-gray-200">Loading entries...</p> : (
        entries.map(entry => (
          <JournalEntryCard key={entry._id} entry={entry} onEdit={handleEdit} onDelete={handleDelete} />
        ))
      )}
    </motion.div>
  );
}