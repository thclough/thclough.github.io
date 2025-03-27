"use client";

import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";

type ThemeSwitchProps = {
  className: string;
};

export default function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`${className} bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full items-center justify-center flex hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950`}
      onClick={toggleTheme}
    >
      {theme === "light" ? <BsSun /> : <BsMoon />}
    </button>
  );
}
