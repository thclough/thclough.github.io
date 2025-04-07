"use client";

import { useChatContext } from "@/context/ChatActiveContext";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";

import React from "react";
import { motion } from "framer-motion";

type ExpandTabProps = {
  className: string;
};

export default function ExpandTab({ className }: ExpandTabProps) {
  const { chatExpanded, setChatExpanded } = useChatContext();

  // if no messages keep display none
  return (
    <motion.button
      className={`${className} text-2xl rounded-full bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 items-center justify-center flex shadow-2xl hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950`}
      onClick={() => setChatExpanded(!chatExpanded)}
    >
      {chatExpanded ? <MdOutlineExpandMore /> : <MdOutlineExpandLess />}
    </motion.button>
  );
}
