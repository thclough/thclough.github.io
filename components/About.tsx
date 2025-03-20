"use client";

import React from "react";
import SectionHeading from "./SectionHeading";
import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.section
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionHeading>About Me</SectionHeading>
      <p>
        While majoring in{" "}
        <span className="font-medium">International Business/Finance</span>, I
        found I had much more of an affinity for my minor{" "}
        <span className="font-medium">Data Science</span>. Believe it or not,
        wrangling spreadsheets and slide decks simply did not give me the same
        satisfaction as building out programmatic data projects and exploring
        math courses. After my undergraduate runway ran out, I decided to dive
        into an <span className="italic">intense period of self study</span> in{" "}
        <span className="font-medium">
          machine learning, math, and full-stack development.
        </span>{" "}
        I'm currently leveraging what I've learned to build valuable projects.
      </p>
      <p></p>
    </motion.section>
  );
}
