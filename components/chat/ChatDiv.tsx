"use client";

import { useState, useRef } from "react";
import { useChatContext } from "@/context/ChatActiveContext";

import { useChat } from "@ai-sdk/react";
import { ChatRequestOptions, UIMessage } from "ai";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { HiDownload } from "react-icons/hi";

import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { useActiveSectionContext } from "@/context/ActiveSectionContext";

import { suggestedQs } from "@/lib/chatData";
import type { SectionName } from "@/lib/types";

import ClearChatButton from "./ClearChatBtn";
import ExpandButton from "./ExpandButton";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";

export default function ChatDiv() {
  const { chatExpanded, setChatActive } = useChatContext();
  const { activeSection } = useActiveSectionContext();
  const [chatErrorStatus, setChatErrorStatus] = useState(false);

  // stop is not part of the shared context
  const {
    messages,
    setMessages,
    status,
    stop,
    append,
    handleSubmit,
    handleInputChange,
    input,
  } = useChat({
    id: "1",
    onResponse: (res) => {
      setChatErrorStatus(false);
    },
    onError: (error) => {
      const parsed = JSON.parse(error.message);
      if (!parsed.abortError) {
        toast.error(parsed.error);
        setChatErrorStatus(true);
      }
    },
  });

  const controllerReqId = useRef<string | null>(null);

  const handleAbortDec = (keepMessages: UIMessage[]) => {
    return async () => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reqId: controllerReqId.current,
          action: "abort",
        }),
      });
      if (res.ok) {
        setMessages(keepMessages);
        stop();
      } else {
        toast.error("Could not cancel message");
      }
    };
  };

  // might add this to chat context
  const getChatOptions = () => {
    controllerReqId.current = Math.random().toString(36).substring(2);

    const options: ChatRequestOptions = {
      body: {
        activeSection,
        reqId: controllerReqId.current,
        action: "start",
      },
    };

    return options;
  };

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
          className="flex flex-col gap-4"
          initial={{ height: "0" }}
          animate={{
            height: chatExpanded ? "auto" : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {messages.length == 0 ? (
            <div className="flex flex-col items-center justify-center w-full gap-2">
              <div className="text-center">
                Ask my assistant, /taɪɡ/, anything about my professional or
                educational experiences...
              </div>
              <div className="flex flex-auto justify-center gap-2">
                {suggestedQs.map((Q) => (
                  <button
                    key={Q}
                    className="flex-1 px-[.2rem] py-[.2rem] rounded-lg borderBlack dark:border-white/40 text-sm hover:bg-gray-300/40 dark:hover:bg-gray-950/40"
                    onClick={() =>
                      append({ role: "user", content: Q }, getChatOptions())
                    }
                  >
                    {Q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className="self-end">
                  <ChatMessage message={message}></ChatMessage>
                </div>
              ))}
              {(status === "submitted" || status === "streaming") && (
                <div>
                  {status === "submitted" && (
                    <div className="flex justify-center">
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-black dark:border-white"></div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      </StickToBottom.Content>

      <ScrollToBottom />

      <div className="max-h-[calc(100vh-10rem)] w-full">
        <div className="w-full flex items-center justify-between py-4 smp:py-2">
          <ClearChatButton abortFunction={handleAbortDec([])} status={status} />
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

        <ChatForm
          handleSubmit={handleSubmit}
          handleAbort={handleAbortDec(messages.slice(0, -1))}
          getChatOptions={getChatOptions}
          handleInputChange={handleInputChange}
          status={status}
          input={input}
        />
      </div>
    </StickToBottom>
    // </div>
  );
}
