"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";

const menuItems = [
  { label: "Serviços", href: "#servicos", description: "O que oferecemos" },
  { label: "Diferenciais", href: "#diferenciais", description: "Por que somos únicos" },
  { label: "Login", href: "/auth", description: "Acesse sua conta" },
];

export default function Navbar() {
  const [time, setTime] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHoveringTime, setIsHoveringTime] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [glitchText, setGlitchText] = useState("Tá na hora do League");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lock body scroll when fullscreen menu is open on mobile
  useEffect(() => {
    if (menuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, isMobile]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(`BRT ${formatted}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menu on escape or click outside (desktop)
  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!isMobile) {
        const target = e.target as HTMLElement;
        if (!target.closest("[data-menu]")) {
          setMenuOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen, isMobile]);

  // Glitch effect
  useEffect(() => {
    if (!isHoveringTime) return;
    const originalText = "Tá na hora do League";
    const glitchChars = "!@#$%¨&*()_+-=[]{}|;:,.<>?/\\~`0123456789";
    const intervalId = setInterval(() => {
      setGlitchText(
        originalText.split("").map((char) =>
          char === " " ? " " : Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
        ).join("")
      );
    }, 80);
    const timeout = setTimeout(() => {
      clearInterval(intervalId);
      setGlitchText(originalText);
    }, 600);
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeout);
    };
  }, [isHoveringTime]);

  const handleMenuItemClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }, isMobile ? 300 : 100);
    }
  };

  return (
    <>
      <motion.header
        className="relative z-[60]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between px-4 py-4 md:px-8 md:py-5 lg:px-12">
          {/* Left side - Logo + Menu */}
          <div className="relative" data-menu>
            <div className="relative z-[70] flex items-center gap-3 rounded-md border border-moss-700/30 bg-moss-950/95 px-4 py-3 shadow-[0_0_30px_rgba(74,124,74,0.15)] backdrop-blur-md md:gap-5 md:px-6 md:py-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-1">
                <span className="font-[family-name:var(--font-display)] text-base font-bold tracking-tight text-white md:text-xl">
                  OBSERVER
                </span>
                <span className="font-[family-name:var(--font-display)] text-base font-bold text-moss-500 md:text-xl">
                  .GG
                </span>
              </Link>

              <div className="h-5 w-px bg-moss-700/50" />

              {/* Menu button */}
              <motion.button
                onClick={() => setMenuOpen(!menuOpen)}
                onMouseEnter={() => setIsHoveringMenu(true)}
                onMouseLeave={() => setIsHoveringMenu(false)}
                className="group flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="relative flex h-6 w-6 items-center justify-center"
                  animate={{ rotate: menuOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.span
                    className="absolute h-[2px] rounded-full"
                    animate={{
                      width: isHoveringMenu && !menuOpen ? 18 : 14,
                      backgroundColor: isHoveringMenu ? "#7cb87c" : "#ffffff",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="absolute w-[2px] rounded-full"
                    animate={{
                      height: isHoveringMenu && !menuOpen ? 18 : 14,
                      backgroundColor: isHoveringMenu ? "#7cb87c" : "#ffffff",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
                <motion.span
                  className="text-sm font-medium uppercase tracking-widest hidden md:block"
                  animate={{
                    color: isHoveringMenu ? "#7cb87c" : "#ffffff",
                    x: isHoveringMenu ? 2 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Menu
                </motion.span>
              </motion.button>
            </div>

            {/* Desktop Dropdown Menu */}
            <AnimatePresence>
              {menuOpen && !isMobile && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-0 top-full mt-2 min-w-[220px] overflow-hidden rounded-lg border border-moss-700/30 bg-moss-950/98 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md z-[80]"
                >
                  <div className="py-2">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {item.href.startsWith("#") ? (
                          <button
                            onClick={() => handleMenuItemClick(item.href)}
                            className="group flex w-full items-center gap-3 px-5 py-3 text-left transition-all hover:bg-moss-900/50 hover:pl-6"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-moss-600 transition-all group-hover:bg-moss-400 group-hover:scale-150" />
                            <span className="text-sm font-medium text-moss-200 transition-colors group-hover:text-white">
                              {item.label}
                            </span>
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="group flex w-full items-center gap-3 px-5 py-3 transition-all hover:bg-moss-900/50 hover:pl-6"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-moss-600 transition-all group-hover:bg-moss-400 group-hover:scale-150" />
                            <span className="text-sm font-medium text-moss-200 transition-colors group-hover:text-white">
                              {item.label}
                            </span>
                            {item.label === "Login" && (
                              <svg className="ml-auto h-4 w-4 text-moss-600 transition-all group-hover:text-moss-400 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            )}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-t border-moss-800/50 px-5 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-moss-600">Descubra a verdade</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Center - Time (desktop only) */}
          <div
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 cursor-pointer md:block"
            onMouseEnter={() => setIsHoveringTime(true)}
            onMouseLeave={() => setIsHoveringTime(false)}
          >
            <span className={`font-mono text-sm tracking-widest transition-all duration-300 ${isHoveringTime ? "text-moss-400" : "text-white"}`}>
              {isHoveringTime ? glitchText : time}
            </span>
          </div>

          {/* Right side - CTA (desktop only) */}
          <Link
            href="/auth"
            className="group relative z-[60] hidden items-center gap-4 overflow-hidden rounded-md border border-moss-700/30 bg-moss-950/95 px-6 py-4 shadow-[0_0_30px_rgba(74,124,74,0.15)] backdrop-blur-md transition-all hover:border-moss-600/50 hover:bg-moss-900/90 hover:shadow-[0_0_40px_rgba(74,124,74,0.25)] md:flex"
          >
            <div className="relative h-5 overflow-hidden">
              <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
                <span className="flex h-5 items-center text-sm font-medium uppercase tracking-widest text-white">Começar</span>
                <span className="flex h-5 items-center text-sm font-medium uppercase tracking-widest text-moss-400">Começar</span>
              </div>
            </div>
            <div className="relative h-4 w-4 overflow-hidden">
              <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <svg className="h-4 w-4 text-moss-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </motion.header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#040804]"
          >
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(74, 124, 74, 0.15) 0%, transparent 60%)",
                  filter: "blur(80px)",
                  left: "-20%",
                  top: "-20%",
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-[400px] h-[400px] rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(74, 124, 74, 0.1) 0%, transparent 60%)",
                  filter: "blur(60px)",
                  right: "-10%",
                  bottom: "-10%",
                }}
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(rgba(124, 184, 124, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 184, 124, 1) 1px, transparent 1px)`,
                  backgroundSize: "60px 60px",
                }}
              />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-6 py-6">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-1">
                <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-white">OBSERVER</span>
                <span className="font-[family-name:var(--font-display)] text-xl font-bold text-moss-500">.GG</span>
              </Link>
              <motion.button
                onClick={() => setMenuOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-moss-700/30 bg-moss-950/50 text-white"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Menu items */}
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
              <nav className="flex flex-col items-center gap-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    {item.href.startsWith("#") ? (
                      <button onClick={() => handleMenuItemClick(item.href)} className="group flex flex-col items-center py-4">
                        <span className="text-3xl font-semibold text-white transition-colors group-hover:text-moss-400">{item.label}</span>
                        <span className="mt-1 text-sm text-moss-600">{item.description}</span>
                      </button>
                    ) : (
                      <Link href={item.href} onClick={() => setMenuOpen(false)} className="group flex flex-col items-center py-4">
                        <span className="text-3xl font-semibold text-white transition-colors group-hover:text-moss-400">{item.label}</span>
                        <span className="mt-1 text-sm text-moss-600">{item.description}</span>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 px-6 py-8 text-center"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-moss-700">A verdade te espera</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
