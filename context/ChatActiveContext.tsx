"use client";

import React, { useState, createContext, useContext, useRef } from "react";

type ChatActiveContextType = {
  chatActive: boolean;
  setChatActive: React.Dispatch<React.SetStateAction<boolean>>;
  chatExpanded: boolean;
  setChatExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
};

type ChatActiveProviderProps = {
  children: React.ReactNode;
};

const ChatActiveContext = createContext<ChatActiveContextType | null>(null);

export default function ChatActiveContextProvider({
  children,
}: ChatActiveProviderProps) {
  const [chatActive, setChatActive] = useState<boolean>(false);
  const [chatExpanded, setChatExpanded] = useState<boolean>(true);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <ChatActiveContext.Provider
      value={{
        chatActive,
        setChatActive,
        chatExpanded,
        setChatExpanded,
        textAreaRef,
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
