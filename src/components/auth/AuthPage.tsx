"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AuthToggle from "./AuthToggle";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import RiotAuthButton from "./RiotAuthButton";

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#040804] via-[#050a05] to-[#030603]" />

      {/* Animated gradient blobs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(74, 124, 74, 0.15) 0%, transparent 60%)",
          filter: "blur(80px)",
          left: "-20%",
          top: "-30%",
        }}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(100, 160, 100, 0.12) 0%, transparent 60%)",
          filter: "blur(60px)",
          right: "-15%",
          bottom: "-20%",
        }}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, -60, -120, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(60, 100, 60, 0.1) 0%, transparent 50%)",
          filter: "blur(50px)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 184, 124, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 184, 124, 1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] opacity-20"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(124, 184, 124, 0.5), transparent)",
        }}
        animate={{
          top: ["-10%", "110%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating particles - small */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={`sm-${i}`}
          className="absolute rounded-full bg-moss-500"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            left: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          animate={{
            y: ["100vh", "-10vh"],
            opacity: [0, 0.5, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "linear",
          }}
        />
      ))}

      {/* Floating particles - medium */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`md-${i}`}
          className="absolute rounded-full bg-moss-400"
          style={{
            width: Math.random() * 3 + 2,
            height: Math.random() * 3 + 2,
            left: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          animate={{
            y: ["100vh", "-10vh"],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 12 + 10,
            repeat: Infinity,
            delay: Math.random() * 12,
            ease: "linear",
          }}
        />
      ))}

      {/* Floating particles - large glowing */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`lg-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 3,
            height: Math.random() * 4 + 3,
            left: `${Math.random() * 100}%`,
            opacity: 0,
            background: "radial-gradient(circle, rgba(124, 184, 124, 0.8) 0%, rgba(74, 124, 74, 0.4) 100%)",
            boxShadow: "0 0 6px rgba(124, 184, 124, 0.5)",
          }}
          animate={{
            y: ["100vh", "-10vh"],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 15 + 12,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: "linear",
          }}
        />
      ))}

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(3, 6, 3, 0.6) 100%)",
        }}
      />
    </div>
  );
}

function ObserverEye() {
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;

      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 50, 8);

      setPupilOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    // Random blink
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000);

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(blinkInterval);
    };
  }, []);

  return (
    <motion.div
      ref={eyeRef}
      className="absolute top-8 right-8 hidden lg:block"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="relative w-20 h-12">
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-[50%]"
          style={{
            background: "radial-gradient(ellipse, rgba(74, 180, 74, 0.4) 0%, transparent 70%)",
            filter: "blur(15px)",
            transform: "scale(1.8)",
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1.8, 2, 1.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Eye shape */}
        <motion.div
          className="relative w-full h-full rounded-[50%] overflow-hidden"
          style={{
            background: "radial-gradient(ellipse, #0d1a0d 0%, #050a05 100%)",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.8), 0 0 30px rgba(74, 140, 74, 0.3)",
            border: "1px solid rgba(74, 124, 74, 0.3)",
          }}
          animate={{
            scaleY: isBlinking ? 0.1 : 1,
          }}
          transition={{ duration: 0.1 }}
        >
          {/* Iris */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 28,
              height: 28,
              left: "50%",
              top: "50%",
              marginLeft: -14 + pupilOffset.x,
              marginTop: -14 + pupilOffset.y,
              background: "radial-gradient(circle, #4a8a4a 0%, #2d5a2d 40%, #1a3a1a 80%)",
              boxShadow: "0 0 20px rgba(74, 180, 74, 0.5)",
            }}
          >
            {/* Pupil */}
            <div
              className="absolute rounded-full"
              style={{
                width: 12,
                height: 12,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                background: "#000",
                boxShadow: "0 0 10px rgba(74, 255, 74, 0.8)",
              }}
            >
              <div className="absolute w-2 h-2 rounded-full bg-white/60" style={{ top: 1, right: 1 }} />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.p
        className="mt-3 text-[10px] uppercase tracking-[0.2em] text-moss-500 text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Observando
      </motion.p>
    </motion.div>
  );
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen w-full bg-[#040804]" />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatedBackground />

      {/* Observer Eye */}
      <ObserverEye />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute top-6 left-6"
        >
          <Link
            href="/"
            className="group flex items-center gap-3 text-moss-500 transition-colors hover:text-moss-300"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-moss-700/40 bg-moss-950/60 backdrop-blur-sm transition-all group-hover:border-moss-600/50 group-hover:bg-moss-900/60">
              <svg
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-sm font-medium tracking-wide hidden sm:block">Voltar</span>
          </Link>
        </motion.div>

        {/* Auth container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[420px]"
        >
          {/* Logo */}
          <div className="mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white">
                OBSERVER
              </span>
              <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-moss-500">
                .GG
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-moss-700/30 bg-moss-950/80 p-8 backdrop-blur-md shadow-2xl shadow-black/50">
            {/* Header text */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                {activeTab === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
              </h1>
              <p className="mt-2 text-sm text-moss-400">
                {activeTab === "login"
                  ? "Entre para continuar evoluindo"
                  : "Comece sua jornada de melhoria"}
              </p>
            </div>

            {/* Toggle */}
            <div className="mb-8">
              <AuthToggle activeTab={activeTab} onToggle={setActiveTab} />
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              {activeTab === "login" ? (
                <LoginForm key="login" />
              ) : (
                <RegisterForm key="register" onSuccess={() => setActiveTab("login")} />
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-moss-700/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-moss-950/80 px-4 text-xs uppercase tracking-widest text-moss-600">
                  ou
                </span>
              </div>
            </div>

            {/* Riot OAuth */}
            <RiotAuthButton />
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-[11px] leading-relaxed text-moss-700 max-w-sm mx-auto">
            Observer.GG não é endossado pela Riot Games e não reflete as visões ou opiniões da Riot Games.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
