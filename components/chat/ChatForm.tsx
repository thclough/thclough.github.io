import React from "react";
import { FormEvent } from "react";
import { ChatRequestOptions } from "ai";
import { useChat } from "@ai-sdk/react";
import { useChatContext } from "@/context/ChatActiveContext";
import { useActiveSectionContext } from "@/context/ActiveSectionContext";
import { useStickToBottomContext } from "use-stick-to-bottom";
import { HiArrowNarrowUp } from "react-icons/hi";

export default function ChatForm() {
  const { setChatExpanded } = useChatContext();
  const { handleSubmit, handleInputChange, input, status } = useChat({
    id: "1",
  });
  const { activeSection } = useActiveSectionContext();
  const { scrollToBottom } = useStickToBottomContext();

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const options: ChatRequestOptions = {
      body: {
        activeSection,
      },
    };

    scrollToBottom();
    handleSubmit(e, options);
    setChatExpanded(true);
  };
  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex gap-2 w-full items-center"
    >
      <input
        className="px-2 h-[2rem] w-full text-sm sm:text-base rounded-lg border borderBlack focus:border-black focus:outline-none transition-all dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 dark:text-gray-950 dark:outline-none"
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
  );
}
