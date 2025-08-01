// frontend/src/pages/CommunityPostsDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchCommunityPosts } from '../services/dashboardApi';

export default function CommunityPostsDetail() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCommunityPosts()
      .then(rows => setData(rows))
      .catch(err => {
        console.error('Error loading community posts:', err);
        setError('Failed to load community posts data');
      });
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!data.length) {
    return <p>Loading community posts…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Community Posts & Comments</h2>
      <p className="text-gray-600">
        Count of posts and comments per community.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Community</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Posts</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Comments</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(({ communityId, communityName, postCount, commentCount }) => (
              <tr key={communityId}>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {communityName} <span className="text-xs text-gray-400">({communityId})</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{postCount}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{commentCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
