import React from "react";
import { FormEvent } from "react";

import { ChatRequestOptions } from "ai";
import { useChatContext } from "@/context/ChatActiveContext";
import { useStickToBottomContext } from "use-stick-to-bottom";
import { HiArrowNarrowUp } from "react-icons/hi";
import { CiStop1 } from "react-icons/ci";
import ChatFormArea from "./ChatFormArea";

export default function ChatForm({
  handleSubmit,
  handleAbort,
  getChatOptions,
  handleInputChange,
  input,
  status,
}: {
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  handleAbort: () => Promise<void>;
  getChatOptions: () => ChatRequestOptions;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  input: string;
  status: "submitted" | "streaming" | "ready" | "error";
}) {
  const { scrollToBottom } = useStickToBottomContext();
  const { setChatExpanded } = useChatContext();

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const options = getChatOptions();

    setChatExpanded(true);
    scrollToBottom();
    handleSubmit(e, options);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex gap-2 w-full items-center"
    >
      <ChatFormArea
        input={input}
        handleInputChange={handleInputChange}
        status={status}
      />
      {status === "submitted" || status === "streaming" ? (
        <button
          type="reset"
          onClick={handleAbort}
          className="bg-gray-900 w-[2rem] h-[2rem] rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition-all flex items-center justify-center flex-shrink-0 dark:bg-white "
        >
          <CiStop1 className="text-[1rem] max-h-[60%] max-w-[60%] dark:fill-black fill-white" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={input.trim().length === 0}
          className="bg-gray-900 w-[2rem] h-[2rem] rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition-all flex items-center justify-center flex-shrink-0 dark:bg-white disabled:hover:scale-100 disabled:dark:!bg-white/60 disabled:!bg-gray-300 "
        >
          <HiArrowNarrowUp className="dark:fill-black fill-white text-xl" />
        </button>
      )}
    </form>
  );
}
