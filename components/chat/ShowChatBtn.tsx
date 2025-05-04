"use client";

import React, { useState, useEffect } from "react";
import { useChatContext } from "@/context/ChatActiveContext";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

type ShowChatBtnProps = {
  className?: string;
  children: React.ReactNode;
};

export default function ShowChatBtn({ className, children }: ShowChatBtnProps) {
  const { chatActive, setChatActive, chatNeverActive } = useChatContext();
  const [shouldGlow, setShouldGlow] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chatActive && chatNeverActive) {
      const timer = setTimeout(() => {
        setShouldGlow(true);
      }, 12000);

      return () => clearTimeout(timer);
    }
  }, [chatActive, chatNeverActive]);

  return (
    <AnimatePresence>
      {!chatActive && (
        <motion.button
          className={`${className} bg-white/60 backdrop-blur-[0.5rem] border border-white/40 shadow-2xl items-center justify-center flex dark:bg-gray-950`}
          onClick={() => {
            setChatActive(true);
            setShouldGlow(false);
          }}
          initial={{ y: "150%" }}
          animate={{
            y: "0",
            filter: shouldGlow
              ? [
                  "drop-shadow(0 0 0 rgba(255, 255, 255, 0))",
                  `drop-shadow(0 0 30px ${
                    theme === "dark"
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(0, 0, 0, 0.5)"
                  })`,
                  "drop-shadow(0 0 0 rgba(255, 255, 255, 0))",
                ]
              : "none",
          }}
          exit={{ y: "150%" }}
          transition={{
            duration: 0.3,
            type: "spring",
            bounce: 0.25,
            ...(shouldGlow && {
              filter: {
                repeat: 4,
                duration: 6.0,
                times: [0, 0.2, 0.4],
                ease: "easeInOut",
              },
            }),
          }}
          whileHover={{ scale: 1.15, transition: { duration: 0.1 } }}
          whileTap={{ scale: 1.05, transition: { duration: 0.1 } }}
        >
          {children}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
