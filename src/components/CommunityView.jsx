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
