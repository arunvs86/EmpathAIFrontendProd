import React, { useState, useRef } from 'react';
import CreatableSelect from 'react-select/creatable';
import { ImageIcon, VideoIcon, Music, FileText } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'Wellness tips', label: 'Wellness tips' },
  { value: 'Mindful meditation', label: 'Mindful meditation' },
  { value: 'Self-Care', label: 'Self-Care' },
  { value: 'Grief & Bereavement', label: 'Grief & Bereavement' },
];
const MAX_WORDS = 500;

export default function PostComposer({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef();

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const remaining = MAX_WORDS - words;

  // STEP 1: handle user selecting files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - mediaFiles.length);
    setMediaFiles(prev => [...prev, ...files]);
    e.target.value = null;
  };

  // STEP 2: upload to your backend -> Cloudinary
  const uploadMedia = async () => {
    if (!mediaFiles.length) return [];
    const token = localStorage.getItem('token');
    const form = new FormData();
    mediaFiles.forEach(f => form.append('media', f));
    const res = await fetch('https://empathaiv2-backend.onrender.com/media/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    console.log(res)
    if (!res.ok) throw new Error(res);
    const files = await res.json(); // [{ url, resource_type }, …]
    return files.map(f => f.url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || remaining < 0) return;
    setSubmitting(true);

    try {
      // 1) upload media and get back URLs
      const mediaUrls = await uploadMedia();

      // 2) send post payload
      const token = localStorage.getItem('token');
      const payload = { content, categories, media: mediaUrls };
      const res = await fetch('https://empathaiv2-backend.onrender.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      onPostCreated(await res.json());

      // reset form
      setContent('');
      setCategories([]);
      setMediaFiles([]);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-8">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900">Create a New Post</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={4}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          style={{ resize: 'vertical' }}
        />

        <CreatableSelect
          isMulti
          options={CATEGORY_OPTIONS}
          value={CATEGORY_OPTIONS.filter(o => categories.includes(o.value))}
          onChange={(sel) => setCategories(sel ? sel.map(s => s.value) : [])}
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder="Select or add categories..."
        />

        {/* media controls */}
        <div className="flex space-x-6 text-gray-600">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex items-center space-x-1 hover:text-gray-900"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-sm">Media</span>
          </button>
        </div>
        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* previews */}
        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {mediaFiles.map((file, i) => (
              <div key={i} className="relative rounded overflow-hidden">
                {file.type.startsWith('image/') && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-24 w-full object-cover rounded"
                  />
                )}
                {file.type.startsWith('video/') && (
                  <video
                    src={URL.createObjectURL(file)}
                    className="h-24 w-full rounded"
                    muted
                  />
                )}
                {file.type.startsWith('audio/') && (
                  <div className="h-24 w-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                    {file.name}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setMediaFiles(prev => prev.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 hover:text-red-800 focus:outline-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className={`text-sm ${remaining < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {remaining} words remaining
          </span>
          <button
            type="submit"
            disabled={submitting || !content.trim() || remaining < 0}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 w-32 text-white font-semibold py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
