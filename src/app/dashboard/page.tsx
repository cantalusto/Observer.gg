"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ============================================================================
// ANIMATED BACKGROUND - Cinematic dark atmosphere
// ============================================================================
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base - Deep black with subtle green tint */}
      <div className="absolute inset-0 bg-[#050805]" />

      {/* Layered gradient atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(20, 40, 20, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 70% 100%, rgba(15, 35, 15, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 20% 80%, rgba(10, 30, 10, 0.2) 0%, transparent 50%)
          `,
        }}
      />

      {/* Fog layers - slow moving mist */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 30% 20%, rgba(74, 124, 74, 0.04) 0%, transparent 50%)
          `,
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, 100, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 70% 60%, rgba(60, 100, 60, 0.03) 0%, transparent 40%)
          `,
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 30, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Central subtle glow - where the eye will be */}
      <motion.div
        className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px]"
        style={{
          background: "radial-gradient(ellipse, rgba(74, 140, 74, 0.06) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Very subtle floating particles - like dust in light */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute rounded-full bg-moss-500/30"
          style={{
            width: 2,
            height: 2,
            left: `${10 + Math.random() * 80}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle noise texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette - darker edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.4) 100%)
          `,
        }}
      />

      {/* Top and bottom fade for depth */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background: "linear-gradient(to bottom, rgba(5, 8, 5, 0.8) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background: "linear-gradient(to top, rgba(5, 8, 5, 0.6) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

// ============================================================================
// MASSIVE OBSERVER EYE - Central focal point
// ============================================================================
function MassiveObserverEye({ isSearching, searchValue }: { isSearching: boolean; searchValue: string }) {
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const eyeRef = useRef<HTMLDivElement>(null);

  const intensity = searchValue.length > 0 ? Math.min(searchValue.length / 10, 1) : 0;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current || isSearching) return;

      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 30, 15);

      setPupilOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7 && !isSearching) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 120);
      }
    }, 4000);

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(blinkInterval);
    };
  }, [isSearching]);

  return (
    <motion.div
      ref={eyeRef}
      className="relative"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
    >
      {/* Outer ethereal glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 280,
          height: 180,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse, rgba(74, 255, 74, 0.15) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: isSearching ? [1, 1.3, 1] : [1, 1.15, 1],
          opacity: isSearching ? [0.4, 0.8, 0.4] : [0.2 + intensity * 0.3, 0.4 + intensity * 0.3, 0.2 + intensity * 0.3],
        }}
        transition={{
          duration: isSearching ? 1 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary glow ring */}
      <motion.div
        className="absolute rounded-[50%]"
        style={{
          width: 200,
          height: 120,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid rgba(74, 180, 74, 0.1)",
          boxShadow: "0 0 30px rgba(74, 180, 74, 0.1), inset 0 0 30px rgba(74, 180, 74, 0.05)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main eye */}
      <div className="relative w-[180px] h-[100px]">
        {/* Eye shape */}
        <motion.div
          className="relative w-full h-full overflow-hidden"
          style={{
            borderRadius: "50%",
            background: "radial-gradient(ellipse, #0a150a 0%, #040804 100%)",
            boxShadow: `
              inset 0 0 40px rgba(0,0,0,0.9),
              0 0 60px rgba(74, 180, 74, ${0.2 + intensity * 0.3}),
              0 0 100px rgba(74, 180, 74, ${0.1 + intensity * 0.2})
            `,
            border: "1px solid rgba(74, 124, 74, 0.2)",
          }}
          animate={{
            scaleY: isBlinking ? 0.05 : 1,
          }}
          transition={{ duration: 0.1 }}
        >
          {/* Iris */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 60,
              height: 60,
              left: "50%",
              top: "50%",
              marginLeft: -30 + pupilOffset.x,
              marginTop: -30 + pupilOffset.y,
              background: `radial-gradient(circle,
                rgba(100, 200, 100, ${0.9 + intensity * 0.1}) 0%,
                rgba(74, 140, 74, 1) 30%,
                rgba(40, 80, 40, 1) 60%,
                rgba(20, 40, 20, 1) 100%)`,
              boxShadow: `
                0 0 30px rgba(74, 255, 74, ${0.4 + intensity * 0.4}),
                inset 0 0 20px rgba(0, 0, 0, 0.5)
              `,
            }}
            animate={isSearching ? {
              scale: [1, 0.9, 1.1, 1],
            } : {}}
            transition={{ duration: 0.5, repeat: isSearching ? Infinity : 0 }}
          >
            {/* Iris patterns */}
            <div
              className="absolute inset-2 rounded-full opacity-30"
              style={{
                background: "repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(100, 255, 100, 0.1) 10deg 20deg)",
              }}
            />

            {/* Pupil */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: isSearching ? 20 : 24 - intensity * 8,
                height: isSearching ? 20 : 24 - intensity * 8,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                background: "#000",
                boxShadow: `0 0 20px rgba(74, 255, 74, ${0.6 + intensity * 0.4})`,
              }}
              animate={isSearching ? {
                scale: [1, 0.8, 1.2, 1],
              } : {}}
              transition={{ duration: 0.3, repeat: isSearching ? Infinity : 0 }}
            >
              {/* Highlight */}
              <div
                className="absolute w-2 h-2 rounded-full bg-white/70"
                style={{ top: 3, right: 3 }}
              />
              <div
                className="absolute w-1 h-1 rounded-full bg-white/40"
                style={{ bottom: 4, left: 4 }}
              />
            </motion.div>
          </motion.div>

          {/* Light reflection arc */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-8 opacity-10"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
              borderRadius: "50%",
            }}
          />
        </motion.div>
      </div>

      {/* Status text */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-moss-500 font-medium">
          {isSearching ? "Buscando..." : searchValue ? "Analisando" : "Aguardando"}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// SEARCH INPUT - Dramatic central search
// ============================================================================
function SearchInput({
  value,
  onChange,
  onSubmit,
  isSearching,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isSearching: boolean;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      onSubmit();
    }
  };

  return (
    <motion.div
      className="relative w-full max-w-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glow effect behind input */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0"
        style={{
          background: "linear-gradient(135deg, rgba(74, 180, 74, 0.3), rgba(74, 124, 74, 0.1))",
          filter: "blur(20px)",
        }}
        animate={{
          opacity: isFocused ? 0.6 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Input container */}
      <div
        className={`
          relative flex items-center gap-4 px-6 py-5
          rounded-2xl border backdrop-blur-md
          transition-all duration-300
          ${isFocused
            ? "border-moss-500/50 bg-moss-950/90 shadow-lg shadow-moss-900/30"
            : "border-moss-700/30 bg-moss-950/60"
          }
        `}
      >
        {/* Search icon */}
        <motion.div
          animate={{
            scale: isFocused ? 1.1 : 1,
            rotate: isSearching ? 360 : 0,
          }}
          transition={{
            scale: { duration: 0.2 },
            rotate: { duration: 1, repeat: isSearching ? Infinity : 0, ease: "linear" }
          }}
        >
          <svg
            className={`w-6 h-6 transition-colors duration-300 ${isFocused ? "text-moss-400" : "text-moss-600"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {isSearching ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8v8H4z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            )}
          </svg>
        </motion.div>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          disabled={isSearching}
          placeholder="Digite o nome do invocador..."
          className="
            flex-1 bg-transparent text-lg text-white
            placeholder:text-moss-600
            focus:outline-none
            disabled:opacity-50
            font-[family-name:var(--font-sans)]
          "
          autoComplete="off"
          spellCheck={false}
        />

        {/* Tag hint */}
        <AnimatePresence>
          {!isFocused && !value && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="hidden sm:flex items-center gap-2 text-moss-600"
            >
              <span className="text-sm">Nome</span>
              <span className="px-2 py-1 rounded bg-moss-800/50 text-moss-500 text-xs font-mono">#TAG</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <AnimatePresence>
          {value.trim() && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onSubmit}
              disabled={isSearching}
              className="
                flex items-center justify-center
                w-12 h-12 -mr-2
                rounded-xl
                bg-gradient-to-br from-moss-500 to-moss-600
                text-white
                transition-all duration-200
                hover:from-moss-400 hover:to-moss-500
                hover:shadow-lg hover:shadow-moss-500/25
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-95
              "
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Error or Helper text */}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            className="mt-3 text-center text-sm text-red-400"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {error}
          </motion.p>
        ) : (
          <motion.p
            key="helper"
            className="mt-3 text-center text-xs text-moss-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Exemplo: <span className="text-moss-500 font-mono">Faker#KR1</span> ou <span className="text-moss-500 font-mono">Doublelift#NA1</span>
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// RECENT SEARCHES - History display with profile icons
// ============================================================================
const DDRAGON_VERSION = "15.2.1"; // Update periodically

function RecentSearches({ onSelect }: { onSelect: (name: string) => void }) {
  // Placeholder data - would come from localStorage or API
  // profileIconId comes from Riot API when you search a summoner
  const recentSearches = [
    { name: "Faker", tag: "KR1", region: "KR", profileIconId: 6 },
    { name: "Caps", tag: "EUW", region: "EUW", profileIconId: 5367 },
    { name: "Showmaker", tag: "KR1", region: "KR", profileIconId: 4654 },
  ];

  if (recentSearches.length === 0) return null;

  return (
    <motion.div
      className="w-full max-w-xl mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <h3 className="text-xs uppercase tracking-[0.2em] text-moss-600 mb-4 text-center">
        Buscas recentes
      </h3>

      <div className="flex flex-wrap justify-center gap-3">
        {recentSearches.map((search, i) => (
          <motion.button
            key={`${search.name}-${search.tag}`}
            onClick={() => onSelect(`${search.name}#${search.tag}`)}
            className="
              group flex items-center gap-3 px-4 py-2.5
              rounded-xl border border-moss-800/50 bg-moss-950/40
              hover:border-moss-600/50 hover:bg-moss-900/40
              transition-all duration-200
            "
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 + i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Profile icon from Data Dragon */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-moss-700/50 group-hover:ring-moss-500/50 transition-all">
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/profileicon/${search.profileIconId}.png`}
                alt={search.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-left">
              <p className="text-sm text-white group-hover:text-moss-200 transition-colors">
                {search.name}
                <span className="text-moss-500">#{search.tag}</span>
              </p>
            </div>

            <span className="text-[10px] uppercase tracking-wider text-moss-600 ml-1 px-1.5 py-0.5 rounded bg-moss-900/50">
              {search.region}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// LINK ACCOUNT CTA - Subtle prompt with Riot icon
// ============================================================================
function LinkAccountCTA() {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.6 }}
    >
      <button className="
        group flex items-center gap-3 px-5 py-3
        rounded-full border border-moss-800/40 bg-moss-950/60 backdrop-blur-md
        hover:border-moss-600/50 hover:bg-moss-900/60
        transition-all duration-300
      ">
        {/* Riot Games icon */}
        <div className="w-8 h-8 flex items-center justify-center">
          <img
            src="/icons8-jogos-de-motim-48.png"
            alt="Riot Games"
            className="w-7 h-7 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </div>

        <div className="text-left">
          <p className="text-sm text-white group-hover:text-moss-200 transition-colors">
            Vincular conta Riot
          </p>
          <p className="text-[10px] text-moss-600">
            Acesse recursos exclusivos
          </p>
        </div>

        <svg
          className="w-4 h-4 text-moss-600 group-hover:text-moss-400 group-hover:translate-x-0.5 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </motion.div>
  );
}

// ============================================================================
// HEADER - Navigation
// ============================================================================
function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-white group-hover:text-moss-200 transition-colors">
            OBSERVER
          </span>
          <span className="font-[family-name:var(--font-display)] text-xl font-bold text-moss-500">
            .GG
          </span>
        </Link>

        {/* User menu placeholder */}
        <button className="
          flex items-center gap-3 px-4 py-2
          rounded-full border border-moss-800/40 bg-moss-950/40 backdrop-blur-sm
          hover:border-moss-700/50 hover:bg-moss-900/40
          transition-all duration-200
        ">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-moss-600 to-moss-700 flex items-center justify-center">
            <svg className="w-4 h-4 text-moss-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-sm text-moss-300 hidden sm:block">Minha conta</span>
        </button>
      </div>
    </motion.header>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function DashboardPage() {
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchValue.trim() || isSearching) return;

    // Parse gameName#tagLine
    const parts = searchValue.split("#");
    if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
      setSearchError("Use o formato: Nome#TAG");
      return;
    }

    const [gameName, tagLine] = parts;
    setSearchError("");
    setIsSearching(true);

    try {
      const response = await fetch(
        `/api/summoner?gameName=${encodeURIComponent(gameName.trim())}&tagLine=${encodeURIComponent(tagLine.trim())}`
      );

      const data = await response.json();

      if (!response.ok) {
        setSearchError(data.error || "Erro ao buscar invocador");
        return;
      }

      // Success - navigate to profile
      router.push(`/profile/${encodeURIComponent(gameName.trim())}/${encodeURIComponent(tagLine.trim())}`);

    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Erro de conexão. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  }, [searchValue, isSearching, router]);

  const handleSelectRecent = useCallback((name: string) => {
    setSearchValue(name);
    setSearchError("");
  }, []);

  if (!mounted) {
    return <div className="min-h-screen w-full bg-[#030503]" />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatedBackground />
      <Header />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-32">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-[family-name:var(--font-display)] font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white">Quem você quer </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-moss-400 to-moss-500">
              observar
            </span>
            <span className="text-white">?</span>
          </motion.h1>

          <motion.p
            className="mt-4 text-moss-400 text-lg max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Busque qualquer invocador e descubra insights profundos sobre seu gameplay
          </motion.p>
        </motion.div>

        {/* Observer Eye */}
        <div className="mb-16">
          <MassiveObserverEye isSearching={isSearching} searchValue={searchValue} />
        </div>

        {/* Search Input */}
        <SearchInput
          value={searchValue}
          onChange={(v) => {
            setSearchValue(v);
            if (searchError) setSearchError("");
          }}
          onSubmit={handleSearch}
          isSearching={isSearching}
          error={searchError}
        />

        {/* Recent Searches */}
        <RecentSearches onSelect={handleSelectRecent} />
      </div>

      {/* Link Account CTA */}
      <LinkAccountCTA />
    </div>
  );
}
