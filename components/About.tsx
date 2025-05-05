"use client";

import React, { useEffect } from "react";
import SectionHeading from "./SectionHeading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const ref = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      id="about"
    >
      <SectionHeading>About Me</SectionHeading>
      <p>
        While majoring in{" "}
        <span className="font-medium">International Business and Finance</span>,
        I found more of an affinity for my minor{" "}
        <span className="font-medium">Data Science</span>. Believe it or not,
        wrangling spreadsheets and slide decks simply did not give me the same
        satisfaction as building out data projects and exploring math courses.
        After my undergraduate runway ended, I decided to dive into an{" "}
        <span className="italic">intense period of self-directed study</span> in{" "}
        <span className="font-medium">
          machine learning, math, full-stack development, and Mandarin Chinese
        </span>
        , a language I have been studying for many years. I&apos;m currently
        leveraging what I&apos;ve learned to build valuable projects.
      </p>
      <br />
      <p>W</p>
    </motion.section>
  );
}
