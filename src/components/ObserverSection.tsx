"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useEffect, useState } from "react";

// Partículas com valores fixos para evitar hydration mismatch
const PARTICLES = [
  { w: 3, h: 4, l: 5, t: 10, g: 160, o: 0.3, s: 8, y: -40, x: 15, d: 7, dl: 0 },
  { w: 4, h: 3, l: 15, t: 25, g: 170, o: 0.4, s: 10, y: -55, x: -12, d: 9, dl: 1 },
  { w: 2, h: 5, l: 25, t: 40, g: 155, o: 0.25, s: 12, y: -35, x: 8, d: 6, dl: 2 },
  { w: 5, h: 4, l: 35, t: 15, g: 180, o: 0.35, s: 9, y: -60, x: -18, d: 8, dl: 0.5 },
  { w: 3, h: 3, l: 45, t: 55, g: 165, o: 0.28, s: 11, y: -45, x: 10, d: 10, dl: 1.5 },
  { w: 4, h: 5, l: 55, t: 30, g: 175, o: 0.4, s: 7, y: -50, x: -8, d: 7, dl: 2.5 },
  { w: 2, h: 4, l: 65, t: 70, g: 158, o: 0.32, s: 13, y: -38, x: 20, d: 11, dl: 0 },
  { w: 5, h: 3, l: 75, t: 20, g: 185, o: 0.38, s: 8, y: -65, x: -15, d: 6, dl: 3 },
  { w: 3, h: 5, l: 85, t: 45, g: 162, o: 0.27, s: 10, y: -42, x: 5, d: 9, dl: 1 },
  { w: 4, h: 4, l: 95, t: 60, g: 172, o: 0.33, s: 14, y: -55, x: -10, d: 8, dl: 2 },
  { w: 2, h: 3, l: 10, t: 80, g: 168, o: 0.3, s: 9, y: -48, x: 12, d: 12, dl: 0.5 },
  { w: 5, h: 5, l: 30, t: 65, g: 178, o: 0.36, s: 11, y: -58, x: -6, d: 7, dl: 3.5 },
  { w: 3, h: 4, l: 50, t: 85, g: 154, o: 0.29, s: 8, y: -32, x: 18, d: 10, dl: 1.5 },
  { w: 4, h: 3, l: 70, t: 35, g: 182, o: 0.42, s: 12, y: -62, x: -14, d: 6, dl: 4 },
  { w: 2, h: 5, l: 90, t: 75, g: 166, o: 0.31, s: 10, y: -44, x: 8, d: 9, dl: 2 },
];

export default function ObserverSection() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const eyeX = useSpring(useTransform(x, [-1, 1], [-8, 8]), { stiffness: 50, damping: 20 });
  const eyeY = useSpring(useTransform(y, [-1, 1], [-5, 5]), { stiffness: 50, damping: 20 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      x.set((e.clientX - centerX) / centerX);
      y.set((e.clientY - centerY) / centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  useEffect(() => {
    const triggerGlitch = () => {
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }
    };

    const interval = setInterval(triggerGlitch, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#040604]">
      {/* Background gradient */}
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

      {/* Partículas com valores fixos */}
      {isClient && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full particle-float"
              style={{
                width: p.w,
                height: p.h,
                left: `${p.l}%`,
                top: `${p.t}%`,
                background: `rgba(74, ${p.g}, 74, ${p.o})`,
                boxShadow: `0 0 ${p.s}px rgba(74, 180, 74, 0.4)`,
                animationDuration: `${p.d}s`,
                animationDelay: `${p.dl}s`,
                // @ts-ignore - custom properties
                "--float-y": `${p.y}px`,
                "--float-x": `${p.x}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Luz pulsante */}
      <div
        className="absolute inset-0 pointer-events-none animate-pulse-glow"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 45%, rgba(74, 200, 74, 0.15) 0%, transparent 60%)`,
        }}
      />

      {/* Monster image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          style={{ x: eyeX, y: eyeY }}
        >
          {/* Glitch layers */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: glitchActive ? 0.8 : 0, x: glitchActive ? -4 : 0 }}
          >
            <Image
              src="/monster.png"
              alt=""
              width={1920}
              height={1080}
              className="w-full max-w-none h-auto min-h-[60vh] object-contain scale-125 md:min-h-[80vh] md:scale-110"
              style={{
                filter: "drop-shadow(0 0 60px rgba(255, 50, 50, 0.5)) hue-rotate(-60deg) saturate(2)",
                mixBlendMode: "screen",
              }}
              priority
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: glitchActive ? 0.8 : 0, x: glitchActive ? 4 : 0 }}
          >
            <Image
              src="/monster.png"
              alt=""
              width={1920}
              height={1080}
              className="w-full max-w-none h-auto min-h-[60vh] object-contain scale-125 md:min-h-[80vh] md:scale-110"
              style={{
                filter: "drop-shadow(0 0 60px rgba(50, 200, 255, 0.5)) hue-rotate(60deg) saturate(2)",
                mixBlendMode: "screen",
              }}
              priority
            />
          </motion.div>

          {/* Main image */}
          <div className="monster-breathing">
            <Image
              src="/monster.png"
              alt="O Observador"
              width={1920}
              height={1080}
              className="w-full max-w-none h-auto min-h-[60vh] object-contain scale-125 md:min-h-[80vh] md:scale-100"
              style={{
                filter: glitchActive
                  ? "drop-shadow(0 0 80px rgba(74, 220, 74, 0.6)) brightness(1.3)"
                  : "drop-shadow(0 0 60px rgba(74, 180, 74, 0.3))",
              }}
              priority
            />
          </div>

          {/* Eye glow */}
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 pointer-events-none eye-pulse">
            <div
              className="w-[120px] h-[40px] rounded-full md:w-[200px] md:h-[60px]"
              style={{
                background: "radial-gradient(ellipse, rgba(100, 255, 100, 0.6) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none scan-lines" />

      {/* Vinheta FORTE - foco no monstro e texto */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 40%, transparent 5%, rgba(0, 0, 0, 0.4) 30%, rgba(0, 0, 0, 0.8) 55%, #030503 75%)
          `,
        }}
      />
      
      {/* Bordas extras escuras */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#030503] via-[#030503]/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030503] via-[#030503]/60 to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#030503] via-[#030503]/70 to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#030503] via-[#030503]/70 to-transparent pointer-events-none" />

      {/* Fog layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-0 right-0 h-[50%] fog-layer-1"
          style={{
            background: `linear-gradient(to top, rgba(30, 70, 35, 0.95) 0%, rgba(35, 80, 40, 0.7) 20%, rgba(40, 90, 45, 0.4) 40%, transparent 100%)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[60%] fog-layer-2"
          style={{
            background: `radial-gradient(ellipse 60% 30% at 20% 90%, rgba(50, 120, 55, 0.6) 0%, transparent 70%), radial-gradient(ellipse 50% 25% at 80% 85%, rgba(45, 110, 50, 0.5) 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-[30%] fog-layer-3"
          style={{ background: `linear-gradient(to right, rgba(30, 70, 35, 0.5) 0%, transparent 100%)` }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[30%] fog-layer-3"
          style={{ background: `linear-gradient(to left, rgba(30, 70, 35, 0.5) 0%, transparent 100%)` }}
        />
      </div>

      {/* Edge mist overlays - covers image borders */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Left edge mist */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[25%] mist-drift-left"
          style={{
            background: `
              linear-gradient(to right,
                rgba(4, 6, 4, 1) 0%,
                rgba(4, 6, 4, 0.95) 20%,
                rgba(10, 20, 10, 0.7) 40%,
                rgba(20, 40, 20, 0.3) 70%,
                transparent 100%
              )
            `,
          }}
        />
        {/* Right edge mist */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[25%] mist-drift-right"
          style={{
            background: `
              linear-gradient(to left,
                rgba(4, 6, 4, 1) 0%,
                rgba(4, 6, 4, 0.95) 20%,
                rgba(10, 20, 10, 0.7) 40%,
                rgba(20, 40, 20, 0.3) 70%,
                transparent 100%
              )
            `,
          }}
        />
        {/* Top edge mist */}
        <div
          className="absolute top-0 left-0 right-0 h-[20%]"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(4, 6, 4, 1) 0%,
                rgba(4, 6, 4, 0.8) 30%,
                rgba(10, 20, 10, 0.4) 60%,
                transparent 100%
              )
            `,
          }}
        />
      </div>

      {/* Ethereal tendrils on edges */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Left tendrils */}
        <div className="absolute left-0 top-1/4 w-[200px] h-[400px] tendril-float-1">
          <svg viewBox="0 0 200 400" className="w-full h-full opacity-40">
            <defs>
              <linearGradient id="tendrilGradLeft" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgba(74, 140, 74, 0.3)" />
                <stop offset="100%" stopColor="rgba(40, 80, 40, 0.6)" />
              </linearGradient>
              <filter id="tendrilBlur">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>
            <path
              d="M0,50 Q80,100 40,200 Q0,300 60,350 Q20,400 0,400"
              fill="url(#tendrilGradLeft)"
              filter="url(#tendrilBlur)"
            />
            <path
              d="M0,100 Q100,150 50,250 Q10,320 80,380 Q30,400 0,400"
              fill="url(#tendrilGradLeft)"
              filter="url(#tendrilBlur)"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Right tendrils */}
        <div className="absolute right-0 top-1/3 w-[200px] h-[400px] tendril-float-2">
          <svg viewBox="0 0 200 400" className="w-full h-full opacity-40">
            <defs>
              <linearGradient id="tendrilGradRight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgba(74, 140, 74, 0.3)" />
                <stop offset="100%" stopColor="rgba(40, 80, 40, 0.6)" />
              </linearGradient>
            </defs>
            <path
              d="M200,80 Q120,130 160,230 Q200,330 140,380 Q180,400 200,400"
              fill="url(#tendrilGradRight)"
              filter="url(#tendrilBlur)"
            />
            <path
              d="M200,150 Q100,200 150,280 Q190,350 120,390 Q170,400 200,400"
              fill="url(#tendrilGradRight)"
              filter="url(#tendrilBlur)"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      {/* Glowing orbs floating on edges */}
      {isClient && (
        <div className="absolute inset-0 pointer-events-none z-15">
          <div className="absolute left-[5%] top-[30%] w-3 h-3 rounded-full orb-pulse" style={{ background: 'radial-gradient(circle, rgba(100, 200, 100, 0.8), transparent)', boxShadow: '0 0 20px rgba(74, 180, 74, 0.6), 0 0 40px rgba(74, 180, 74, 0.3)' }} />
          <div className="absolute left-[8%] top-[50%] w-2 h-2 rounded-full orb-pulse-delayed" style={{ background: 'radial-gradient(circle, rgba(120, 220, 120, 0.7), transparent)', boxShadow: '0 0 15px rgba(74, 180, 74, 0.5)' }} />
          <div className="absolute left-[3%] top-[65%] w-4 h-4 rounded-full orb-pulse" style={{ background: 'radial-gradient(circle, rgba(80, 180, 80, 0.6), transparent)', boxShadow: '0 0 25px rgba(74, 180, 74, 0.4)' }} />

          <div className="absolute right-[5%] top-[25%] w-2 h-2 rounded-full orb-pulse-delayed" style={{ background: 'radial-gradient(circle, rgba(100, 200, 100, 0.7), transparent)', boxShadow: '0 0 18px rgba(74, 180, 74, 0.5)' }} />
          <div className="absolute right-[7%] top-[45%] w-3 h-3 rounded-full orb-pulse" style={{ background: 'radial-gradient(circle, rgba(110, 210, 110, 0.8), transparent)', boxShadow: '0 0 22px rgba(74, 180, 74, 0.6)' }} />
          <div className="absolute right-[4%] top-[70%] w-2 h-2 rounded-full orb-pulse-delayed" style={{ background: 'radial-gradient(circle, rgba(90, 190, 90, 0.6), transparent)', boxShadow: '0 0 16px rgba(74, 180, 74, 0.4)' }} />
        </div>
      )}

      {/* Corner shadows for extra depth */}
      <div className="absolute inset-0 pointer-events-none z-25">
        <div
          className="absolute top-0 left-0 w-[40%] h-[40%]"
          style={{
            background: 'radial-gradient(ellipse at top left, rgba(0, 0, 0, 0.6) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute top-0 right-0 w-[40%] h-[40%]"
          style={{
            background: 'radial-gradient(ellipse at top right, rgba(0, 0, 0, 0.6) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Atmospheric energy streams from edges */}
      <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
        {/* Left energy stream */}
        <div
          className="absolute left-0 top-[20%] w-[40%] h-[300px] energy-stream-left"
          style={{
            background: `
              linear-gradient(to right,
                rgba(50, 120, 50, 0.15) 0%,
                rgba(60, 140, 60, 0.08) 30%,
                transparent 100%
              )
            `,
            filter: 'blur(30px)',
            transform: 'skewY(-5deg)',
          }}
        />
        <div
          className="absolute left-0 top-[50%] w-[35%] h-[200px] energy-stream-left-2"
          style={{
            background: `
              linear-gradient(to right,
                rgba(40, 100, 40, 0.12) 0%,
                rgba(50, 120, 50, 0.06) 40%,
                transparent 100%
              )
            `,
            filter: 'blur(25px)',
            transform: 'skewY(8deg)',
          }}
        />

        {/* Right energy stream */}
        <div
          className="absolute right-0 top-[15%] w-[40%] h-[250px] energy-stream-right"
          style={{
            background: `
              linear-gradient(to left,
                rgba(50, 120, 50, 0.15) 0%,
                rgba(60, 140, 60, 0.08) 30%,
                transparent 100%
              )
            `,
            filter: 'blur(30px)',
            transform: 'skewY(5deg)',
          }}
        />
        <div
          className="absolute right-0 top-[55%] w-[30%] h-[180px] energy-stream-right-2"
          style={{
            background: `
              linear-gradient(to left,
                rgba(40, 100, 40, 0.1) 0%,
                rgba(50, 120, 50, 0.05) 50%,
                transparent 100%
              )
            `,
            filter: 'blur(20px)',
            transform: 'skewY(-6deg)',
          }}
        />
      </div>

      {/* Title */}
      <div className="absolute inset-0 flex items-end justify-center pb-16 z-30 md:pb-24">
        <div className="text-center px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl font-medium italic text-white md:text-5xl lg:text-7xl drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
            Conheça o{" "}
            <span className="text-shimmer">Observador</span>
          </h2>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-moss-400/60 md:mt-4 md:text-sm md:tracking-[0.3em]">
            Scroll para descobrir
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .text-shimmer {
          background: linear-gradient(90deg, #5a9a5a, #7dca7d, #5a9a5a);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(var(--float-y, -40px)) translateX(var(--float-x, 10px));
            opacity: 0.6;
          }
        }

        .particle-float {
          animation: particleFloat ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .animate-pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }

        @keyframes eyePulse {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.9; transform: translateX(-50%) scale(1.2); }
        }

        .eye-pulse {
          animation: eyePulse 3s ease-in-out infinite;
        }

        @keyframes monsterBreathing {
          0%, 100% { transform: scale(1.15); }
          50% { transform: scale(1.18); }
        }

        .monster-breathing {
          animation: monsterBreathing 5s ease-in-out infinite;
        }

        @keyframes fogDrift1 {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-2%) translateY(-1%); }
        }

        @keyframes fogDrift2 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3%); }
        }

        @keyframes fogDrift3 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(2%); }
        }

        .fog-layer-1 { animation: fogDrift1 12s ease-in-out infinite; }
        .fog-layer-2 { animation: fogDrift2 10s ease-in-out infinite; }
        .fog-layer-3 { animation: fogDrift3 15s ease-in-out infinite; }

        .scan-lines {
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px);
        }

        @keyframes mistDriftLeft {
          0%, 100% { transform: translateX(0) scaleX(1); opacity: 1; }
          50% { transform: translateX(10px) scaleX(1.05); opacity: 0.9; }
        }

        @keyframes mistDriftRight {
          0%, 100% { transform: translateX(0) scaleX(1); opacity: 1; }
          50% { transform: translateX(-10px) scaleX(1.05); opacity: 0.9; }
        }

        .mist-drift-left { animation: mistDriftLeft 8s ease-in-out infinite; }
        .mist-drift-right { animation: mistDriftRight 8s ease-in-out infinite; }

        @keyframes tendrilFloat1 {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          25% { transform: translateY(-15px) rotate(2deg); opacity: 0.5; }
          50% { transform: translateY(-5px) rotate(-1deg); opacity: 0.35; }
          75% { transform: translateY(-20px) rotate(1deg); opacity: 0.45; }
        }

        @keyframes tendrilFloat2 {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          25% { transform: translateY(-10px) rotate(-2deg); opacity: 0.45; }
          50% { transform: translateY(-25px) rotate(1deg); opacity: 0.35; }
          75% { transform: translateY(-8px) rotate(-1deg); opacity: 0.5; }
        }

        .tendril-float-1 { animation: tendrilFloat1 12s ease-in-out infinite; }
        .tendril-float-2 { animation: tendrilFloat2 10s ease-in-out infinite; animation-delay: -3s; }

        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 1; }
        }

        @keyframes orbPulseDelayed {
          0%, 100% { transform: scale(1.2); opacity: 0.5; }
          50% { transform: scale(0.8); opacity: 0.9; }
        }

        .orb-pulse { animation: orbPulse 4s ease-in-out infinite; }
        .orb-pulse-delayed { animation: orbPulseDelayed 5s ease-in-out infinite; animation-delay: -2s; }

        @keyframes energyStreamLeft {
          0%, 100% { transform: skewY(-5deg) translateX(-10px); opacity: 0.8; }
          50% { transform: skewY(-3deg) translateX(20px); opacity: 1; }
        }

        @keyframes energyStreamLeft2 {
          0%, 100% { transform: skewY(8deg) translateX(0); opacity: 0.7; }
          50% { transform: skewY(6deg) translateX(15px); opacity: 0.9; }
        }

        @keyframes energyStreamRight {
          0%, 100% { transform: skewY(5deg) translateX(10px); opacity: 0.8; }
          50% { transform: skewY(3deg) translateX(-20px); opacity: 1; }
        }

        @keyframes energyStreamRight2 {
          0%, 100% { transform: skewY(-6deg) translateX(0); opacity: 0.7; }
          50% { transform: skewY(-4deg) translateX(-15px); opacity: 0.9; }
        }

        .energy-stream-left { animation: energyStreamLeft 10s ease-in-out infinite; }
        .energy-stream-left-2 { animation: energyStreamLeft2 8s ease-in-out infinite; animation-delay: -4s; }
        .energy-stream-right { animation: energyStreamRight 9s ease-in-out infinite; animation-delay: -2s; }
        .energy-stream-right-2 { animation: energyStreamRight2 11s ease-in-out infinite; animation-delay: -5s; }
      `}</style>
    </section>
  );
}
