"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function RiotAuthButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRiotLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("riot", { callbackUrl: "/" });
    } catch (error) {
      console.error("Riot login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRiotLogin}
      disabled={isLoading}
      className="
        group relative flex w-full items-center justify-center gap-3 rounded-lg
        border border-[#D13639]/30 bg-[#D13639]/5 px-6 py-3.5
        text-sm font-medium text-[#D13639]/90 transition-all duration-200
        hover:border-[#D13639]/50 hover:bg-[#D13639]/10 hover:text-[#D13639]
        active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-50
      "
    >
      {/* Riot Games Logo */}
      <svg
        className="h-5 w-5 transition-transform group-hover:scale-110"
        viewBox="0 0 512 512"
        fill="currentColor"
      >
        <path d="M78.4 178.2L64 448l117.6-21.9 7.6-104.7 63.3-8.4-2.7-40.5-63.1 4 4.6-64.4 82.6-7.4-2.9-41.3-84.4 4.5 3.5-48.3L313 112l-2.3-32.5-152.2 9.3-80.1 89.4zm131.1 189.3l-5.3 73.6 130 24.2V339.7l-124.7 27.8zm145.5-183.2l-9.9 164.8 64.2-14.3 26.1-167.2-80.4 16.7zm93.5-19.4l-24.3 155.6 60.9-13.5 28.8-146.5-65.4 4.4z" />
      </svg>

      <span>
        {isLoading ? "Conectando..." : "Continuar com Riot Games"}
      </span>

      {isLoading && (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
    </button>
  );
}
