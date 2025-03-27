"use client";

import React from "react";
import { useChatContext } from "@/context/ChatActiveContext";
import { IoMdClose } from "react-icons/io";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

type ShowChatBtnProps = {
  className?: string;
  children: React.ReactNode;
};

export default function ShowChatBtn({ className, children }: ShowChatBtnProps) {
  const { chatActive, setChatActive } = useChatContext();

  return (
    <AnimatePresence>
      {!chatActive && (
        <motion.button
          className={`${className} bg-white/60 backdrop-blur-[0.5rem] border border-white/40 shadow-2xl items-center justify-center flex dark:bg-gray-950`}
          onClick={() => {
            setChatActive(true);
          }}
          initial={{ y: "150%" }}
          animate={{ y: "0" }}
          exit={{ y: "150%" }}
          transition={{ duration: 0.3, type: "spring", bounce: 0.25 }}
          whileHover={{ scale: 1.15, transition: { duration: 0.1 } }}
          whileTap={{ scale: 1.05, transition: { duration: 0.1 } }}
        >
          {children}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
