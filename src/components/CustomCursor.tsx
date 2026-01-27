"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useCursor } from "@/contexts/CursorContext";

export default function CustomCursor() {
  const { mode, setIsClicking: setGlobalClicking } = useCursor();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });

  // Use refs for positions to avoid re-renders
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  // Glitch effect for possessed mode
  useEffect(() => {
    if (mode !== "possessed" && mode !== "cta") {
      setGlitchOffset({ x: 0, y: 0 });
      return;
    }

    const intensity = mode === "cta" ? 8 : 20;
    const frequency = mode === "cta" ? 80 : 100;

    const glitchInterval = setInterval(() => {
      if (Math.random() > (mode === "cta" ? 0.5 : 0.7)) {
        setGlitchOffset({
          x: (Math.random() - 0.5) * intensity,
          y: (Math.random() - 0.5) * intensity,
        });
        setTimeout(() => setGlitchOffset({ x: 0, y: 0 }), 50);
      }
    }, frequency);

    return () => clearInterval(glitchInterval);
  }, [mode]);

  // Animation loop - always running
  const animate = useCallback(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;

    if (cursor && dot && isVisible) {
      const easingOuter = mode === "possessed" || mode === "cta" ? 0.12 : 0.08;
      const easingInner = mode === "possessed" || mode === "cta" ? 0.3 : 0.2;

      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * easingOuter;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * easingOuter;

      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * easingInner;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * easingInner;

      const gx = mode === "possessed" || mode === "cta" ? glitchOffset.x : 0;
      const gy = mode === "possessed" || mode === "cta" ? glitchOffset.y : 0;

      cursor.style.left = `${cursorPos.current.x + gx}px`;
      cursor.style.top = `${cursorPos.current.y + gy}px`;
      dot.style.left = `${dotPos.current.x}px`;
      dot.style.top = `${dotPos.current.y}px`;
    }

    rafId.current = requestAnimationFrame(animate);
  }, [mode, isVisible, glitchOffset]);

  useEffect(() => {
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [animate]);

  // Mouse tracking - always active
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Initialize cursor position on first move
      if (!isVisible) {
        cursorPos.current = { x: e.clientX, y: e.clientY };
        dotPos.current = { x: e.clientX, y: e.clientY };
        setIsVisible(true);
      }
    };

    const onMouseDown = () => {
      setIsClicking(true);
      setGlobalClicking(true);
    };
    const onMouseUp = () => {
      setIsClicking(false);
      setGlobalClicking(false);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursorHover === "true" ||
        target.classList.contains("cursor-hover") ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovering(isInteractive);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, [isVisible]);

  const isPossessed = mode === "possessed";
  const isCTA = mode === "cta";
  const shouldShow = mode !== "hidden" && isVisible;

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? "hovering" : ""} ${isClicking ? "clicking" : ""} ${isPossessed ? "possessed" : ""} ${isCTA ? "cta-mode" : ""}`}
        style={{ opacity: shouldShow ? 1 : 0 }}
      >
        {isPossessed ? (
          <>
            <div className="cursor-eye-outer" />
            <div className="cursor-eye-inner" />
            <div className="cursor-eye-pupil" />
            <div className="cursor-veins vein-1" />
            <div className="cursor-veins vein-2" />
            <div className="cursor-veins vein-3" />
          </>
        ) : isCTA ? (
          <>
            <div className="cursor-cta-ring" />
            <div className="cursor-cta-ring-2" />
            <div className="cursor-cta-pulse" />
          </>
        ) : (
          <>
            <div className="cursor-segment segment-1" />
            <div className="cursor-segment segment-2" />
            <div className="cursor-segment segment-3" />
            <div className="cursor-inner-glow" />
          </>
        )}
      </div>

      {/* Center dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isHovering ? "hovering" : ""} ${isClicking ? "clicking" : ""} ${isPossessed ? "possessed" : ""} ${isCTA ? "cta-mode" : ""}`}
        style={{ opacity: shouldShow ? 1 : 0 }}
      />

      <style jsx global>{`
        * {
          cursor: none !important;
        }

        /* ========== BASE ========== */
        .custom-cursor {
          position: fixed;
          width: 44px;
          height: 44px;
          pointer-events: none;
          z-index: 99998;
          transform: translate(-50%, -50%);
          transition: opacity 0.2s ease;
        }

        .custom-cursor-dot {
          position: fixed;
          width: 6px;
          height: 6px;
          background: rgba(200, 255, 200, 0.95);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          transform: translate(-50%, -50%);
          box-shadow:
            0 0 6px rgba(124, 255, 124, 0.8),
            0 0 12px rgba(124, 184, 124, 0.5),
            0 0 20px rgba(74, 140, 74, 0.3);
          transition: opacity 0.2s ease, width 0.2s ease, height 0.2s ease, background 0.2s ease;
        }

        /* ========== NORMAL MODE ========== */
        .cursor-segment {
          position: absolute;
          inset: 0;
          border: 2px solid transparent;
          border-radius: 50%;
          border-top-color: rgba(124, 184, 124, 0.7);
          animation: cursor-rotate 3s linear infinite;
        }

        .segment-1 {
          animation-duration: 3s;
          border-top-color: rgba(124, 184, 124, 0.8);
        }

        .segment-2 {
          animation-duration: 2s;
          animation-direction: reverse;
          border-top-color: rgba(100, 200, 100, 0.5);
          inset: 4px;
        }

        .segment-3 {
          animation-duration: 4s;
          border-top-color: rgba(74, 140, 74, 0.4);
          inset: -4px;
        }

        .cursor-inner-glow {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124, 184, 124, 0.1) 0%, transparent 70%);
          animation: cursor-pulse 2s ease-in-out infinite;
        }

        @keyframes cursor-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes cursor-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .custom-cursor.hovering {
          width: 56px;
          height: 56px;
          transition: width 0.2s ease, height 0.2s ease;
        }

        .custom-cursor.hovering .cursor-segment {
          animation-duration: 0.8s !important;
          border-top-color: rgba(150, 255, 150, 0.9);
        }

        .custom-cursor-dot.hovering {
          width: 10px;
          height: 10px;
          background: rgba(150, 255, 150, 1);
          box-shadow:
            0 0 10px rgba(150, 255, 150, 1),
            0 0 20px rgba(124, 255, 124, 0.8),
            0 0 30px rgba(100, 200, 100, 0.5);
        }

        .custom-cursor-dot.clicking {
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 1);
        }

        /* ========== POSSESSED MODE ========== */
        .custom-cursor.possessed {
          width: 50px;
          height: 50px;
        }

        .cursor-eye-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(100, 180, 100, 0.6);
          background: radial-gradient(ellipse at center,
            rgba(20, 40, 20, 0.9) 0%,
            rgba(10, 20, 10, 0.95) 60%,
            rgba(5, 10, 5, 1) 100%
          );
          animation: eye-dilate 2s ease-in-out infinite;
          box-shadow:
            inset 0 0 15px rgba(0, 0, 0, 0.8),
            0 0 20px rgba(74, 180, 74, 0.4),
            0 0 40px rgba(180, 60, 60, 0.2);
        }

        @keyframes eye-dilate {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .cursor-eye-inner {
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 40%,
            rgba(80, 180, 80, 0.9) 0%,
            rgba(50, 140, 50, 0.8) 30%,
            rgba(30, 80, 30, 0.9) 70%,
            rgba(20, 50, 20, 1) 100%
          );
          animation: iris-pulse 1.5s ease-in-out infinite;
          box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.6);
        }

        @keyframes iris-pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }

        .cursor-eye-pupil {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 14px;
          margin-left: -4px;
          margin-top: -7px;
          background: rgba(0, 0, 0, 0.95);
          border-radius: 50%;
          animation: pupil-contract 3s ease-in-out infinite;
          box-shadow:
            0 0 5px rgba(0, 0, 0, 1),
            0 0 15px rgba(100, 255, 100, 0.3);
        }

        @keyframes pupil-contract {
          0%, 100% { transform: scaleY(1); }
          30% { transform: scaleY(0.6); }
          60% { transform: scaleY(1.1); }
        }

        .cursor-veins {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          opacity: 0.5;
          animation: vein-pulse 2s ease-in-out infinite;
        }

        .vein-1 {
          background: linear-gradient(45deg, transparent 40%, rgba(180, 60, 60, 0.4) 50%, transparent 60%);
        }

        .vein-2 {
          background: linear-gradient(135deg, transparent 40%, rgba(160, 50, 50, 0.3) 50%, transparent 60%);
          animation-delay: 0.5s;
        }

        .vein-3 {
          background: linear-gradient(-45deg, transparent 35%, rgba(140, 40, 40, 0.35) 50%, transparent 65%);
          animation-delay: 1s;
        }

        @keyframes vein-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .custom-cursor-dot.possessed {
          width: 4px;
          height: 4px;
          background: rgba(100, 255, 100, 1);
          box-shadow:
            0 0 8px rgba(100, 255, 100, 0.9),
            0 0 15px rgba(60, 180, 60, 0.7),
            0 0 25px rgba(100, 255, 100, 0.4);
          animation: possessed-dot-pulse 0.5s ease-in-out infinite;
        }

        @keyframes possessed-dot-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .custom-cursor.possessed.hovering .cursor-eye-outer {
          border-color: rgba(200, 80, 80, 0.8);
          box-shadow:
            inset 0 0 15px rgba(0, 0, 0, 0.8),
            0 0 30px rgba(200, 80, 80, 0.6),
            0 0 50px rgba(100, 255, 100, 0.3);
        }

        .custom-cursor.possessed.hovering .cursor-eye-pupil {
          transform: scaleY(1.3) scaleX(1.2);
        }

        /* ========== CTA MODE ========== */
        .custom-cursor.cta-mode {
          width: 70px;
          height: 70px;
        }

        .cursor-cta-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(100, 255, 100, 0.8);
          animation: cta-rotate 2s linear infinite;
          box-shadow:
            0 0 20px rgba(100, 255, 100, 0.5),
            inset 0 0 20px rgba(100, 255, 100, 0.1);
        }

        .cursor-cta-ring-2 {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          border: 1px solid rgba(100, 255, 100, 0.4);
          animation: cta-rotate 3s linear infinite reverse;
        }

        .cursor-cta-pulse {
          position: absolute;
          inset: 15px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(100, 255, 100, 0.2) 0%, transparent 70%);
          animation: cta-pulse 1s ease-in-out infinite;
        }

        @keyframes cta-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes cta-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .custom-cursor-dot.cta-mode {
          width: 12px;
          height: 12px;
          background: rgba(100, 255, 100, 1);
          box-shadow:
            0 0 15px rgba(100, 255, 100, 1),
            0 0 30px rgba(100, 255, 100, 0.8),
            0 0 45px rgba(100, 255, 100, 0.5);
          animation: cta-dot-glow 0.8s ease-in-out infinite;
        }

        @keyframes cta-dot-glow {
          0%, 100% { 
            box-shadow:
              0 0 15px rgba(100, 255, 100, 1),
              0 0 30px rgba(100, 255, 100, 0.8),
              0 0 45px rgba(100, 255, 100, 0.5);
          }
          50% { 
            box-shadow:
              0 0 20px rgba(100, 255, 100, 1),
              0 0 40px rgba(100, 255, 100, 0.9),
              0 0 60px rgba(100, 255, 100, 0.6);
          }
        }

        .custom-cursor.cta-mode.clicking {
          width: 50px;
          height: 50px;
          transition: width 0.15s ease, height 0.15s ease;
        }

        .custom-cursor.cta-mode.clicking .cursor-cta-ring {
          border-color: rgba(255, 255, 255, 1);
          box-shadow:
            0 0 30px rgba(100, 255, 100, 0.8),
            0 0 60px rgba(100, 255, 100, 0.5),
            inset 0 0 30px rgba(100, 255, 100, 0.3);
          animation: cta-rotate 0.3s linear infinite;
        }

        .custom-cursor-dot.cta-mode.clicking {
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 1);
          box-shadow:
            0 0 20px rgba(255, 255, 255, 1),
            0 0 40px rgba(100, 255, 100, 1),
            0 0 60px rgba(100, 255, 100, 0.8);
        }

        /* Hide on touch devices */
        @media (hover: none) and (pointer: coarse) {
          * { cursor: auto !important; }
          .custom-cursor,
          .custom-cursor-dot { display: none !important; }
        }
      `}</style>
    </>
  );
}
