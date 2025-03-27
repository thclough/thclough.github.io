"useClient";

import { useChatContext } from "@/context/ChatActiveContext";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";

type ExpandTabProps = {
  className?: string;
  stopFunction: () => void;
};

export default function ClearChatButton({
  className,
  stopFunction,
}: ExpandTabProps) {
  const { chatActive } = useChatContext();

  const { messages, setMessages } = useChat({ id: "1" });

  // if no messages keep invisible
  return (
    <motion.button
      className={`${className} text-xl `}
      onClick={() => {
        setMessages([]);
        stopFunction();
      }}
      initial={{ visibility: "visible" }}
      animate={{ visibility: messages.length > 0 ? "visible" : "hidden" }}
      transition={{ duration: 0.25 }} // Instant toggle
    >
      <IoMdRefresh />
    </motion.button>
  );
}
