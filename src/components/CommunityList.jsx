// import React, { useState, useEffect } from "react";
// import CommunityCard from "./CommunityCard";

// function CommunityList({ onCreateCommunity, onSelectCommunity }) {
//   const [communities, setCommunities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchCommunities = async () => {
//       try {
//         const response = await fetch("https://empathaiv2-backend.onrender.com/communities");
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "Failed to fetch communities");
//         }
//         const data = await response.json();
//         setCommunities(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCommunities();
//   }, []);

//   if (loading) return <p className="text-gray-700">Loading communities...</p>;
//   if (error) return <p className="text-red-600">{error}</p>;

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold text-emerald-600">Communities</h2>
//         <button
//           onClick={onCreateCommunity}
//           className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-4 rounded"
//         >
//           Create Community
//         </button>
//       </div>
//       {communities.length === 0 ? (
//         <p className="text-gray-500">No communities available.</p>
//       ) : (
//         <div className="space-y-4">
//           {communities.map((community) => (
//   <CommunityCard
//     key={community._id}
//     community={community}
//     onSelect={onSelectCommunity}
//   />
// ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default CommunityList;

import React, { useState, useEffect } from "react";
import CommunityCard from "./CommunityCard";

function CommunityList({ onCreateCommunity, onSelectCommunity }) {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch("https://empathaiv2-backend.onrender.com/communities");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch communities");
        }
        const data = await response.json();
        setCommunities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  if (loading) return <p className="text-gray-700">Loading communities...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      {/* Header row */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-600">Communities</h2>
        <button
          onClick={onCreateCommunity}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-4 rounded"
        >
          Create Community
        </button>
      </div>

      {communities.length === 0 ? (
        <p className="text-gray-500">No communities available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <CommunityCard
              key={community._id}
              community={community}
              onView={onSelectCommunity} // if you want a "View" button
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommunityList;
