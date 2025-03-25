"use client";

import React from "react";
import { useChatContext } from "@/context/ChatActiveContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPopper() {
  const { chatActive, setChatActive } = useChatContext();

  return (
    <>
      <AnimatePresence>
        {chatActive && (
          <motion.div
            className="fixed bottom-0 left-1/2 z-10 -translate-x-1/2 max-w-[100%] h-[calc(100vh-10rem)] w-full  bg-white/80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] rounded-t-2xl borderBlack"
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: "0", x: "-50%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            exit={{ y: "100%" }}
          >
            <button onClick={() => setChatActive(false)}>
              Click here to exit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
