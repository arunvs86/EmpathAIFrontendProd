import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LetterComposer from '../components/LetterComposer';

export default function LettersPage() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = "https://empathaiv2-backend.onrender.com";

  // Fetch your user’s letters
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${api}/letters/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Could not load letters');
        setLetters(await res.json());
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [api]);

  // When composer creates a letter, prepend it
  const handleLetterCreated = newLetter =>
    setLetters(ls => [newLetter, ...ls]);

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {/* 1) your existing composer */}
      <LetterComposer onLetterCreated={handleLetterCreated} />

      {/* 2) the list of letters */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Letters</h2>
        {loading ? (
          <p>Loading…</p>
        ) : letters.length === 0 ? (
          <p className="text-gray-600">You haven’t written any letters yet.</p>
        ) : (
          <ul className="space-y-4">
            {letters.map(ltr => (
              <li
                key={ltr._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow transition"
              >
                <Link to={`/letters/${ltr._id}`} className="block space-y-1">
                  <p className="text-gray-800">
                    {ltr.text.slice(0, 60)}{ltr.text.length>60 && '…'}
                  </p>
                  <time className="text-sm text-gray-500">
                    {new Date(ltr.createdAt).toLocaleString()}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
