import React from "react";
import ShowChatBtn from "@/components/chat/ShowChatBtn";
import { BsChatRight } from "react-icons/bs";

export default function ShowChatBtnLarge() {
  return (
    <ShowChatBtn className="fixed bottom-5 right-5 px-3 h-[3rem] rounded-full invisible smp:visible">
      <p>
        Chat with <span className="font-bold"> /taɪɡ/</span>{" "}
        <BsChatRight className="inline-block" />
      </p>
    </ShowChatBtn>
  );
}
