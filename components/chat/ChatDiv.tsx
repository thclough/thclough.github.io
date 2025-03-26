"use client";

import { useChat } from "@ai-sdk/react";

export default function ChatDiv() {
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({});

  return (
    <div className="relative w-full h-full flex flex-col items-end justify-end gap-4">
      <div className="flex flex-col gap-2 overflow-y-auto w-full">
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
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          className="px-2 rounded-lg border w-full borderBlack focus:border-black focus:outline-none transition-all dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 dark:outline-none"
          name="prompt"
          value={input}
          onChange={handleInputChange}
          disabled={status !== "ready"}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
