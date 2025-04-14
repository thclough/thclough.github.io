import { UIMessage } from "ai";
import React from "react";
import ReactMarkdown from "react-markdown";
import { MemoizedMarkdown } from "./MemoizedMarkdown";

export default function ChatMessage({ message }: { message: UIMessage }) {
  const className = {
    user: "self-end bg-[#dbd7fb]/60 px-2 py-2 rounded-lg dark:bg-[#676394]/60 ml-10",
    assistant: "self-start bg-gradient-to-r rounded-lg",
    data: "",
    system: "",
  }[message.role];

  if (message.role === "user") {
    return (
      <div className={className}>
        <MemoizedMarkdown id={message.id} content={message.content} />
      </div>
    );
  }
  if (message.role === "assistant") {
    return (
      <div className="self-start flex gap-2">
        <span className="[text-shadow:_-0.5px_0px_2px_rgba(0,0,0,0.9)] dark:[text-shadow:_-0.5px_0px_2px_rgba(255,255,255,0.9)] text-lg font-bold">
          &nbsp;/t/
        </span>

        <div className={className}>
          <MemoizedMarkdown id={message.id} content={message.content} />
        </div>
      </div>
    );
  }
}
