"use client";

import React, { useRef, useEffect } from "react";
import SectionHeading from "./SectionHeading";
import { projectsData } from "@/lib/clientData";
import Project from "./Project";
import { useSectionInView } from "@/lib/hooks";

export default function Projects() {
  const ref = useSectionInView("Projects", 0.5);

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28">
      <SectionHeading>Featured Projects</SectionHeading>
      <div>
        {projectsData.map((project, index) => (
          <React.Fragment key={project.title}>
            <Project {...project} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
