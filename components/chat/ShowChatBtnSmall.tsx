import React from "react";
import ShowChatBtn from "@/components/chat/ShowChatBtn";
import { BsChatRight } from "react-icons/bs";

export default function ShowChatBtnSmall() {
  return (
    <ShowChatBtn className="fixed bottom-5 right-5 h-[3rem] w-[3rem] rounded-full sm:invisible">
      <BsChatRight className="inline-block" />
    </ShowChatBtn>
  );
}
