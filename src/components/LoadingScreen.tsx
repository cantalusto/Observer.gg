"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface Particle {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
}

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
      });
    }
    setParticles(newParticles);
  }, []);

  // Block scroll while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#040604]"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: "blur(10px)",
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Fog layers */}
          <div className="absolute inset-0">
            {/* Base dark gradient */}
            <div className="absolute inset-0 bg-gradient-radial from-moss-950/50 via-[#040604] to-[#020302]" />

            {/* Fog layer 1 - slow */}
            <div
              className="absolute inset-0 fog-layer-1"
              style={{
                background: `
                  radial-gradient(ellipse 80% 50% at 20% 50%, rgba(74, 124, 74, 0.08) 0%, transparent 50%),
                  radial-gradient(ellipse 60% 40% at 80% 30%, rgba(74, 124, 74, 0.06) 0%, transparent 50%),
                  radial-gradient(ellipse 70% 60% at 50% 80%, rgba(74, 124, 74, 0.05) 0%, transparent 50%)
                `,
              }}
            />

            {/* Fog layer 2 - medium */}
            <div
              className="absolute inset-0 fog-layer-2"
              style={{
                background: `
                  radial-gradient(ellipse 50% 70% at 70% 60%, rgba(100, 150, 100, 0.06) 0%, transparent 50%),
                  radial-gradient(ellipse 80% 40% at 30% 40%, rgba(80, 130, 80, 0.05) 0%, transparent 50%)
                `,
              }}
            />

            {/* Fog layer 3 - fast wisps */}
            <div
              className="absolute inset-0 fog-layer-3"
              style={{
                background: `
                  radial-gradient(ellipse 40% 30% at 60% 70%, rgba(120, 170, 120, 0.04) 0%, transparent 50%),
                  radial-gradient(ellipse 30% 50% at 40% 30%, rgba(90, 140, 90, 0.03) 0%, transparent 50%)
                `,
              }}
            />

            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
              }}
            />

            {/* Particles floating */}
            <div className="absolute inset-0">
              {particles.map((particle) => (
                <div
                  key={particle.id}
                  className="particle"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    animationDelay: `${particle.delay}s`,
                    animationDuration: `${particle.duration}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Logo container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Multiple glow layers behind logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer glow - large and soft */}
              <div
                className="absolute h-[500px] w-[500px] rounded-full blur-[100px] md:h-[600px] md:w-[600px]"
                style={{
                  background: "radial-gradient(circle, rgba(74, 180, 74, 0.15) 0%, transparent 60%)",
                  animation: "pulse-glow 4s ease-in-out infinite",
                }}
              />
              {/* Inner glow - intense green */}
              <div
                className="absolute h-[300px] w-[300px] rounded-full blur-[60px] md:h-[400px] md:w-[400px]"
                style={{
                  background: "radial-gradient(circle, rgba(100, 200, 100, 0.2) 0%, transparent 70%)",
                  animation: "pulse-glow 3s ease-in-out infinite 0.5s",
                }}
              />
            </div>

            {/* Logo with breathing animation */}
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.03, 1],
                filter: [
                  "drop-shadow(0 0 20px rgba(74, 180, 74, 0.3))",
                  "drop-shadow(0 0 40px rgba(74, 180, 74, 0.5))",
                  "drop-shadow(0 0 20px rgba(74, 180, 74, 0.3))"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/Logo.png"
                alt="Observer.GG"
                width={400}
                height={300}
                className="h-auto w-64 object-contain md:w-80 lg:w-96"
                priority
              />
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="mt-12 w-48 md:w-64"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="h-[2px] w-full overflow-hidden rounded-full bg-moss-900/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-moss-600 via-moss-400 to-moss-600"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ width: "50%" }}
                />
              </div>
              <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.25em] text-moss-600/80">
                Entrando no Rift
              </p>
            </motion.div>
          </div>

          {/* CSS for fog and particles */}
          <style jsx>{`
            @keyframes fog1 {
              0%, 100% {
                transform: translateX(0) translateY(0) scale(1);
                opacity: 0.6;
              }
              25% {
                transform: translateX(5%) translateY(-3%) scale(1.05);
                opacity: 0.8;
              }
              50% {
                transform: translateX(-3%) translateY(5%) scale(1.1);
                opacity: 0.5;
              }
              75% {
                transform: translateX(-5%) translateY(-2%) scale(1.02);
                opacity: 0.7;
              }
            }

            @keyframes fog2 {
              0%, 100% {
                transform: translateX(0) translateY(0) scale(1);
                opacity: 0.5;
              }
              33% {
                transform: translateX(-8%) translateY(4%) scale(1.08);
                opacity: 0.7;
              }
              66% {
                transform: translateX(6%) translateY(-6%) scale(0.95);
                opacity: 0.4;
              }
            }

            @keyframes fog3 {
              0%, 100% {
                transform: translateX(0) translateY(0);
                opacity: 0.4;
              }
              50% {
                transform: translateX(10%) translateY(-8%);
                opacity: 0.6;
              }
            }

            @keyframes float-particle {
              0%, 100% {
                transform: translateY(0) translateX(0);
                opacity: 0;
              }
              10% {
                opacity: 0.6;
              }
              90% {
                opacity: 0.6;
              }
              100% {
                transform: translateY(-100px) translateX(20px);
                opacity: 0;
              }
            }

            @keyframes pulse-glow {
              0%, 100% {
                transform: scale(1);
                opacity: 0.5;
              }
              50% {
                transform: scale(1.2);
                opacity: 0.8;
              }
            }

            .fog-layer-1 {
              animation: fog1 12s ease-in-out infinite;
            }

            .fog-layer-2 {
              animation: fog2 8s ease-in-out infinite;
            }

            .fog-layer-3 {
              animation: fog3 6s ease-in-out infinite;
            }

            .particle {
              position: absolute;
              width: 2px;
              height: 2px;
              background: rgba(120, 200, 120, 0.5);
              border-radius: 50%;
              box-shadow: 0 0 6px rgba(100, 180, 100, 0.4);
              animation: float-particle 6s ease-in-out infinite;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
