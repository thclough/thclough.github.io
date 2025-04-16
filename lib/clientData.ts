import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { LuBrainCircuit } from "react-icons/lu";
import { LuGraduationCap } from "react-icons/lu";
import portfolioImg from "@/public/portfoliowebsite.png";
import ispytickersImg from "@/public/ispytickers.png";
import whmlahImg from "@/public/whmlah.png";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "Student Consultant",
    location: "Cologne, Germany",
    description:
      "First technical professional experience. I worked on Python development and developed the standard data project structure for a large company",
    icon: React.createElement(CgWorkAlt),
    date: "Summer 2023",
  },
  {
    title: "Graduated University",
    location: "Boston, MA",
    description:
      "I graduated from my studies with a degree in International Business/Finance and minor in Data Science. I also led my team to win 2nd place in the university data competition in my final semester.",
    icon: React.createElement(LuGraduationCap),
    date: "December 2023",
  },
  {
    title: "Continuing Education",
    location: "Remote",
    description:
      "I have taken a little more than a year to intensely study machine learning, math, and full-stack development.",
    icon: React.createElement(LuBrainCircuit),
    date: "2024 - present",
  },
] as const;

export const projectsData = [
  {
    title: "Portfolio Website (you are here)",
    description:
      "I learned Next.js, Tailwind, Framer Motion, and the Vercel AI SDK through building this portfolio website.",
    tags: ["React", "Next.js", "Typescript", "Tailwind", "Framer", "Groq"],
    imageUrl: portfolioImg,
    href: "https://www.tigheclough.com",
  },
  {
    title: "We Have ML at Home",
    description:
      "Where I write ML algos from scratch, highest level of abstraction is numpy, test models with synthetic data sets.",
    tags: ["Python", "numpy"],
    imageUrl: whmlahImg,
    href: "https://github.com/thclough/we_have_ml_at_home",
  },
  {
    title: "I Spy Tickers",
    description:
      "Scraped 30,000+ financial articles. Built a bidirectional LSTM with custom layers to identify where public companies are mentioned in text. Achieved F1 of .818.",
    tags: ["Python", "Selenium", "Tensorflow/Keras"],
    imageUrl: ispytickersImg,
    href: "https://github.com/thclough/i-spy-tickers",
  },
] as const;

export const skillsData = [
  "Python",
  "Tensorflow",
  "PyTorch",
  "LangChain",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind",
  "Framer Motion",
  "Redux",
  "Node.js",
  "Express",
  "PostgreSQL",
  "Prisma",
  "MongoDB",
] as const;
