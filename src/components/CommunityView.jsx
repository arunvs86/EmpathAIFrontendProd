// import React, { useState } from "react";
// import CommunityList from "./CommunityList";
// import CreateCommunity from "./CreateCommunity";
// import CommunityDetail from "./CommunityDetail";

// function CommunityView() {
//   const [mode, setMode] = useState("list"); 
//   // "list", "create", or "detail"
//   const [selectedCommunityId, setSelectedCommunityId] = useState(null);

//   const handleCreateClick = () => {
//     setMode("create");
//   };

//   const handleCommunityCreated = (newCommunity) => {
//     // After creating, go back to list or show detail, as you prefer
//     setMode("list");
//   };

//   const handleCommunitySelect = (communityId) => {
//     // User clicked a community from the list
//     setSelectedCommunityId(communityId);
//     setMode("detail");
//   };

//   const handleBackToList = () => {
//     // Called when user wants to go back from detail to list
//     setMode("list");
//     setSelectedCommunityId(null);
//   };

//   return (
//     <div>
//       {mode === "list" && (
//         <CommunityList
//           onCreateCommunity={handleCreateClick}
//           onSelectCommunity={handleCommunitySelect}
//         />
//       )}

//       {mode === "create" && (
//         <CreateCommunity onCommunityCreated={handleCommunityCreated} />
//       )}

//       {mode === "detail" && selectedCommunityId && (
//         <CommunityDetail communityId={selectedCommunityId} onBack={handleBackToList} />
//       )}
//     </div>
//   );
// }

// export default CommunityView;


import React, { useState } from "react";
import CommunityList from "./CommunityList";
import CreateCommunity from "./CreateCommunity";
import CommunityDetail from "./CommunityDetail";

function CommunityView() {
  const [mode, setMode] = useState("list"); // "list", "create", or "detail"
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);

  const handleCreateClick = () => setMode("create");
  const handleCommunityCreated = (newCommunity) => {
    setMode("list");
    // optionally refresh the list
  };
  const handleSelectCommunity = (id) => {
    setSelectedCommunityId(id);
    setMode("detail");
  };

  return (
    <div>
      {mode === "list" && (
        <CommunityList
          onCreateCommunity={handleCreateClick}
          onSelectCommunity={handleSelectCommunity}
        />
      )}
      {mode === "create" && (
        <CreateCommunity onCommunityCreated={handleCommunityCreated} />
      )}
      {mode === "detail" && selectedCommunityId && (
        <CommunityDetail communityId={selectedCommunityId} />
      )}
    </div>
  );
}

export default CommunityView;
