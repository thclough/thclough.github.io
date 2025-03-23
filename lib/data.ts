import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { LuBrainCircuit } from "react-icons/lu";
import { LuGraduationCap } from "react-icons/lu";
import corpcommentImg from "@/public/corpcomment.png";
import rmtdevImg from "@/public/rmtdev.png";
import langplayImg from "@/public/langplay.png";

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
      "First technical professional experience. I worked on Python development and developed the standard project structure for a large company's data applications",
    icon: React.createElement(CgWorkAlt),
    date: "Summer 2023",
  },
  {
    title: "Graduated University",
    location: "Boston, MA",
    description:
      "I graduated from my studies with a degree in International Business/Finance and minor in data science. I also led my team to win 2nd place in the university data competition for that semester.",
    icon: React.createElement(LuGraduationCap),
    date: "December 2023",
  },
  {
    title: "Continuing Education",
    location: "Remote",
    description:
      "I have taken a little more than a year to intensely study machine learning, math, and full-stack development. I am also taking care of some family matters.",
    icon: React.createElement(LuBrainCircuit),
    date: "2024 - present",
  },
] as const;

export const projectsData = [
  {
    title: "CorpComment",
    description:
      "I worked as a full-stack developer on this startup project for 2 years. Users can give public feedback to companies.",
    tags: ["React", "Next.js", "MongoDB", "Tailwind", "Prisma"],
    imageUrl: corpcommentImg,
  },
  {
    title: "rmtDev",
    description:
      "Job board for remote developer jobs. I was the front-end developer. It has features like filtering, sorting and pagination.",
    tags: ["React", "TypeScript", "Next.js", "Tailwind", "Redux"],
    imageUrl: rmtdevImg,
  },
  {
    title: "Word Analytics",
    description:
      "A public web app for quick analytics on text. It shows word count, character count and social media post limits.",
    tags: ["React", "Next.js", "SQL", "Tailwind", "Framer"],
    imageUrl: langplayImg,
  },
] as const;

export const skillsData = [
  "Python",
  "Tensorflow",
  "Pytorch",
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
