"use client";

import { ReactNode } from "react";
import { CursorProvider } from "@/contexts/CursorContext";

export default function Providers({ children }: { children: ReactNode }) {
  return <CursorProvider>{children}</CursorProvider>;
}
