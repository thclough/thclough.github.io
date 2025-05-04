"use client";

import React from "react";
import { BsChatRight } from "react-icons/bs";
import { useChatContext } from "@/context/ChatActiveContext";
import { IoMdClose } from "react-icons/io";

type ChatBtnProps = {
  className: string;
};

export default function ChatBtn({ className }: ChatBtnProps) {
  const { chatActive, setChatActive } = useChatContext();

  return (
    <button
      className={`${className} w-[3rem] h-[3rem] bg-white bg-opacity-80 backdrop-blur-[0.5rem] border border-white/40 shadow-2xl rounded-full items-center justify-center flex hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950`}
      onClick={() => {
        setChatActive(!chatActive);
      }}
    >
      {chatActive ? <IoMdClose className="text-xl" /> : <BsChatRight />}
    </button>
  );
}
