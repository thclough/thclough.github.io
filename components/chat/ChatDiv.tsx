"use client";

import { useChatContext } from "@/context/ChatActiveContext";
import { useChat } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { HiArrowNarrowUp } from "react-icons/hi";
import { FormEvent } from "react";
import ClearChatButton from "./ClearChatBtn";
import ExpandButton from "./ExpandButton";
import { IoMdClose } from "react-icons/io";

export default function ChatDiv() {
  // stop is not part of the shared context
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({ id: "1" });

  const { chatExpanded, setChatExpanded, setChatActive } = useChatContext();

  const expandVariants = {
    collapsed: { height: 0 },
    expanded: { height: "auto" },
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setChatExpanded(true);
  };

  // taig header only shows when there are no messages
  //  put taig in the message section
  // if you activate the input, message box should come up
  // handle the separation between messages (margin bottom conditional)
  // animation bug in small viewport with experience section
  // put buttons close, snug to right

  // how to make buttons only show up when certain radius of mouse (disabled for smaller vi)
  // chat needs a border
  // only first scroll will chat box show?

  return (
    <div className="relative w-full h-full max-h-[calc(100vh-8rem)] flex flex-col items-end justify-end gap-2">
      <motion.div
        className="flex flex-col overflow-y-auto w-full gap-2"
        initial={{ height: "0", paddingTop: ".5rem" }}
        animate={{
          height: chatExpanded ? "auto" : 0,
          paddingTop: chatExpanded ? ".5rem" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === "user" ? "User: " : "AI: "}
            {message.content}
          </div>
        ))}

        {(status === "submitted" || status === "streaming") && (
          <div>
            {status === "submitted" && <span>loading</span>}
            <button type="button" onClick={() => stop()}>
              Stop
            </button>
          </div>
        )}
      </motion.div>

      {/* controls */}
      <div className="w-full flex items-center justify-between top-0 ">
        <ClearChatButton stopFunction={stop} />

        <ExpandButton />

        <button onClick={() => setChatActive(false)} className="text-xl">
          <IoMdClose />
        </button>
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="flex gap-2 w-full items-center"
      >
        <input
          className="px-2 h-[2rem] w-full rounded-lg border borderBlack focus:border-black focus:outline-none transition-all dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 dark:text-gray-950 dark:outline-none"
          name="prompt"
          placeholder="Chat with /taɪɡ/, my digital assistant"
          value={input}
          onChange={handleInputChange}
          disabled={status !== "ready"}
        />
        <button
          type="submit"
          disabled={status !== "ready" || input.length === 0}
          className="bg-gray-900 text-white w-[2rem] h-[2rem] rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition-all flex items-center justify-center flex-shrink-0 dark:bg-white disabled:hover:scale-100 disabled:dark:!bg-white/60 disabled:!bg-gray-300 "
        >
          <HiArrowNarrowUp className="dark:fill-black text-xl" />
        </button>
      </form>
    </div>
  );
}
