"use client";

import React, {
  useState,
  createContext,
  useContext,
  useRef,
  useEffect,
} from "react";

type ChatActiveContextType = {
  chatActive: boolean;
  setChatActive: (bool: boolean) => void;
  chatNeverActive: boolean;
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
  const [chatActive, setChatActivePrim] = useState<boolean>(false);
  const [chatExpanded, setChatExpanded] = useState<boolean>(true);
  const textAreaRef = useRef<HTMLTextAreaElement>(null); // used for expand button in mobile to not hide keyboard when clicked
  const [chatNeverActive, setChatNeverActive] = useState<boolean>(false); // used for glowing button to hint user to use chat for the first time

  const setChatActive = (bool: boolean) => {
    setChatActivePrim(bool);

    if (bool && chatNeverActive) {
      console.log("setting chat never active to hold and change sate");
      window.localStorage.setItem("chatNeverActive", "hold");
      setChatNeverActive(false);
    }
  };

  useEffect(() => {
    // see if chat was ever active
    const localCNA = window.localStorage.getItem("chatNeverActive") as
      | string
      | null;
    if (!localCNA) {
      setChatNeverActive(true);
    }
  }, []);

  return (
    <ChatActiveContext.Provider
      value={{
        chatActive,
        setChatActive,
        chatNeverActive,
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
