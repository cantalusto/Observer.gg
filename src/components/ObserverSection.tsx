"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export default function ObserverSection() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  // Motion values para rastreamento do mouse
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Movimento sutil dos olhos seguindo o mouse
  const eyeX = useSpring(useTransform(x, [-1, 1], [-8, 8]), { stiffness: 50, damping: 20 });
  const eyeY = useSpring(useTransform(y, [-1, 1], [-5, 5]), { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const normalizedX = (e.clientX - centerX) / centerX;
      const normalizedY = (e.clientY - centerY) / centerY;
      x.set(normalizedX);
      y.set(normalizedY);
      setMouseX(normalizedX);
      setMouseY(normalizedY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  // Efeito de glitch aleatório
  useEffect(() => {
    const triggerGlitch = () => {
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150 + Math.random() * 200);
      }
    };

    const interval = setInterval(triggerGlitch, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#040604]">
      {/* Background gradient - atmosfera verde */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 20%, rgba(50, 100, 50, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 80% 50% at 30% 50%, rgba(40, 90, 40, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 70% 60%, rgba(40, 90, 40, 0.15) 0%, transparent 50%),
            linear-gradient(to bottom, #030503 0%, #050805 30%, #040604 70%, #030503 100%)
          `,
        }}
      />

      {/* Partículas flutuantes sinistras */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + Math.random() * 4,
              height: 2 + Math.random() * 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(74, ${150 + Math.random() * 50}, 74, ${0.2 + Math.random() * 0.3})`,
              boxShadow: `0 0 ${6 + Math.random() * 10}px rgba(74, 180, 74, 0.4)`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 50, 0],
              x: [0, (Math.random() - 0.5) * 40, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Efeito de luz pulsante vindo do monstro */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 45%, rgba(74, 200, 74, 0.15) 0%, transparent 60%)`,
        }}
      />

      {/* Monster image - com animações assustadoras */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            x: eyeX,
            y: eyeY,
          }}
        >
          {/* Camada de glitch - vermelho */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: glitchActive ? 0.8 : 0,
              x: glitchActive ? -4 : 0,
            }}
          >
            <Image
              src="/monster.png"
              alt=""
              width={1920}
              height={1080}
              className="w-full max-w-none h-auto min-h-[80vh] object-contain scale-110"
              style={{
                filter: "drop-shadow(0 0 60px rgba(255, 50, 50, 0.5)) hue-rotate(-60deg) saturate(2)",
                mixBlendMode: "screen",
              }}
              priority
            />
          </motion.div>

          {/* Camada de glitch - ciano */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: glitchActive ? 0.8 : 0,
              x: glitchActive ? 4 : 0,
            }}
          >
            <Image
              src="/monster.png"
              alt=""
              width={1920}
              height={1080}
              className="w-full max-w-none h-auto min-h-[80vh] object-contain scale-110"
              style={{
                filter: "drop-shadow(0 0 60px rgba(50, 200, 255, 0.5)) hue-rotate(60deg) saturate(2)",
                mixBlendMode: "screen",
              }}
              priority
            />
          </motion.div>

          {/* Imagem principal com animação de respiração */}
          <motion.div
            animate={{
              scale: [1.1, 1.13, 1.1],
              filter: [
                "drop-shadow(0 0 60px rgba(74, 180, 74, 0.3))",
                "drop-shadow(0 0 100px rgba(74, 220, 74, 0.5))",
                "drop-shadow(0 0 60px rgba(74, 180, 74, 0.3))",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/monster.png"
              alt="O Observador"
              width={1920}
              height={1080}
              className="w-full max-w-none h-auto min-h-[80vh] object-contain monster-image"
              style={{
                filter: glitchActive
                  ? "drop-shadow(0 0 80px rgba(74, 220, 74, 0.6)) brightness(1.3) contrast(1.2)"
                  : "drop-shadow(0 0 60px rgba(74, 180, 74, 0.3))",
              }}
              priority
            />
          </motion.div>

          {/* Brilho dos olhos - pulsante */}
          <motion.div
            className="absolute top-[35%] left-1/2 -translate-x-1/2 pointer-events-none"
            animate={{
              opacity: [0.4, 0.9, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              className="w-[200px] h-[60px] rounded-full"
              style={{
                background: "radial-gradient(ellipse, rgba(100, 255, 100, 0.6) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Linhas de scan horror */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden scan-lines" />

      {/* Vinheta escura nas bordas */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.7) 100%)
          `,
        }}
      />

      {/* Green fog/mist layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Bottom fog - dense */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[50%] fog-layer-1"
          style={{
            background: `
              linear-gradient(to top,
                rgba(30, 70, 35, 0.95) 0%,
                rgba(35, 80, 40, 0.7) 20%,
                rgba(40, 90, 45, 0.4) 40%,
                rgba(45, 100, 50, 0.15) 70%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Mid fog wisps */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[60%] fog-layer-2"
          style={{
            background: `
              radial-gradient(ellipse 60% 30% at 20% 90%, rgba(50, 120, 55, 0.6) 0%, transparent 70%),
              radial-gradient(ellipse 50% 25% at 80% 85%, rgba(45, 110, 50, 0.5) 0%, transparent 70%),
              radial-gradient(ellipse 70% 35% at 50% 95%, rgba(55, 130, 60, 0.5) 0%, transparent 70%)
            `,
          }}
        />

        {/* Top atmospheric haze */}
        <div
          className="absolute top-0 left-0 right-0 h-[40%]"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 50% -20%, rgba(40, 100, 45, 0.4) 0%, transparent 60%)
            `,
          }}
        />

        {/* Side fog */}
        <div
          className="absolute inset-y-0 left-0 w-[30%] fog-layer-3"
          style={{
            background: `
              linear-gradient(to right, rgba(30, 70, 35, 0.5) 0%, transparent 100%)
            `,
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[30%] fog-layer-3"
          style={{
            background: `
              linear-gradient(to left, rgba(30, 70, 35, 0.5) 0%, transparent 100%)
            `,
          }}
        />

        {/* Floating mist particles */}
        <div className="absolute inset-0">
          <div
            className="absolute bottom-[20%] left-[10%] w-[300px] h-[150px] rounded-full blur-3xl mist-float-1"
            style={{ background: "rgba(60, 140, 70, 0.2)" }}
          />
          <div
            className="absolute bottom-[30%] right-[15%] w-[250px] h-[120px] rounded-full blur-3xl mist-float-2"
            style={{ background: "rgba(55, 130, 65, 0.15)" }}
          />
          <div
            className="absolute bottom-[15%] left-[40%] w-[400px] h-[100px] rounded-full blur-3xl mist-float-3"
            style={{ background: "rgba(65, 150, 75, 0.2)" }}
          />
        </div>
      </div>

      {/* Title */}
      <div className="absolute inset-0 flex items-end justify-center pb-24 z-30">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-4xl font-medium italic tracking-tight text-white md:text-5xl lg:text-7xl drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
            Conheça o{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #5a9a5a, #7dca7d, #5a9a5a)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s ease-in-out infinite",
              }}
            >
              Observador
            </span>
          </h2>
          <p className="mt-4 text-sm uppercase tracking-[0.3em] text-moss-400/60">
            Scroll para descobrir
          </p>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fogDrift1 {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-2%) translateY(-1%); }
        }

        @keyframes fogDrift2 {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(3%) translateY(-2%); }
        }

        @keyframes fogDrift3 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(2%); }
        }

        @keyframes mistFloat1 {
          0%, 100% { transform: translateX(0) translateY(0); opacity: 0.2; }
          50% { transform: translateX(20px) translateY(-10px); opacity: 0.35; }
        }

        @keyframes mistFloat2 {
          0%, 100% { transform: translateX(0) translateY(0); opacity: 0.15; }
          50% { transform: translateX(-15px) translateY(-8px); opacity: 0.25; }
        }

        @keyframes mistFloat3 {
          0%, 100% { transform: translateX(0) translateY(0); opacity: 0.2; }
          50% { transform: translateX(10px) translateY(-5px); opacity: 0.3; }
        }

        .fog-layer-1 {
          animation: fogDrift1 12s ease-in-out infinite;
        }

        .fog-layer-2 {
          animation: fogDrift2 10s ease-in-out infinite;
        }

        .fog-layer-3 {
          animation: fogDrift3 15s ease-in-out infinite;
        }

        .mist-float-1 {
          animation: mistFloat1 8s ease-in-out infinite;
        }

        .mist-float-2 {
          animation: mistFloat2 10s ease-in-out infinite;
        }

        .mist-float-3 {
          animation: mistFloat3 12s ease-in-out infinite;
        }

        .scan-lines {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          );
          animation: scanMove 8s linear infinite;
        }

        @keyframes scanMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }

        .monster-image {
          animation: monsterPulse 6s ease-in-out infinite;
        }

        @keyframes monsterPulse {
          0%, 100% {
            filter: drop-shadow(0 0 60px rgba(74, 180, 74, 0.3)) brightness(1);
          }
          50% {
            filter: drop-shadow(0 0 100px rgba(74, 220, 74, 0.5)) brightness(1.05);
          }
        }
      `}</style>
    </section>
  );
}
