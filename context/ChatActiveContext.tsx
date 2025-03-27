"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

type ChatActiveContextType = {
  chatActive: boolean;
  setChatActive: React.Dispatch<React.SetStateAction<boolean>>;
  chatExpanded: boolean;
  setChatExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

type ChatActiveProviderProps = {
  children: React.ReactNode;
};

const ChatActiveContext = createContext<ChatActiveContextType | null>(null);

export default function ChatActiveContextProvider({
  children,
}: ChatActiveProviderProps) {
  const [chatActive, setChatActive] = useState<boolean>(true);
  const [chatExpanded, setChatExpanded] = useState<boolean>(false);

  return (
    <ChatActiveContext.Provider
      value={{
        chatActive,
        setChatActive,
        chatExpanded,
        setChatExpanded,
      }}
    >
      {children}
    </ChatActiveContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatActiveContext);

  if (context === null) {
    throw new Error(
      "useChatContext must be used within a useChatContextProvider"
    );
  }

  return context;
}
