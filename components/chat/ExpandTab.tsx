"use client";

import { useChatContext } from "@/context/ChatActiveContext";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";

type ExpandTabProps = {
  className: string;
};

export default function ExpandTab({ className }: ExpandTabProps) {
  const { chatActive, chatExpanded, setChatExpanded } = useChatContext();

  const { messages } = useChat({ id: "1" });

  // if no messages keep invisible
  return (
    <AnimatePresence>
      {
        // only show expansion if chat active there are messages that you can expand to show
        chatActive && messages.length > 0 && (
          <motion.button
            className={`${className} text-2xl rounded-full bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 items-center justify-center flex shadow-2xl hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950`}
            onClick={() => setChatExpanded(!chatExpanded)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {chatExpanded ? <MdOutlineExpandMore /> : <MdOutlineExpandLess />}
          </motion.button>
        )
      }
    </AnimatePresence>
  );
}
