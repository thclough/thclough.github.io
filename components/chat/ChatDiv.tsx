"use client";

import { useState, useRef, useEffect } from "react";
import { useChatContext } from "@/context/ChatActiveContext";

import { useChat } from "@ai-sdk/react";
import { ChatRequestOptions, UIMessage } from "ai";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { HiDownload } from "react-icons/hi";

import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { useActiveSectionContext } from "@/context/ActiveSectionContext";

import ClearChatButton from "./ClearChatBtn";
import ExpandButton from "./ExpandButton";
import ChatForm from "./ChatForm";
import Messages from "./Messages";
import SuggestedQs from "./SuggestedQs";

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
    experimental_throttle: 50, // for memoized markdown
    onResponse: (res) => {
      setChatErrorStatus(false);
    },
    onError: (error) => {
      // some errors are not parsable
      try {
        const parsed = JSON.parse(error.message);
        console.log(parsed);
        if (!parsed.abortError) {
          toast.error(parsed.message);
          setChatErrorStatus(true);
          setMessages(messages.slice(0, -1));
        }
      } catch (err) {
        toast.error(error.message);
        // clear message that led to an error
        // can change this to a retry option by setting true error, not just delete message
        setMessages(messages.slice(0, -1));
      }
    },
    // clean up unnecessary abort controller
    onFinish: async () => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reqId: controllerReqId.current,
          action: "clearAbort",
        }),
      });
    },
  });

  // Message persistence
  useEffect(() => {
    const storedChat = localStorage.getItem("taigChatHistory");
    if (storedChat) {
      setMessages(JSON.parse(storedChat));
    }
  }, [setMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("taigChatHistory", JSON.stringify(messages));
    } else {
      localStorage.removeItem("taigChatHistory");
    }
  }, [messages]);

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
          className="absolute text-sm right-1 bottom-36 sm:bottom-28 h-[2rem] w-[2rem] rounded-full bg-white bg-opacity-40 backdrop-blur-[0.5rem] border border-black/40 shadow-2xl focus:scale-110 hover:scale-110 active:scale-105 transition-all flex items-center justify-center dark:bg-gray-950 dark:border-white"
          onClick={() => scrollToBottom()}
        >
          <HiDownload />
        </button>
      )
    );
  }

  return (
    <StickToBottom
      className="relative max-h-[calc(100vh-10.75rem)] w-full flex flex-col items-end justify-end"
      resize="smooth"
      initial="smooth"
    >
      <StickToBottom.Content className="flex flex-col sm:px-4 px-2">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ height: "0" }}
          animate={{
            height: chatExpanded ? "auto" : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {messages.length == 0 ? (
            <SuggestedQs append={append} chatOptionsFunc={getChatOptions} />
          ) : (
            <>
              <Messages messages={messages} />

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

      <div className="max-h-[calc(100vh-10.75rem)] w-full sm:px-4 px-2">
        <div className="w-full flex items-center justify-between py-4 smp:py-2">
          <ClearChatButton abortFunction={handleAbortDec([])} status={status} />
          <ExpandButton className="text-[2rem]" />
          <button
            onClick={() => {
              setChatActive(false);
            }}
            className="text-2xl"
          >
            <IoMdClose />
          </button>
        </div>

        <ChatForm
          handleSubmit={handleSubmit}
          handleAbort={handleAbortDec(
            messages.slice(
              0,
              messages.findLastIndex((message) => message.role === "user")
            )
          )}
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
