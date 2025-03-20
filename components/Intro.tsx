"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import portrait from "@/public/portrait.jpg";
import { motion } from "framer-motion";
import { Linden_Hill } from "next/font/google";
import Link from "next/link";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { FaGithubSquare } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { useActiveSectionContext } from "@/context/ActiveSectionContext";

export default function Intro() {
  const [infoText, setInfoText] = useState("");

  const { setActiveSection } = useActiveSectionContext();
  const { ref, inView } = useInView({
    threshold: 0.75,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("Home");
    }
  }, [inView, setActiveSection]);

  return (
    <section
      ref={ref}
      id="home"
      className="mb-20 max-w-[50rem] text-center sm:mb-0 scroll-mt-100"
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
              width="192"
              height="192"
              quality="95"
              priority={true}
              alt="Tighe Clough portrait"
              className="h-40 w-40 rounded-full object-cover border-[0.35rem] border-white shadow-xl"
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
        <span className="font-bold">Hello, I'm Tighe.</span> <br /> I enjoy
        building <span className="italic">AI apps</span>. I specialize in{" "}
        <span className="underline">ML</span> but also employ{" "}
        <span className="underline">full-stack</span> to bring to life complete{" "}
        <span className="italic">AI-powered user experiences</span>.
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
        >
          Contact me here{" "}
          <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition" />{" "}
        </Link>

        <a
          className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer border-black/10"
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
          className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer border-black/10"
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
            className="bg-white p-4 text-gray-700 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer border-black/10"
            href="https://linkedin.com/in/tighehclough"
            target="_blank"
          >
            <BsLinkedin />
          </a>
          <a
            className="bg-white p-4 text-gray-700 flex items-center gap-2 rounded-full text-[1.20rem] focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer border-black/10"
            href="https://github.com/thclough"
            target="_blank"
          >
            <FaGithubSquare />
          </a>
        </div>
      </motion.div>

      <div className="relative h-8 sm:h-0 items-center justify-center mt-2">
        <p className="inline-block text-gray-700">{infoText}</p>
      </div>
    </section>
  );
}
