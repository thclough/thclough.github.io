import React from "react";

export default function Footer() {
  const curDate = new Date();
  return (
    <footer className="mb-10 px-4 text-center text-gray-500">
      <small className="mb-2 block text-xs">
        &copy; {curDate.getFullYear()} Tighe Clough. All rights reserved.
      </small>
      <p className="text-xs">
        <span>About this website:</span> built with React & Next.js (App Router
        & Server Actions), TypeScript, Tailwind CSS, Framer Motion, Vercel AI
        SDK, React Email & Resend - Vercel hosting.
      </p>
    </footer>
  );
}
