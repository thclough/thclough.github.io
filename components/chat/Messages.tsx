import React from "react";
import ChatMessage from "./ChatMessage";
import { UIMessage } from "ai";

export default function Messages({ messages }: { messages: UIMessage[] }) {
  return (
    <>
      {messages.map((message) => (
        <div key={message.id} className="self-end">
          <ChatMessage message={message}></ChatMessage>
        </div>
      ))}
    </>
  );
}
