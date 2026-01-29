"use client";

import { motion } from "motion/react";

interface AuthToggleProps {
  activeTab: "login" | "register";
  onToggle: (tab: "login" | "register") => void;
}

export default function AuthToggle({ activeTab, onToggle }: AuthToggleProps) {
  return (
    <div className="relative flex w-full rounded-lg bg-moss-900/40 p-1">
      {/* Sliding indicator */}
      <motion.div
        className="absolute inset-y-1 w-[calc(50%-4px)] rounded-md bg-moss-700/60"
        initial={false}
        animate={{
          x: activeTab === "login" ? 4 : "calc(100% + 4px)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
        }}
      />

      <button
        onClick={() => onToggle("login")}
        className={`
          relative z-10 flex-1 py-2.5 text-center text-sm font-medium transition-colors duration-200
          ${activeTab === "login" ? "text-white" : "text-moss-500 hover:text-moss-400"}
        `}
      >
        Entrar
      </button>

      <button
        onClick={() => onToggle("register")}
        className={`
          relative z-10 flex-1 py-2.5 text-center text-sm font-medium transition-colors duration-200
          ${activeTab === "register" ? "text-white" : "text-moss-500 hover:text-moss-400"}
        `}
      >
        Criar conta
      </button>
    </div>
  );
}
