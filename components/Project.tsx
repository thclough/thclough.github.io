"use client";

import Image from "next/image";
import { useScroll, useTransform } from "framer-motion";
import { projectsData } from "@/lib/data";
import { useRef } from "react";
import { motion } from "framer-motion";

type ProjectProps = (typeof projectsData)[number];

export default function Project({
  title,
  description,
  tags,
  imageUrl,
}: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgress,
        opacity: opacityProgress,
      }}
      className="group mb-3 sm:mb-8 last:mb-0"
    >
      <section className="bg-gray-100 max-w-[42rem] border border-black/5 rounded-lg overflow-hidden group-odd:pl-5 group-odd:pr-40 sm:group-odd:pr-2 group-even:pr-5 sm:h-[20rem] hover:bg-gray-200 transition relative">
        <div className="flex flex-col h-full pt-4 pb-7 sm:pt-10 group-even:ml-[12rem] sm:group-even:ml-[21rem] sm:max-w-[50%]">
          <h3 className="text-2x font-semibold">{title}</h3>
          <p className="mt-2 leading-relaxed text-gray-700">{description}</p>
          <ul className="flex flex-wrap gap-2 mt-4 sm:mt-auto">
            {tags.map((tag, index) => (
              <li
                className="bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white rounded-full"
                key={tag}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <Image
          src={imageUrl}
          alt={`${title} image`}
          quality={95}
          className="project-card"
        />
      </section>
    </motion.div>
  );
}
