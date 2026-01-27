"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [time, setTime] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHoveringTime, setIsHoveringTime] = useState(false);
  const [glitchText, setGlitchText] = useState("Tá na hora do League");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const timezone = "BRT";
      setTime(`${timezone} ${formatted}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Efeito glitch no texto
  useEffect(() => {
    if (!isHoveringTime) return;

    const originalText = "Tá na hora do League";
    const glitchChars = "!@#$%¨&*()_+-=[]{}|;:,.<>?/\\~`0123456789";
    let intervalId: NodeJS.Timeout;

    const glitch = () => {
      const glitched = originalText
        .split("")
        .map((char) => {
          if (char === " ") return " ";
          return Math.random() > 0.7
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : char;
        })
        .join("");
      setGlitchText(glitched);
    };

    intervalId = setInterval(glitch, 80);

    // Depois de um tempo, estabiliza no texto original
    const timeout = setTimeout(() => {
      clearInterval(intervalId);
      setGlitchText(originalText);
    }, 600);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeout);
    };
  }, [isHoveringTime]);

  return (
    <motion.header
      className="relative z-[60]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between px-4 py-5 md:px-8 lg:px-12">
        {/* Left side - Logo + Menu with blur box */}
        <div className="relative z-[60] flex items-center gap-5 rounded-md border border-moss-700/30 bg-moss-950/95 px-6 py-4 shadow-[0_0_30px_rgba(74,124,74,0.15)] backdrop-blur-md">
          {/* Logo */}
          <a href="/" className="flex items-center gap-1">
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-white md:text-xl">
              OBSERVER
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-moss-500 md:text-xl">
              .GG
            </span>
          </a>

          {/* Divider */}
          <div className="h-5 w-px bg-moss-700/50" />

          {/* Menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="group flex items-center gap-2 transition-opacity hover:opacity-70"
          >
            <svg
              className="h-3.5 w-3.5 text-white transition-transform group-hover:rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-widest text-white">Menu</span>
          </button>
        </div>

        {/* Center - Time with Easter Egg */}
        <div
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 cursor-pointer md:block"
          onMouseEnter={() => setIsHoveringTime(true)}
          onMouseLeave={() => setIsHoveringTime(false)}
        >
          <span
            className={`font-mono text-sm tracking-widest transition-all duration-300 ${
              isHoveringTime
                ? "text-moss-400 glitch-text"
                : "text-white"
            }`}
          >
            {isHoveringTime ? glitchText : time}
          </span>

          {/* Glitch layers */}
          {isHoveringTime && (
            <>
              <span
                className="absolute left-0 top-0 font-mono text-sm tracking-widest text-red-500/70 glitch-layer-1"
                aria-hidden="true"
              >
                {glitchText}
              </span>
              <span
                className="absolute left-0 top-0 font-mono text-sm tracking-widest text-cyan-500/70 glitch-layer-2"
                aria-hidden="true"
              >
                {glitchText}
              </span>
            </>
          )}
        </div>

        {/* Right side - CTA with blur box */}
        <a
          href="#"
          className="group relative z-[60] flex items-center gap-4 overflow-hidden rounded-md border border-moss-700/30 bg-moss-950/95 px-6 py-4 shadow-[0_0_30px_rgba(74,124,74,0.15)] backdrop-blur-md transition-all hover:border-moss-600/50 hover:bg-moss-900/90 hover:shadow-[0_0_40px_rgba(74,124,74,0.25)]"
        >
          {/* Container for rolling text effect */}
          <div className="relative h-5 overflow-hidden">
            <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
              {/* Original text */}
              <span className="flex h-5 items-center text-sm font-medium uppercase tracking-widest text-white">
                Comecar Gratis
              </span>
              {/* Duplicated text (hidden below) */}
              <span className="flex h-5 items-center text-sm font-medium uppercase tracking-widest text-moss-400">
                Comecar Gratis
              </span>
            </div>
          </div>

          {/* Arrow with rolling effect */}
          <div className="relative h-4 w-4 overflow-hidden">
            <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <svg
                className="h-4 w-4 text-moss-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </a>
      </div>

      {/* Glitch CSS */}
      <style jsx>{`
        .glitch-text {
          position: relative;
          animation: glitchText 0.3s ease-in-out infinite;
        }

        .glitch-layer-1 {
          animation: glitch1 0.2s ease-in-out infinite;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }

        .glitch-layer-2 {
          animation: glitch2 0.3s ease-in-out infinite;
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        }

        @keyframes glitchText {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
        }

        @keyframes glitch1 {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(3px, 0); }
          50% { transform: translate(-3px, 0); }
          75% { transform: translate(2px, 0); }
        }

        @keyframes glitch2 {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(-2px, 0); }
          50% { transform: translate(2px, 0); }
          75% { transform: translate(-3px, 0); }
        }
      `}</style>
    </motion.header>
  );
}
