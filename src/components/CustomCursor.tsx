"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    // Atualiza CSS custom properties - mais performático que manipular DOM
    const onMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--cursor-x", e.clientX + "px");
      document.documentElement.style.setProperty("--cursor-y", e.clientY + "px");
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      {/* Cursor via CSS puro - máxima performance */}
      <div className="custom-cursor" />
      <div className="custom-cursor-dot" />

      <style jsx global>{`
        :root {
          --cursor-x: -100px;
          --cursor-y: -100px;
        }

        * {
          cursor: none !important;
        }

        .custom-cursor {
          position: fixed;
          left: var(--cursor-x);
          top: var(--cursor-y);
          width: 36px;
          height: 36px;
          margin-left: -18px;
          margin-top: -18px;
          border: 2px solid rgba(74, 140, 74, 0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          box-shadow: 0 0 15px rgba(74, 180, 74, 0.2);
          transition: transform 0.1s ease-out, width 0.15s, height 0.15s, margin 0.15s, border-color 0.15s;
        }

        .custom-cursor-dot {
          position: fixed;
          left: var(--cursor-x);
          top: var(--cursor-y);
          width: 6px;
          height: 6px;
          margin-left: -3px;
          margin-top: -3px;
          background: rgba(200, 240, 200, 0.95);
          border-radius: 50%;
          pointer-events: none;
          z-index: 100000;
          box-shadow: 0 0 8px rgba(74, 180, 74, 0.6);
        }

        a:hover ~ .custom-cursor,
        button:hover ~ .custom-cursor,
        a .custom-cursor,
        button .custom-cursor {
          width: 50px;
          height: 50px;
          margin-left: -25px;
          margin-top: -25px;
          border-color: rgba(124, 184, 124, 0.8);
        }
      `}</style>
    </>
  );
}
