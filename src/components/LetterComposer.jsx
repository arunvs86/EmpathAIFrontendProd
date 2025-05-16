// src/components/LetterComposer.jsx
import React, { useState, useRef } from 'react';
import { ImageIcon } from 'lucide-react';

export default function LetterComposer({ onLetterCreated }) {
  const [text, setText] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef();

  // 1) Handle user selecting files (images only, max 3)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3 - mediaFiles.length);
    setMediaFiles(prev => [...prev, ...files]);
    e.target.value = null;
  };

  // 2) Upload to your backend → Cloudinary
  const uploadMedia = async () => {
    if (!mediaFiles.length) return [];
    const token = localStorage.getItem('token');
    const form = new FormData();
    mediaFiles.forEach(f => form.append('media', f));
    const res = await fetch(
      `https://empathaiv2-backend.onrender.com/media/upload`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }
    );
    if (!res.ok) throw new Error('Media upload failed');
    const files = await res.json(); // [{ url, resource_type }, …]
    return files.map(f => f.url);
  };

  // 3) Submit the letter
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);

    try {
      const mediaUrls = await uploadMedia();
      const token = localStorage.getItem('token');
      const payload = { text, media: mediaUrls };

      const res = await fetch(
        `https://empathaiv2-backend.onrender.com/letters`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Letter creation failed');
      }
      const newLetter = await res.json();
      onLetterCreated?.(newLetter);

      // Clear form
      setText('');
      setMediaFiles([]);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-8">
      {/* <h3 className="text-2xl font-semibold mb-4 text-gray-900">Write a Letter</h3> */}
      <h2 className="
  text-center 
  text-3xl md:text-4xl 
  italic 
  font-light 
  text-emerald-600 
  mb-6 
  leading-snug 
  tracking-wide 
  drop-shadow-sm
">
  Your Words, Their Memory—A Personal Letter for Healing
</h2>      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={8}
          placeholder="Dear …"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          style={{ resize: 'vertical' }}
        />

        {/* Media button */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-sm">Add Image</span>
          </button>
          <span className="text-sm text-gray-500">
            {mediaFiles.length}/3 images
          </span>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Previews */}
        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {mediaFiles.map((file, i) => (
              <div key={i} className="relative rounded overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-24 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setMediaFiles(prev => prev.filter((_, j) => j !== i))
                  }
                  className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 hover:text-red-800 focus:outline-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          >
            {submitting ? 'Saving…' : 'Save Letter'}
          </button>
        </div>
      </form>
    </div>
  );
}
