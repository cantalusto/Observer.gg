"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export default function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let timeoutId: ReturnType<typeof setTimeout>;

    // Box-Muller transform para distribuição Gaussiana
    const gaussianRandom = () => {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };

    const renderGrain = () => {
      const width = canvas.width;
      const height = canvas.height;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Gaussian noise - distribuição normal centrada em 0
        const noise = gaussianRandom();

        // Apenas grãos visíveis (|noise| > 1.8 = ~7% dos valores)
        if (Math.abs(noise) > 1.8) {
          // Mapear para brilho (0-255) com distribuição gaussiana
          const brightness = Math.min(255, Math.max(0,
            128 + noise * 35
          ));

          // Adiciona um leve tom verde ao ruído para atmosfera
          const greenTint = Math.random() > 0.85;
          data[i] = greenTint ? brightness * 0.7 : brightness;       // R
          data[i + 1] = brightness;   // G
          data[i + 2] = greenTint ? brightness * 0.7 : brightness;   // B
          data[i + 3] = 30 + Math.abs(noise) * 25; // Alpha mais sutil
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Próximo frame em intervalo irregular mais lento (150ms a 400ms)
      const nextDelay = 40 + Math.random() * 110;
      timeoutId = setTimeout(renderGrain, nextDelay);
    };

    renderGrain();

    return () => {
      window.removeEventListener("resize", resize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Flash de luz aleatório para efeito de horror
  useEffect(() => {
    const triggerFlash = () => {
      if (Math.random() > 0.85) {
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 50 + Math.random() * 100);
      }
    };

    const interval = setInterval(triggerFlash, 8000 + Math.random() * 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Noise canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          opacity: 0.35,
        }}
      />

      {/* Efeito de flash de luz */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: flashActive ? 0.08 : 0 }}
        transition={{ duration: 0.05 }}
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(74, 255, 74, 0.3), transparent 70%)",
        }}
      />

      {/* Partículas de poeira flutuantes */}
      <div className="pointer-events-none fixed inset-0 z-25 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-moss-400/20"
            style={{
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100 - Math.random() * 200],
              x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* Vinheta sutil pulsante */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-20"
        animate={{
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0, 5, 0, 0.4) 100%)`,
        }}
      />

      {/* Linhas de scan muito sutis globais */}
      <div
        className="pointer-events-none fixed inset-0 z-35"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0, 20, 0, 0.03) 3px,
            rgba(0, 20, 0, 0.03) 6px
          )`,
          animation: "scanMove 12s linear infinite",
        }}
      />
    </>
  );
}
