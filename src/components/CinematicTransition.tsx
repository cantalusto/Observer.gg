"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useRef, useEffect } from "react";
import ObserverSection from "./ObserverSection";
import { useCursor } from "@/contexts/CursorContext";

export default function CinematicTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mode, setMode } = useCursor();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Track scroll to change cursor mode
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    // 0.1-0.6: Hidden (durante "Algo te observa")
    // 0.6+: Possessed (monstro revelado)
    if (value >= 0.1 && value < 0.6) {
      setMode("hidden");
    } else if (value >= 0.6) {
      setMode("possessed");
    } else {
      setMode("normal");
    }
  });

  // Reset cursor when scrolling above this section
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      // Se a seção está completamente abaixo da viewport, reset para normal
      if (rect.top > window.innerHeight) {
        if (mode !== "normal") {
          setMode("normal");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mode, setMode]);

  // Controle de visibilidade - overlay só aparece quando seção entra na tela
  const overlayVisible = useTransform(
    scrollYProgress,
    [0, 0.05, 0.9, 1],
    [0, 1, 1, 0]
  );

  // Fase 1: Barras fecham rapidamente (0.05 -> 0.15)
  // Fase 2: Pausa dramática com texto (0.15 -> 0.55)
  // Fase 3: Barras abrem revelando Observer (0.6 -> 0.8)

  // Altura das barras
  const topBarHeight = useTransform(
    scrollYProgress,
    [0.05, 0.15, 0.55, 0.8],
    ["0vh", "50vh", "50vh", "0vh"]
  );

  const bottomBarHeight = useTransform(
    scrollYProgress,
    [0.05, 0.15, 0.55, 0.8],
    ["0vh", "50vh", "50vh", "0vh"]
  );

  // Opacidade do texto central
  const textOpacity = useTransform(
    scrollYProgress,
    [0.12, 0.2, 0.5, 0.58],
    [0, 1, 1, 0]
  );

  const textScale = useTransform(
    scrollYProgress,
    [0.12, 0.2, 0.5, 0.58],
    [0.8, 1, 1, 1.1]
  );

  // Glow effect durante a pausa
  const glowOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.25, 0.5, 0.58],
    [0, 0.6, 0.6, 0]
  );

  // Flash quando as barras abrem
  const flashOpacity = useTransform(
    scrollYProgress,
    [0.56, 0.62, 0.7],
    [0, 0.4, 0]
  );

  // Opacidade do overlay preto que esconde o Observer
  const blackOverlayOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.7],
    [1, 0]
  );

  return (
    <section id="diferenciais" ref={containerRef} className="relative h-[350vh]">
      {/* Observer Section - por baixo */}
      <div className="sticky top-0 h-screen">
        <ObserverSection />
        {/* Overlay preto que esconde o Observer até a revelação */}
        <motion.div
          className="absolute inset-0 bg-[#030503] z-10"
          style={{ opacity: blackOverlayOpacity }}
        />
      </div>

      {/* Letterbox Overlay - só visível quando a seção está na tela */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-50"
        style={{ opacity: overlayVisible }}
      >
        {/* Barra superior */}
        <motion.div
          className="absolute top-0 left-0 right-0 bg-[#030503]"
          style={{ height: topBarHeight }}
        >
          {/* Linha verde sutil na borda */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(74, 180, 74, 0.5), transparent)",
              opacity: glowOpacity,
            }}
          />
        </motion.div>

        {/* Barra inferior */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-[#030503]"
          style={{ height: bottomBarHeight }}
        >
          {/* Linha verde sutil na borda */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(74, 180, 74, 0.5), transparent)",
              opacity: glowOpacity,
            }}
          />
        </motion.div>

        {/* Texto central durante a pausa */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: textOpacity, scale: textScale }}
        >
          <div className="text-center">
            <motion.div
              className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-moss-600"
              style={{ opacity: glowOpacity }}
            >
              Prepare-se
            </motion.div>
            <h2 className="font-[family-name:var(--font-serif)] text-3xl font-medium italic text-white md:text-4xl lg:text-5xl">
              Algo te observa
            </h2>
            <motion.div
              className="mx-auto mt-6 h-[1px] w-32 bg-gradient-to-r from-transparent via-moss-500 to-transparent"
              style={{ opacity: glowOpacity, scaleX: useTransform(scrollYProgress, [0.18, 0.35], [0, 1]) }}
            />
          </div>
        </motion.div>

        {/* Flash de luz verde quando abre */}
        <motion.div
          className="absolute inset-0 bg-moss-500"
          style={{ opacity: flashOpacity, mixBlendMode: "overlay" }}
        />

        {/* Glow atmosférico */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: glowOpacity,
            background: "radial-gradient(ellipse 50% 30% at 50% 50%, rgba(74, 180, 74, 0.1) 0%, transparent 70%)",
          }}
        />

        {/* Partículas flutuando durante a pausa */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: glowOpacity }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-moss-400/40"
              style={{
                left: `${15 + (i * 7)}%`,
                top: "50%",
                y: useTransform(
                  scrollYProgress,
                  [0.1, 0.55],
                  [0, (i % 2 === 0 ? -1 : 1) * (20 + i * 5)]
                ),
                opacity: useTransform(
                  scrollYProgress,
                  [0.1, 0.2, 0.5, 0.55],
                  [0, 0.6, 0.6, 0]
                ),
                scale: 0.5 + (i % 3) * 0.3,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
