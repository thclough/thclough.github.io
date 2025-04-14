import React from "react";
import ChatMessage from "./ChatMessage";
import { UIMessage } from "ai";

export default function Messages({ messages }: { messages: UIMessage[] }) {
  return (
    <>
      {messages.map((message) => (
        <React.Fragment key={message.id}>
          <ChatMessage message={message}></ChatMessage>
        </React.Fragment>
      ))}
    </>
  );
}
