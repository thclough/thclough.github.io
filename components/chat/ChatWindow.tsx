"use client";

import React from "react";
import { useChatContext } from "@/context/ChatActiveContext";
import { motion, AnimatePresence } from "framer-motion";
import ChatDiv from "./ChatDiv";

import ThemeSwitch from "../ThemeSwitch";

export default function ChatWindow() {
  const { chatActive } = useChatContext();

  const slideVariants = {
    hidden: { y: "100%", x: "-50%" },
    visible: { y: 0, x: "-50%" },
  };

  return (
    <div>
      {/* <ThemeSwitch className="absolute -top-[4rem] left-5 smp:hidden" /> */}
      <ThemeSwitch className="fixed left-5 bottom-5" />
      <motion.div
        className="fixed bottom-0 sm:px-6 px-2 pb-4 w-full left-1/2 -translate-x-1/2 z-3 bg-white/80 shadow-xl backdrop-blur-[0.5rem] rounded-t-2xl dark:bg-gray-950/50 sm:w-[min(100%,36rem)] sm:right-[5.5rem] overflow-hidden"
        variants={slideVariants}
        initial="hidden"
        animate={chatActive ? "visible" : "hidden"}
        transition={{ duration: 0.3, type: "spring", bounce: 0.25 }}
      >
        <div className="flex w-full h-10 items-center justify-center font-bold">
          /taɪɡ/
        </div>
        <ChatDiv />
      </motion.div>
    </div>
  );
}
