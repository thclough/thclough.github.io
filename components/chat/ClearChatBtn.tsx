"useClient";

import { useChatContext } from "@/context/ChatActiveContext";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import { CiTrash } from "react-icons/ci";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";

type ClearChatButtonProps = {
  className?: string;
  abortFunction: () => Promise<void>;
  status: string;
};

export default function ClearChatButton({
  className,
  abortFunction,
  status,
}: ClearChatButtonProps) {
  const { chatActive } = useChatContext();

  const { messages, setMessages } = useChat({ id: "1" });

  // if no messages keep invisible
  return (
    <motion.button
      className={`${className} text-xl `}
      onClick={() => {
        // try to abort current message if necessary
        if (status === "submitted" || status === "streaming") {
          abortFunction();
        } else {
          setMessages([]);
        }
      }}
      initial={{ visibility: "visible" }}
      animate={{ visibility: messages.length > 0 ? "visible" : "hidden" }}
      transition={{ duration: 0.25 }} // Instant toggle
    >
      <CiTrash className="stroke-[0.05rem]" />
    </motion.button>
  );
}
