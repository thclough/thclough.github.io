"use client";

import { useChatContext } from "@/context/ChatActiveContext";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";

type ExpandTabProps = {
  className?: string;
};

export default function ExpandButton({ className }: ExpandTabProps) {
  const { chatExpanded, setChatExpanded } = useChatContext();

  const { messages } = useChat({ id: "1" });

  // if no messages keep invisible
  return (
    // only show expansion if chat active there are messages that you can expand to show
    <motion.button
      className={`${className}`}
      onClick={() => setChatExpanded(!chatExpanded)}
      initial={{ visibility: "visible" }}
      animate={{ visibility: messages.length > 0 ? "visible" : "hidden" }}
      transition={{ duration: 0.25 }}
    >
      {chatExpanded ? <MdOutlineExpandMore /> : <MdOutlineExpandLess />}
    </motion.button>
  );
}
