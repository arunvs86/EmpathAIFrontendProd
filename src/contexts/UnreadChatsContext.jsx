import React, { createContext, useContext, useState, useEffect } from "react";

const UnreadChatsContext = createContext();

export function UnreadChatsProvider({ children }) {
  const [unreadChats, setUnreadChats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("unreadChats")) || {};
    } catch {
      return {};
    }
  });

  // sync to localStorage any time it changes
  useEffect(() => {
    localStorage.setItem("unreadChats", JSON.stringify(unreadChats));
  }, [unreadChats]);

  return (
    <UnreadChatsContext.Provider value={{ unreadChats, setUnreadChats }}>
      {children}
    </UnreadChatsContext.Provider>
  );
}

export function useUnreadChats() {
  return useContext(UnreadChatsContext);
}
