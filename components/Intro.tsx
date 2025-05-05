"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import portrait from "@/public/portrait.jpg";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { CiStop1 } from "react-icons/ci";
import { HiDownload } from "react-icons/hi";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/ActiveSectionContext";
import { HiOutlineSpeakerWave } from "react-icons/hi2";

export default function Intro() {
  const [infoText, setInfoText] = useState("");

  const ref = useSectionInView("Home");
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      handleAudioEnd();
    } else {
      audioRef.current
        .play()
        .catch((error) => console.error("Playback failed:", error));
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnd = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <section
      ref={ref}
      id="home"
      className="mb-20 max-w-[50rem] text-center sm:mb-0 scroll-mt-[10rem]"
    >
      <div className="flex items-center justify-center">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
          >
            <Image
              src={portrait}
              width="200"
              height="200"
              quality="95"
              priority={true}
              alt="Tighe Clough portrait"
              className="h-[10rem] w-[10rem] rounded-full object-cover border-[0.35rem] border-white shadow-xl"
            />
          </motion.div>
          <span></span>
        </div>
      </div>
      <motion.h1
        className="mb-10 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-4xl"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center">
          <span className="font-bold">Hello, I&apos;m Tighe.</span>
          <button
            className="flex items-center justify-center bg-white text-[1.5rem] h-8 w-8 sm:h-10 sm:w-10  text-gray-700 dark:bg-white/10 dark:text-white/60  gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition borderBlack"
            onClick={toggleAudio}
          >
            <audio ref={audioRef} src="/welcome.mp3" onEnded={handleAudioEnd} />
            {isPlaying ? (
              <CiStop1 className="text-[1rem] stroke-[.05rem] max-h-[60%] max-w-[60%]" />
            ) : (
              <HiOutlineSpeakerWave className="max-h-[60%] max-w-[60%]" />
            )}
          </button>
        </div>
        I enjoy building <span className="italic">AI projects</span>. I
        specialize in <span className="underline">Machine Learning</span> but am
        working towards<span className="underline">full-stack</span> to bring{" "}
        <span className="italic">AI-powered user experiences</span> to life.
      </motion.h1>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-2 px-4 text-s font-medium"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
      >
        <Link
          href="#contact"
          className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition"
          onClick={() => {
            setActiveSection("Contact"), setTimeOfLastClick(Date.now());
          }}
        >
          Contact me here{" "}
          <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition" />
        </Link>

        <a
          className="group bg-white dark:bg-white/10 px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack"
          onMouseEnter={() =>
            setInfoText(
              "One page of highlights from CV, meant to showcase technical skills"
            )
          }
          onMouseLeave={() => setInfoText("")}
          href="/TigheCloughRésuméPublic.pdf"
          download
        >
          Download Résumé{" "}
          <HiDownload className="opacity-70 group-hover:translate-y-1 transition" />
        </a>

        <a
          className="group bg-white dark:bg-white/10 px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack"
          onMouseEnter={() =>
            setInfoText(
              "Complete professional and educational history including finance experience"
            )
          }
          onMouseLeave={() => setInfoText("")}
          href="/TigheCloughCVPublic.pdf"
          download
        >
          Download CV{" "}
          <HiDownload className="opacity-70 group-hover:translate-y-1 transition" />
        </a>

        <div className="flex gap-2">
          <a
            className="bg-white p-4 text-gray-700 dark:bg-white/10 dark:text-white/60 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack"
            href="https://linkedin.com/in/tighehclough"
            target="_blank"
          >
            <BsLinkedin />
          </a>
          <a
            className="bg-white p-4 text-gray-700 dark:bg-white/10 dark:text-white/60 flex items-center gap-2 rounded-full text-[1.20rem] focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack"
            href="https://github.com/thclough"
            target="_blank"
          >
            <FaGithubSquare />
          </a>
        </div>
      </motion.div>

      <div className="relative h-8 sm:h-0 items-center justify-center mt-2">
        <p className="inline-block text-gray-700 dark:text-gray-50">
          {infoText}
        </p>
      </div>
    </section>
  );
}
