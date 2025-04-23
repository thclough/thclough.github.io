"use client";

import { useChatContext } from "@/context/ChatActiveContext";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";

import React, { useCallback, useRef } from "react";

type ExpandButtonProps = {
  className?: string;
};

export default function ExpandButton({ className }: ExpandButtonProps) {
  const { chatExpanded, setChatExpanded, textAreaRef } = useChatContext();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // without caching, causes handle
  // because functions recreate on every rerender
  // cause useEffect to clean up, set up listener (useEffect) every render
  // EVEN if function logic doesn't change
  // all about performance
  const handleExpandTouch = useCallback(
    (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }

      // Maintain focus on textarea
      if (
        textAreaRef.current &&
        document.activeElement === textAreaRef.current
      ) {
        setChatExpanded(!chatExpanded);
        // Restore focus asynchronously to ensure it persists
        setTimeout(() => {
          textAreaRef.current?.focus();
        }, 50);
      } else {
        setChatExpanded(!chatExpanded);
      }
      e.stopPropagation();
    },
    [setChatExpanded, chatExpanded, textAreaRef]
  );

  const handleExpandClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setChatExpanded(!chatExpanded);
  };

  React.useEffect(() => {
    const controller = new AbortController();

    const button = buttonRef.current;
    if (button) {
      // Add touchstart listener with passive: false
      button.addEventListener("touchstart", handleExpandTouch, {
        passive: false,
        signal: controller.signal,
      });

      // Cleanup
      return () => {
        controller.abort();
      };
    }
  }, [handleExpandTouch]);
  // asking, could this dependency be different on a re-render, if so, include in dependencies,
  // because it could change whatever happens in useEffect so this could change in-line with the re-render

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
