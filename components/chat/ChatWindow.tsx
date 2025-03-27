"use client";

import React from "react";
import { useChatContext } from "@/context/ChatActiveContext";
import { motion, AnimatePresence } from "framer-motion";
import ChatDiv from "./ChatDiv";
import { IoMdClose } from "react-icons/io";
import ExpandTab from "./ExpandTab";
import ChatBtn from "./ChatBtn";
import ThemeSwitch from "../ThemeSwitch";

export default function ChatWindow() {
  const { chatActive, setChatActive } = useChatContext();

  const slideVariants = {
    hidden: { y: "100%", x: "-50%" }, // Off-screen to the bottom
    visible: { y: 0, x: "-50%" }, // On-screen
  };

  return (
    <>
      <motion.div
        className="fixed bottom-0 px-6 pb-6 pt-5 z-10 w-full left-1/2 -translate-x-1/2 max-h-[calc(100vh-10rem)] bg-white/80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] border-white border-opacity-40 rounded-t-2xl dark:bg-gray-950/50 sm:w-[min(100%,36rem)] sm:right-[5.5rem]"
        variants={slideVariants}
        initial="hidden"
        animate={chatActive ? "visible" : "hidden"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* the controls */}
        <ChatBtn className="absolute -top-[4rem] right-5 smp:hidden" />
        <ThemeSwitch className="absolute -top-[4rem] left-5 smp:hidden" />
        <ExpandTab className="absolute -top-[4rem] left-1/2 -translate-x-1/2 smp:hidden" />

        <ChatDiv />
      </motion.div>
    </>
  );
}
