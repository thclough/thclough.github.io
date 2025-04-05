import React, { useRef } from "react";
import { FormEvent } from "react";
import { ChatRequestOptions } from "ai";
import { useChat } from "@ai-sdk/react";
import { useChatContext } from "@/context/ChatActiveContext";
import { useActiveSectionContext } from "@/context/ActiveSectionContext";
import { useStickToBottomContext } from "use-stick-to-bottom";
import { HiArrowNarrowUp } from "react-icons/hi";

export default function ChatForm({
  stopFunction,
}: {
  stopFunction: () => void;
}) {
  const { setChatExpanded } = useChatContext();
  const { handleSubmit, handleInputChange, input, status } = useChat({
    id: "1",
    onResponse: (res) => {
      console.log("response to chat", res);
    },
    onError: (error) => {
      console.log("logging return error");
      console.log(error);
      // if an abort error set fatal err not an abort error set fatal error
    },
  });
  const { activeSection } = useActiveSectionContext();
  const { scrollToBottom } = useStickToBottomContext();

  const controllerReqId = useRef<string | null>(null);

  const handleAbort = async () => {
    console.log("going to send abort");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reqId: controllerReqId.current, action: "abort" }),
    });
    const data = await res.json();
    console.log("Endpoint response", data);
    stopFunction();
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    controllerReqId.current = Math.random().toString(36).substring(2);

    const options: ChatRequestOptions = {
      body: {
        activeSection,
        reqId: controllerReqId.current,
        action: "start",
      },
    };

    setChatExpanded(true);
    scrollToBottom();
    setTimeout(() => handleSubmit(e, options), 3000);
    setTimeout(async () => await handleAbort(), 100);
  };
  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex gap-2 w-full items-center"
    >
      <input
        className="px-2 h-[2rem] w-full text-sm sm:text-base rounded-lg border borderBlack focus:border-black focus:outline-none transition-all dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 dark:text-gray-950 dark:outline-none"
        name="prompt"
        placeholder={`Chat with /taɪɡ/, my digital assistant ${status}`}
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
  );
}
