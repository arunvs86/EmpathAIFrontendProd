// import React from "react";

// function CommunityCard({ community, onSelect }) {
//   const { name, description, type } = community;

//   return (
//     <div
//       onClick={() => onSelect(community._id)}
//       className="bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//     >
//       <h3 className="font-semibold text-gray-700 text-lg mb-1">
//         {name}
//       </h3>
//       <p className="text-sm text-gray-600">{description}</p>
//       <span
//         className={`px-2 py-1 text-xs rounded ${
//           type === "public"
//             ? "bg-green-100 text-green-700"
//             : "bg-blue-100 text-blue-700"
//         }`}
//       >
//         {type === "public" ? "Public" : "Private"}
//       </span>
//     </div>
//   );
// }

// export default CommunityCard;

import React from "react";

function CommunityCard({ community, onView }) {
  // Fallback if any fields are missing
  const name = community.name || "Untitled Community";
  const description = community.description || "No description provided.";
  const type = community.type || "public";
  const createdBy = community.createdBy || "Unknown User";
  const createdAt = community.createdAt
    ? new Date(community.createdAt).toLocaleString()
    : "N/A";
  const membersCount = community.members?.length || 0;
  const moderatorsCount = community.moderators?.length || 0;

  // Style the type badge
  const typeBadgeClass =
    type === "public"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="relative bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Emerald accent border on the left */}
      <div className="absolute top-0 left-0 h-full w-1 bg-emerald-500" />

      <div className="p-4">
        {/* Header: Community name + type badge */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800">{name}</h3>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${typeBadgeClass}`}
          >
            {type === "public" ? "Public" : "Private"}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-2 leading-relaxed">
          {description}
        </p>

        {/* Stats row: members, moderators */}
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-4">
          <p>
            <span className="font-medium">Members:</span> {membersCount}
          </p>
          <p>
            <span className="font-medium">Moderators:</span> {moderatorsCount}
          </p>
        </div>

        {/* Created By / Created At */}
        <div className="text-xs text-gray-500 mb-2">
          {/* <p>
            <span className="font-medium">Created By:</span> {createdBy}
          </p> */}
          <p>
            <span className="font-medium">Created At:</span> {createdAt}
          </p>
        </div>

        {/* Optional: View or Join button */}
        {onView && (
          <div className="flex justify-end mt-2">
            <button
              onClick={() => onView(community._id)}
              className="text-sm font-medium text-emerald-600 hover:underline"
            >
              View
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunityCard;
