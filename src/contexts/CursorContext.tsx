"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type CursorMode = "normal" | "hidden" | "possessed";

interface CursorContextType {
  mode: CursorMode;
  setMode: (mode: CursorMode) => void;
}

const CursorContext = createContext<CursorContextType | null>(null);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<CursorMode>("normal");

  return (
    <CursorContext.Provider value={{ mode, setMode }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
}
