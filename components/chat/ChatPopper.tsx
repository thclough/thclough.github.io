"use client";

import React from "react";
import { useChatContext } from "@/context/ChatActiveContext";
import { motion, AnimatePresence } from "framer-motion";
import ChatDiv from "./ChatDiv";

export default function ChatPopper() {
  const { chatActive, setChatActive } = useChatContext();

  return (
    <>
      <AnimatePresence>
        {chatActive && (
          <motion.div
            className="fixed bottom-0 px-6 pb-2 pt-5 z-10 w-[min(100%,40rem)] left-1/2 -translate-x-1/2 h-[calc(100vh-10rem)] bg-white/80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] rounded-t-2xl borderBlack"
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: "0", x: "-50%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            exit={{ y: "100%" }}
          >
            <button
              onClick={() => setChatActive(false)}
              className="absolute top-0 right-2"
            >
              x
            </button>

            <ChatDiv />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
