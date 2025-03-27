"use client";

import React from "react";
import { useChatContext } from "@/context/ChatActiveContext";
import { motion, AnimatePresence } from "framer-motion";
import ChatDiv from "./ChatDiv";
import { IoMdClose } from "react-icons/io";

export default function ChatPopper() {
  const { chatActive, setChatActive } = useChatContext();

  // fuck it just make 100% active and the can minimize and expand
  // clicking in the text box automatically expands
  // pushes to max height then have to scroll
  // taig header at the top

  const slideVariants = {
    hidden: { y: "100%", x: "-50%" }, // Off-screen to the bottom
    visible: { y: 0, x: "-50%" }, // On-screen
  };

  return (
    <>
      <motion.div
        className="fixed bottom-0 px-6 pb-6 pt-5 z-10 w-full left-1/2 -translate-x-1/2 h-[calc(100vh-10rem)] bg-white/80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] rounded-t-2xl borderBlack sm:w-[min(100%,36rem)] sm:right-[5.5rem]"
        variants={slideVariants}
        initial="hidden"
        animate={chatActive ? "visible" : "hidden"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <button
          onClick={() => setChatActive(false)}
          className="absolute top-2 right-2 text-xl"
        >
          <IoMdClose />
        </button>

        <ChatDiv />
      </motion.div>
    </>
  );
}
