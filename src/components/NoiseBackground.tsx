"use client";

import { useEffect, useRef, useState } from "react";

// Partículas com valores fixos (evita hydration mismatch)
const PARTICLES = [
  { w: 1.5, h: 2.1, l: 12, t: 15 },
  { w: 2.2, h: 1.8, l: 28, t: 45 },
  { w: 1.8, h: 2.5, l: 45, t: 22 },
  { w: 2.0, h: 1.6, l: 62, t: 68 },
  { w: 1.3, h: 2.3, l: 78, t: 35 },
  { w: 2.5, h: 1.9, l: 91, t: 82 },
  { w: 1.7, h: 2.0, l: 35, t: 91 },
  { w: 2.1, h: 1.5, l: 55, t: 12 },
  { w: 1.9, h: 2.4, l: 8, t: 55 },
  { w: 2.3, h: 1.7, l: 72, t: 78 },
];

export default function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Marca quando estamos no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Noise no canvas - otimizado para não travar o cursor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      // Usa resolução menor para melhor performance
      const scale = 0.5;
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    let animationId: number;
    let lastTime = 0;
    const FPS = 15; // Limita a 15fps para economizar CPU
    const frameInterval = 1000 / FPS;

    // Pré-aloca o imageData para evitar GC
    let imageData: ImageData | null = null;

    const renderGrain = (currentTime: number) => {
      animationId = requestAnimationFrame(renderGrain);

      // Limita FPS
      if (currentTime - lastTime < frameInterval) return;
      lastTime = currentTime;

      const width = canvas.width;
      const height = canvas.height;

      // Cria imageData apenas se necessário
      if (!imageData || imageData.width !== width || imageData.height !== height) {
        imageData = ctx.createImageData(width, height);
      }

      const data = imageData.data;
      const len = data.length;

      // Loop otimizado - processa em chunks de 4 (RGBA)
      for (let i = 0; i < len; i += 4) {
        // Usa operação simples ao invés de gaussiana
        if (Math.random() > 0.97) {
          const brightness = 100 + Math.random() * 80;
          data[i] = brightness;
          data[i + 1] = brightness;
          data[i + 2] = brightness;
          data[i + 3] = 25 + Math.random() * 20;
        } else {
          data[i + 3] = 0; // Transparente
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    animationId = requestAnimationFrame(renderGrain);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Noise canvas - resolução reduzida para performance */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-30"
        style={{ opacity: 0.3, imageRendering: "pixelated" }}
      />

      {/* Partículas de poeira - valores fixos */}
      {isClient && (
        <div className="pointer-events-none fixed inset-0 z-[25] overflow-hidden">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-moss-400/20 animate-float-up"
              style={{
                width: p.w,
                height: p.h,
                left: `${p.l}%`,
                top: `${p.t}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${15 + i * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Vinheta sutil */}
      <div
        className="pointer-events-none fixed inset-0 z-20 animate-vignette-pulse"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0, 5, 0, 0.4) 100%)`,
        }}
      />

      {/* Linhas de scan sutis */}
      <div
        className="pointer-events-none fixed inset-0 z-[35]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0, 20, 0, 0.02) 3px,
            rgba(0, 20, 0, 0.02) 6px
          )`,
        }}
      />

      <style jsx>{`
        @keyframes float-up {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }

        @keyframes vignette-pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-float-up {
          animation: float-up linear infinite;
        }

        .animate-vignette-pulse {
          animation: vignette-pulse 8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
