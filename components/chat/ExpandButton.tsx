"use client";

import { useChatContext } from "@/context/ChatActiveContext";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";

import React, { useRef } from "react";

type ExpandTabProps = {
  className?: string;
};

export default function ExpandButton({ className }: ExpandTabProps) {
  const { chatExpanded, setChatExpanded, textAreaRef } = useChatContext();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleExpandTouch = (e: TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }

    // Maintain focus on textarea
    if (textAreaRef.current && document.activeElement === textAreaRef.current) {
      setChatExpanded(!chatExpanded);
      // Restore focus asynchronously to ensure it persists
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 50);
    } else {
      setChatExpanded(!chatExpanded);
    }
    e.stopPropagation();
  };

  const handleExpandClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setChatExpanded(!chatExpanded);
  };

  React.useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      // Add touchstart listener with passive: false
      button.addEventListener("touchstart", handleExpandTouch, {
        passive: false,
      });

      // Cleanup
      return () => {
        button.removeEventListener("touchstart", handleExpandTouch, {
          passive: false,
        } as EventListenerOptions);
      };
    }
  }, [handleExpandTouch]);

  // if no messages keep invisible
  return (
    // only show expansion if chat active there are messages that you can expand to show
    <button
      ref={buttonRef}
      onClick={handleExpandClick}
      className={`${className}`}
    >
      {chatExpanded ? <MdOutlineExpandMore /> : <MdOutlineExpandLess />}
    </button>
  );
}
