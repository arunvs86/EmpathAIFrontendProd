import React, { useState, useRef } from 'react';
import CreatableSelect from 'react-select/creatable';
import { ImageIcon, VideoIcon, Music, FileText } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'Self-Care', label: 'Self-Care' },
  { value: 'Grief & Bereavement', label: 'Grief & Bereavement' },
  { value: 'Religious Support', label: 'Religious Support' },
  { value: 'Spiritual Healing', label: 'Spiritual Healing' },
];
const MAX_WORDS = 500;

export default function PostComposer({communityId, onPostCreated }) {
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
    const res = await fetch('https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/media/upload', {
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
      const payload = {
         content, 
        categories, 
        media: mediaUrls,
        ...(communityId && { community_id: communityId })
    };
      const res = await fetch('https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      // console.log(res)
      // if (!res.ok) {
      //   const { error } = await res.json();
      //   throw new Error(error);
      // }

      const data = await res.json();


      // 2) If non-2xx, use the server-provided error message:
      if (!res.ok) {
        // you can either throw or set local UI error state:
        // throw new Error(data.error || "Unknown error");
        return alert(data.error || "Failed to create post");
      }

      onPostCreated(data);

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
    <div className="bg-white/5  rounded-2xl p-6 mb-8 hover:border border-amber-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={4}
          placeholder="Type here and share your toughts 💭 Someone's listening. 🤗"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full bg-white/5 placeholder-white/90 placeholder-bold rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
        />


<CreatableSelect
  isMulti
  options={CATEGORY_OPTIONS}
  value={CATEGORY_OPTIONS.filter(o => categories.includes(o.value))}
  onChange={sel => setCategories(sel ? sel.map(s => s.value) : [])}
  className="react-select-container text-white bg-white/5 placeholder-white"
  classNamePrefix="react-select"
  placeholder="Select or add categories..."
  styles={{
    control: provided => ({
      ...provided,
      background: "rgba(112, 109, 97, 0.5)",
      borderColor: "white",
      boxShadow: "none",
      "&:hover": { borderColor: "amber" },
    }),
    singleValue: provided => ({
      ...provided,
      color: "white",
    }),
    multiValue: provided => ({
      ...provided,
      background: "rgba(120, 120, 120, 0.3)",
    }),
    multiValueLabel: provided => ({
      ...provided,
      color: "white",
    }),
    input: provided => ({
      ...provided,
      color: "white",
    }),
    placeholder: provided => ({
      ...provided,
      color: "rgba(247, 244, 244, 0.7)",
      font: "bold",
    }),
    option: (provided, { isFocused, isSelected }) => ({
      ...provided,
      background: isFocused
        ? "rgba(230,230,230,0.8)"
        : isSelected
        ? "rgba(200,200,200,0.8)"
        : "white",
      color: "#333",
    }),
    menu: provided => ({
      ...provided,
      background: "white",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      borderRadius: "0.5rem",
      zIndex: 9999,
    }),
  }}
/>


        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex items-center space-x-2 text-white/90 hover:text-amber-300"
          >
            <ImageIcon className="w-5 h-5" />
            <span>Add Media</span>
          </button>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {mediaFiles.map((file, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden">
                {file.type.startsWith('image/') && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-24 object-cover"
                  />
                )}
                {file.type.startsWith('video/') && (
                  <video
                    controls
                    src={URL.createObjectURL(file)}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                )}
                {file.type.startsWith('audio/') && (
                  <audio
                    controls
                    src={URL.createObjectURL(file)}
                    className="w-full"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setMediaFiles(prev => prev.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 text-red-400 bg-white/50 rounded-full p-0.5"
                >✕</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              remaining < 0 ? "text-red-400" : "text-white/80"
            }`}
          >
            {remaining} words left
          </span>
          <button
            type="submit"
            disabled={submitting || !content.trim() || remaining < 0}
            className="hover:border-amber-300 text-amber-300 px-6 py-2 rounded-full font-semibold transition disabled:opacity-50 border border-white"
          >
            {submitting ? "Sharing..." : "Share"}
          </button>
        </div>
      </form>
    </div>
  );
  
}
