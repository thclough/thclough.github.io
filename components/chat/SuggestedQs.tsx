import React from "react";
import { Message, CreateMessage, ChatRequestOptions } from "ai";
import { suggestedQs } from "@/lib/chatData";

export default function SuggestedQs({
  append,
  chatOptionsFunc,
}: {
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  chatOptionsFunc: () => ChatRequestOptions;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 pb-1">
      <div className="text-center">
        Ask my assistant, /taɪɡ/, anything about my professional or educational
        experiences...
      </div>
      <div className="flex flex-auto justify-center gap-2">
        {suggestedQs.map((Q) => (
          <button
            key={Q}
            className="flex-1 px-[.2rem] py-[.2rem] rounded-lg borderBlack dark:border-white/40 text-sm hover:bg-gray-300/40 dark:hover:bg-gray-950/40"
            onClick={() =>
              append({ role: "user", content: Q }, chatOptionsFunc())
            }
          >
            {Q}
          </button>
        ))}
      </div>
    </div>
  );
}
