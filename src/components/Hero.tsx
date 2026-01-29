"use client";

import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useState, useEffect } from "react";
import VideoBackground from "./VideoBackground";
import Navbar from "./Navbar";

const cyclingTexts = [
  { text: "foi o jungle.", direction: "top" },
  { text: "foi o patch.", direction: "right" },
  { text: "foi azar.", direction: "bottom" },
  { text: "foi lag.", direction: "left" },
];

const getAnimationVariants = (direction: string) => {
  const variants = {
    top: {
      initial: { opacity: 0, y: -40, rotateX: 90, filter: "blur(8px)" },
      animate: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" },
      exit: { opacity: 0, y: 40, rotateX: -90, filter: "blur(8px)" },
    },
    right: {
      initial: { opacity: 0, x: 60, rotate: 8, scale: 0.9, filter: "blur(6px)" },
      animate: { opacity: 1, x: 0, rotate: 0, scale: 1, filter: "blur(0px)" },
      exit: { opacity: 0, x: -60, rotate: -8, scale: 0.9, filter: "blur(6px)" },
    },
    bottom: {
      initial: { opacity: 0, y: 40, scale: 0.85, filter: "blur(8px)" },
      animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
      exit: { opacity: 0, y: -40, scale: 0.85, filter: "blur(8px)" },
    },
    left: {
      initial: { opacity: 0, x: -60, rotate: -8, scale: 0.9, filter: "blur(6px)" },
      animate: { opacity: 1, x: 0, rotate: 0, scale: 1, filter: "blur(0px)" },
      exit: { opacity: 0, x: 60, rotate: 8, scale: 0.9, filter: "blur(6px)" },
    },
  };
  return variants[direction as keyof typeof variants] || variants.top;
};

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cyclingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentItem = cyclingTexts[currentIndex];
  const variants = getAnimationVariants(currentItem.direction);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <VideoBackground
          src="/backgroudnvideo.mp4"
        />

        {/* Grid overlay on top of video */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124, 184, 124, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124, 184, 124, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-30 flex min-h-screen flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main hero content */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8 md:px-12 md:pb-20 md:pt-0 lg:px-20">
          {/* Main headline row */}
          <motion.div
            className="flex flex-col items-center gap-1 overflow-visible"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Mobile: stacked layout / Desktop: inline */}
            <div className="flex flex-col items-center gap-1 overflow-visible text-center md:flex-row md:items-baseline md:gap-4">
              <h1 className="font-[family-name:var(--font-serif)] text-4xl font-medium italic tracking-tight text-white sm:text-5xl md:text-5xl lg:text-6xl">
                Você perdeu.
              </h1>
              <span
                className="font-[family-name:var(--font-serif)] text-4xl font-normal italic tracking-tight sm:text-5xl md:text-5xl lg:text-6xl"
                style={{
                  background: "linear-gradient(90deg, #6b966b, #98b898, #7cb87c, #a8cca8, #6b966b)",
                  backgroundSize: "300% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "gradientShift 5s ease infinite",
                }}
              >
                Mas sabe por quê?
              </span>
            </div>

            {/* "Não" fixo + texto ciclando */}
            <LayoutGroup>
              <motion.div
                className="mt-3 flex flex-col items-center justify-center text-center md:mt-4 md:flex-row md:items-baseline"
                style={{ perspective: "1000px" }}
                layout
              >
                <motion.span
                  layout="position"
                  className="font-[family-name:var(--font-serif)] text-4xl font-medium italic tracking-tight text-white sm:text-5xl md:text-5xl lg:text-6xl"
                  transition={{
                    layout: { type: "spring", stiffness: 200, damping: 30 }
                  }}
                >
                  Não<span className="hidden md:inline">&nbsp;</span>
                </motion.span>
                <div className="relative">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={currentIndex}
                      layout
                      className="inline-block font-[family-name:var(--font-serif)] text-4xl font-medium italic tracking-tight text-white sm:text-5xl md:text-5xl lg:text-6xl"
                      initial={variants.initial}
                      animate={variants.animate}
                      exit={variants.exit}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                        layout: { type: "spring", stiffness: 200, damping: 30 }
                      }}
                    >
                      {currentItem.text}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>
            </LayoutGroup>

            {/* CTA Button */}
            <motion.a
              href="/auth"
              className="group relative z-[60] mt-8 flex w-full max-w-xs items-center justify-center gap-4 overflow-hidden rounded-md border border-moss-700/30 bg-moss-950/95 px-5 py-4 shadow-[0_0_30px_rgba(74,124,74,0.15)] backdrop-blur-md transition-all hover:border-moss-600/50 hover:bg-moss-900/90 hover:shadow-[0_0_40px_rgba(74,124,74,0.25)] sm:mt-10 sm:w-auto sm:max-w-none sm:justify-between sm:gap-8 sm:px-6 md:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Container for rolling text effect */}
              <div className="relative h-5 overflow-hidden">
                <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
                  <span className="flex h-5 items-center whitespace-nowrap text-xs font-medium uppercase tracking-widest text-moss-200 sm:text-sm">
                    Experimente grátis
                  </span>
                  <span className="flex h-5 items-center whitespace-nowrap text-xs font-medium uppercase tracking-widest text-white sm:text-sm">
                    Experimente grátis
                  </span>
                </div>
              </div>

              {/* Arrow with rolling effect */}
              <div className="relative h-4 w-4 overflow-hidden">
                <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
                  <svg
                    className="h-4 w-4 text-moss-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </div>
            </motion.a>
          </motion.div>

          {/* Info Card - Left side (mobile: bottom, desktop: bottom-left) */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-[60] border-t border-moss-700/30 bg-moss-950/95 p-5 shadow-[0_0_30px_rgba(74,124,74,0.15)] backdrop-blur-md md:right-auto md:max-w-sm md:rounded-tr-md md:border-r md:border-t md:p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
          >
            <h3 className="font-[family-name:var(--font-serif)] text-lg font-medium italic text-white md:text-2xl">
              Descubra o que te faz perder
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-moss-300/80 md:mt-3 md:text-sm">
              Nossa IA analisa suas partidas em tempo real, identificando erros de posicionamento,
              decisões equivocadas e oportunidades perdidas. Pare de culpar o time e comece a evoluir
              com dados reais sobre seu gameplay.
            </p>

            {/* Animated arrow */}
            <div className="mt-3 flex items-center gap-2 md:mt-4">
              <span className="text-xs font-medium uppercase tracking-widest text-moss-500">
                Saiba mais
              </span>
              <svg
                className="h-4 w-4 text-moss-500 animate-bounce-arrow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>

          {/* Floating elements decoration (hidden on mobile) */}
          <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
            <motion.div
              className="absolute left-[10%] top-[30%] h-24 w-24 opacity-10"
              animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" className="text-moss-500">
                <polygon
                  points="50 1, 95 25, 95 75, 50 99, 5 75, 5 25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </motion.div>
            <motion.div
              className="absolute right-[15%] top-[40%] h-16 w-16 opacity-5"
              animate={{ y: [0, 20, 0], rotate: [360, 180, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" className="text-moss-400">
                <polygon
                  points="50 1, 95 25, 95 75, 50 99, 5 75, 5 25"
                  fill="currentColor"
                />
              </svg>
            </motion.div>
            <motion.div
              className="absolute bottom-[25%] left-[20%] h-12 w-12 opacity-5"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 100 100" className="text-moss-300">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </motion.div>
          </div>
        </main>

        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070a07] to-transparent" />
      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        :global(.animate-bounce-arrow) {
          animation: bounceArrow 1.5s ease-in-out infinite;
        }

        @keyframes bounceArrow {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(6px);
            opacity: 0.6;
          }
        }
      `}</style>
    </section>
  );
}
