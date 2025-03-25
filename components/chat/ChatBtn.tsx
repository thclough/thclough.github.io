"use client";

import React from "react";
import { BsChatRight } from "react-icons/bs";
import { useChatContext } from "@/context/ChatActiveContext";

export default function ChatBtn() {
  const { setChatActive } = useChatContext();

  return (
    <button
      className="fixed bottom-5 right-5 bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full items-center justify-center flex  hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
      onClick={() => {
        setChatActive(true);
      }}
    >
      <BsChatRight />
    </button>
  );
}
