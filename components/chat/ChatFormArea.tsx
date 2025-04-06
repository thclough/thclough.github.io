"use client";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to adjust height
  const adjustHeight = () => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set height to match content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
      ref={textareaRef}
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
