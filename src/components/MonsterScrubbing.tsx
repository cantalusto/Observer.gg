"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, MotionValue, useTransform } from "motion/react";

const TOTAL_FRAMES = 192;

interface MonsterScrubbingProps {
  progress: MotionValue<number>;
}

export default function MonsterScrubbing({ progress }: MonsterScrubbingProps) {
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Gera lista de caminhos dos frames
  const framePaths = useMemo(() => {
    return Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const frameNum = String(i).padStart(3, "0");
      // Pattern: frame_000_delay-0.042s.jpg ou frame_000_delay-0.041s.jpg
      const delay = i % 6 === 4 || i % 6 === 1 ? "0.041s" : "0.042s";
      return `/MonsterScrobbing/frame_${frameNum}_delay-${delay}.jpg`;
    });
  }, []);

  // Pré-carrega todas as imagens
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    framePaths.forEach((path, index) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setLoadedImages(images);
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        // Tenta carregar com delay alternativo
        const altDelay = path.includes("0.041s") ? "0.042s" : "0.041s";
        img.src = path.replace(/0\.04[12]s/, altDelay);
      };
      images[index] = img;
    });
  }, [framePaths]);

  // Atualiza o frame baseado no progresso do scroll
  useEffect(() => {
    const unsubscribe = progress.on("change", (latest) => {
      const frameIndex = Math.min(
        Math.floor(latest * TOTAL_FRAMES),
        TOTAL_FRAMES - 1
      );
      setCurrentFrame(Math.max(0, frameIndex));
    });

    return () => unsubscribe();
  }, [progress]);

  // Desenha o frame atual no canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || loadedImages.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = loadedImages[currentFrame];
    if (!img || !img.complete) return;

    // Define tamanho do canvas baseado na imagem
    if (canvas.width !== img.width || canvas.height !== img.height) {
      canvas.width = img.width;
      canvas.height = img.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, [currentFrame, loadedImages]);

  // Transforma o progresso em opacidade para efeito de glow
  const glowIntensity = useTransform(
    progress,
    [0, 0.3, 0.5, 0.7, 1],
    [0.3, 0.6, 0.8, 0.6, 0.4]
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#040604]">
          <div className="flex flex-col items-center gap-4">
            <motion.div
              className="h-16 w-16 rounded-full border-2 border-moss-500/30 border-t-moss-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-sm text-moss-500">
              Carregando o Observador...
            </span>
          </div>
        </div>
      )}

      {/* Canvas com a animação */}
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-out",
        }}
      />

      {/* Efeito de glow verde pulsante */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: glowIntensity,
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(74, 200, 74, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 50% 40%, rgba(100, 255, 100, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* Vinheta nas bordas */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, rgba(4, 6, 4, 0.8) 0%, transparent 15%, transparent 85%, rgba(4, 6, 4, 0.8) 100%),
            linear-gradient(to bottom, rgba(4, 6, 4, 0.5) 0%, transparent 20%, transparent 80%, rgba(4, 6, 4, 0.5) 100%)
          `,
        }}
      />

      {/* Scan lines sutis */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.3) 2px,
            rgba(0, 0, 0, 0.3) 4px
          )`,
        }}
      />
    </div>
  );
}
