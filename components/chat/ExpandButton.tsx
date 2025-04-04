"use client";

import { useChatContext } from "@/context/ChatActiveContext";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";

import React from "react";
import { motion } from "framer-motion";

type ExpandTabProps = {
  className?: string;
};

export default function ExpandButton({ className }: ExpandTabProps) {
  const { chatExpanded, setChatExpanded } = useChatContext();

  // if no messages keep invisible
  return (
    // only show expansion if chat active there are messages that you can expand to show
    <motion.button
      className={`${className}`}
      onClick={() => setChatExpanded(!chatExpanded)}
    >
      {chatExpanded ? <MdOutlineExpandMore /> : <MdOutlineExpandLess />}
    </motion.button>
  );
}
