"use client";

import { useChatContext } from "@/context/ChatActiveContext";
import React, { useRef, useEffect } from "react";

export default function ChatFormArea({
  input,
  handleInputChange,
  status,
}: {
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  status: "submitted" | "streaming" | "ready" | "error";
}) {
  const { textAreaRef } = useChatContext();

  const adjustHeight = () => {
    if (textAreaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textAreaRef.current.style.height = "auto";
      // Set height to match content
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    adjustHeight();
  };

  // Initial adjustment when component mounts
  useEffect(() => {
    adjustHeight();
  }, [input]);

  return (
    <textarea
      ref={textAreaRef}
      className="p-2 w-full overflow-y-auto max-h-[15rem] resize-none rounded-lg border borderBlack focus:border-black focus:outline-none transition-all dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 dark:text-gray-950 dark:outline-none"
      // name="prompt"
      placeholder={`Chat with /taɪɡ/, my digital assistant`}
      value={input}
      onChange={handleChange}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (
            input.trim().length > 0 &&
            status !== "submitted" &&
            status !== "streaming"
          ) {
            const form = e.currentTarget.closest("form");
            if (form) {
              form.requestSubmit();
            }
          }
        }
      }}
    />
  );
}
