"use client";

import { useChatContext } from "@/context/ChatActiveContext";
import { useChat } from "@ai-sdk/react";
import { motion } from "framer-motion";
import ClearChatButton from "./ClearChatBtn";
import ExpandButton from "./ExpandButton";
import { IoMdClose } from "react-icons/io";
import type { SectionName } from "@/lib/types";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { HiDownload } from "react-icons/hi";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";

type ChatRequestOptions = {
  body: { activeSection: SectionName };
};

export default function ChatDiv() {
  const { chatExpanded, setChatActive } = useChatContext();

  // stop is not part of the shared context
  const { messages, status, stop } = useChat({
    id: "1",
  });

  function ScrollToBottom() {
    const { isAtBottom, scrollToBottom } = useStickToBottomContext();
    return (
      !isAtBottom &&
      chatExpanded && (
        <button
          className="absolute text-sm right-1 bottom-24 sm:bottom-20 h-[2rem] w-[2rem] rounded-full bg-white bg-opacity-40 backdrop-blur-[0.5rem] border border-black/40 shadow-2xl focus:scale-110 hover:scale-110 active:scale-105 transition-all flex items-center justify-center dark:bg-gray-950 dark:border-white"
          onClick={() => scrollToBottom()}
        >
          <HiDownload />
        </button>
      )
    );
  }

  return (
    <StickToBottom
      className="relative max-h-[calc(100vh-9.75rem)] w-full flex flex-col items-end justify-end"
      resize="smooth"
      initial="smooth"
    >
      <StickToBottom.Content className="flex flex-col">
        <motion.div
          className="prose flex flex-col gap-4"
          initial={{ height: "0" }}
          animate={{
            height: chatExpanded ? "auto" : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {messages.map((message) => (
            <div key={message.id} className="self-end">
              <ChatMessage message={message}></ChatMessage>
            </div>
          ))}

          {(status === "submitted" || status === "streaming") && (
            <div>
              {status === "submitted" && (
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-black dark:border-white"></div>
              )}
              <button type="button" onClick={() => stop()}>
                Stop
              </button>
            </div>
          )}
        </motion.div>
      </StickToBottom.Content>

      <ScrollToBottom />

      <div className="max-h-[calc(100vh-10rem)] w-full">
        {/* controls */}
        <div className="w-full flex items-center justify-between py-4 smp:py-2">
          <ClearChatButton stopFunction={stop} />
          <ExpandButton className="text-2xl" />
          <button
            onClick={() => {
              setChatActive(false);
            }}
            className="text-xl"
          >
            <IoMdClose />
          </button>
        </div>

        <ChatForm />
      </div>
    </StickToBottom>
    // </div>
  );
}
