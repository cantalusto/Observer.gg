"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useCursor } from "@/contexts/CursorContext";

// ============================================
// OLHO ASSUSTADOR QUE SEGUE O MOUSE
// ============================================
function ScaryEye({ 
  x, 
  y, 
  size = 40,
  intensity = 1,
  delay = 0,
}: { 
  x: number; 
  y: number; 
  size?: number;
  intensity?: number;
  delay?: number;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isNearButton, setIsNearButton] = useState(false);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calcula a posição do olho na tela
      const eyeCenterX = (x / 100) * window.innerWidth;
      const eyeCenterY = (y / 100) * window.innerHeight;
      
      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 30, size * 0.15);
      
      setPupilOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
      
      // Verifica se está perto do botão (centro da tela)
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const distanceToCenter = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      setIsNearButton(distanceToCenter < 200);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y, size]);

  // Não renderiza nada no servidor para evitar hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <motion.div
      ref={eyeRef}
      className="absolute pointer-events-none"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: intensity,
        scale: 1,
        x: isNearButton ? [0, -2, 2, -1, 1, 0] : 0,
        y: isNearButton ? [0, 1, -1, 2, -2, 0] : 0,
      }}
      transition={{ 
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5, type: "spring" },
        x: { repeat: Infinity, duration: 0.15, ease: "linear" },
        y: { repeat: Infinity, duration: 0.12, ease: "linear" },
      }}
    >
      {/* Glow externo */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size * 2,
          height: size * 2,
          left: -size / 2,
          top: -size / 2,
          background: `radial-gradient(circle, rgba(74, 200, 74, ${isNearButton ? 0.3 : 0.15}) 0%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
      />
      
      {/* Olho externo */}
      <div 
        className="relative rounded-full overflow-hidden"
        style={{
          width: size,
          height: size * 0.6,
          background: 'radial-gradient(ellipse, #0a0f0a 0%, #030503 100%)',
          boxShadow: `
            inset 0 0 ${size/4}px rgba(0,0,0,0.8),
            0 0 ${size/3}px rgba(74, 180, 74, ${isNearButton ? 0.6 : 0.3})
          `,
          border: '1px solid rgba(74, 140, 74, 0.3)',
        }}
      >
        {/* Íris */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.45,
            height: size * 0.45,
            left: '50%',
            top: '50%',
            x: pupilOffset.x - (size * 0.225),
            y: pupilOffset.y - (size * 0.225),
            background: `radial-gradient(circle, #2d5a2d 0%, #1a3a1a 50%, #0d1f0d 100%)`,
            boxShadow: `0 0 ${size/6}px rgba(74, 200, 74, 0.5)`,
          }}
        >
          {/* Pupila */}
          <div 
            className="absolute rounded-full"
            style={{
              width: size * 0.2,
              height: size * 0.2,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#000',
              boxShadow: `0 0 ${size/8}px rgba(74, 255, 74, 0.8)`,
            }}
          >
            {/* Reflexo */}
            <div 
              className="absolute rounded-full bg-white/60"
              style={{
                width: size * 0.06,
                height: size * 0.06,
                top: '20%',
                right: '20%',
              }}
            />
          </div>
        </motion.div>
        
        {/* Veias do olho */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 60">
          <path d="M0,30 Q20,20 35,30" stroke="#3a1a1a" strokeWidth="0.5" fill="none"/>
          <path d="M0,35 Q25,45 40,35" stroke="#3a1a1a" strokeWidth="0.3" fill="none"/>
          <path d="M100,30 Q80,20 65,30" stroke="#3a1a1a" strokeWidth="0.5" fill="none"/>
          <path d="M100,35 Q75,45 60,35" stroke="#3a1a1a" strokeWidth="0.3" fill="none"/>
        </svg>
      </div>
    </motion.div>
  );
}

// ============================================
// BOTÃO CTA ESPECIAL
// ============================================
function ScaryButton({ children, href }: { children: React.ReactNode; href?: string }) {
  const { mode, setMode } = useCursor();
  const [isHovered, setIsHovered] = useState(false);
  const previousModeRef = useRef(mode);

  const handleMouseEnter = () => {
    previousModeRef.current = mode;
    setIsHovered(true);
    setMode("cta");
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMode(previousModeRef.current);
  };

  const buttonClasses = `
    group relative inline-flex items-center justify-center gap-4
    px-8 py-5 rounded-xl
    bg-moss-900/60 hover:bg-moss-800/70
    border-2 border-moss-500/40 hover:border-moss-400/60
    text-lg font-medium text-moss-100 hover:text-white
    transition-all duration-300
    shadow-[0_0_30px_rgba(74,124,74,0.1)] hover:shadow-[0_0_50px_rgba(74,124,74,0.25)]
  `;

  const content = (
    <>
      <span className="relative z-10">{children}</span>

      {/* Arrow icon */}
      <svg
        className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>

      {/* Glow effect on hover */}
      <div
        className={`
          absolute inset-0 rounded-xl transition-opacity duration-500
          bg-gradient-to-r from-moss-500/10 via-moss-400/20 to-moss-500/10
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={buttonClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={buttonClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </button>
  );
}

// ============================================
// TELA 2 - "Você não está vendo tudo"
// ============================================
function RevelationScreen({
  progress,
}: {
  progress: ReturnType<typeof useTransform<number, number>>;
}) {
  // Tela 1: 0% - 18%
  const opacity = useTransform(progress, [0, 0.02, 0.16, 0.18], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.03], [40, 0]);

  const textLine1 = useTransform(progress, [0.02, 0.04], [0, 1]);
  const textLine2 = useTransform(progress, [0.04, 0.06], [0, 1]);

  // Micro-exemplos
  const examples = [
    { wrong: "CS baixo", right: "Recall ruim aos 7:40", delay: 0.07 },
    { wrong: "KDA alto", right: "Pico de poder ignorado", delay: 0.10 },
    { wrong: "Muitas mortes", right: "Trade errado no level 2", delay: 0.13 },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
      style={{ opacity }}
    >
      {/* Olho observador - discreto no canto */}
      <motion.div
        className="absolute top-12 right-12 w-16 h-16 opacity-30"
        style={{
          opacity: useTransform(progress, [0.04, 0.08], [0, 0.3]),
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse
            cx="50"
            cy="50"
            rx="45"
            ry="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-moss-600"
          />
          <circle cx="50" cy="50" r="15" className="fill-moss-500/50" />
          <circle cx="50" cy="50" r="6" className="fill-moss-300" />
        </svg>
      </motion.div>

      <motion.div style={{ y }} className="max-w-3xl text-center">
        {/* Headline acusatória */}
        <motion.p
          className="text-2xl md:text-4xl text-moss-300/90 font-light leading-relaxed"
          style={{ opacity: textLine1 }}
        >
          Você olha números.
        </motion.p>
        <motion.p
          className="mt-2 text-2xl md:text-4xl text-white font-medium leading-relaxed"
          style={{ opacity: textLine2 }}
        >
          Nós olhamos decisões.
        </motion.p>

        {/* Separador */}
        <motion.div
          className="mt-12 mb-12 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-moss-600 to-transparent"
          style={{ opacity: useTransform(progress, [0.05, 0.07], [0, 1]) }}
        />

        {/* Micro-exemplos */}
        <div className="space-y-4">
          {examples.map((ex, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-center gap-6 md:gap-12 group cursor-default"
              style={{
                opacity: useTransform(
                  progress,
                  [ex.delay, ex.delay + 0.02],
                  [0, 1]
                ),
                x: useTransform(
                  progress,
                  [ex.delay, ex.delay + 0.02],
                  [-20, 0]
                ),
              }}
            >
              {/* Errado */}
              <div className="flex items-center gap-2 text-moss-600/60 transition-all duration-300 group-hover:text-moss-600/40 group-hover:scale-95">
                <span className="text-red-500/60 text-lg transition-all duration-300 group-hover:text-red-500/40">✕</span>
                <span className="text-sm md:text-base line-through">
                  {ex.wrong}
                </span>
              </div>

              {/* Certo */}
              <div className="flex items-center gap-2 text-moss-300 transition-all duration-300 group-hover:text-moss-200 group-hover:scale-105">
                <span className="text-moss-400 text-lg transition-all duration-300 group-hover:text-moss-300">✓</span>
                <span className="text-sm md:text-base font-medium transition-all duration-300 group-hover:text-shadow-glow">
                  {ex.right}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// TELA 3 - "Nós explicamos o PORQUÊ"
// ============================================
function WhyScreen({
  progress,
}: {
  progress: ReturnType<typeof useTransform<number, number>>;
}) {
  // Tela 2: 18% - 38%
  const opacity = useTransform(progress, [0.18, 0.20, 0.36, 0.38], [0, 1, 1, 0]);

  const blocks = [
    {
      title: "Análise causal",
      text: "Você perdeu porque lutou fora do seu pico de poder.",
      start: 0.23,
    },
    {
      title: "Padrões invisíveis",
      text: "Você sempre força quando está à frente.",
      start: 0.28,
    },
    {
      title: "Evolução real",
      text: "Seu farm melhora. Suas decisões não.",
      start: 0.33,
    },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
      style={{ opacity }}
    >
      <div className="max-w-2xl">
        {/* Headline */}
        <motion.h2
          className="text-center font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-medium italic text-white leading-tight"
          style={{
            opacity: useTransform(progress, [0.19, 0.22], [0, 1]),
            y: useTransform(progress, [0.19, 0.22], [30, 0]),
          }}
        >
          A diferença entre jogar e evoluir
          <br />
          <span className="text-moss-400">é entender o porquê.</span>
        </motion.h2>

        {/* Blocos */}
        <div className="mt-16 space-y-8">
          {blocks.map((block, i) => (
            <motion.div
              key={i}
              className="relative pl-6 border-l-2 border-moss-700/50 cursor-default group transition-all duration-300 hover:border-moss-500 hover:pl-8"
              style={{
                opacity: useTransform(progress, [block.start, block.start + 0.02], [0, 1]),
                x: useTransform(progress, [block.start, block.start + 0.02], [-30, 0]),
              }}
            >
              <span className="text-xs font-medium uppercase tracking-widest text-moss-500 mb-2 block transition-colors duration-300 group-hover:text-moss-400">
                {block.title}
              </span>
              <p className="text-lg md:text-xl text-moss-200 font-light transition-colors duration-300 group-hover:text-white">
                {block.text}
              </p>
              {/* Glow on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-moss-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// TELA 4 - "Nós analisamos VOCÊ"
// ============================================
function PersonalizationScreen({
  progress,
}: {
  progress: ReturnType<typeof useTransform<number, number>>;
}) {
  // Tela 3: 38% - 56%
  const opacity = useTransform(progress, [0.38, 0.40, 0.54, 0.56], [0, 1, 1, 0]);

  const profiles = [
    { trait: "Agressivo demais", color: "text-red-400/80" },
    { trait: "Seguro demais", color: "text-blue-400/80" },
    { trait: "Escala bem", color: "text-moss-400" },
    { trait: "Tiltável", color: "text-orange-400/80" },
    { trait: "Inconstante", color: "text-purple-400/80" },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
      style={{ opacity }}
    >
      <div className="max-w-3xl text-center">
        {/* Headline */}
        <motion.h2
          className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-medium italic text-white"
          style={{
            opacity: useTransform(progress, [0.39, 0.42], [0, 1]),
            y: useTransform(progress, [0.39, 0.42], [30, 0]),
          }}
        >
          O meta não joga por você.
        </motion.h2>

        <motion.p
          className="mt-4 text-xl text-moss-300/80"
          style={{
            opacity: useTransform(progress, [0.42, 0.44], [0, 1]),
          }}
        >
          Seu estilo decide se você sobe ou não.
        </motion.p>

        {/* DNA do jogador - Cards */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-3"
          style={{
            opacity: useTransform(progress, [0.44, 0.46], [0, 1]),
          }}
        >
          {profiles.map((profile, i) => (
            <motion.div
              key={i}
              className="px-4 py-2 rounded-full border border-moss-700/50 bg-moss-950/50 cursor-default transition-all duration-300 hover:border-moss-500 hover:bg-moss-900/50 hover:scale-110 hover:shadow-lg hover:shadow-moss-500/20"
              style={{
                opacity: useTransform(
                  progress,
                  [0.44 + i * 0.015, 0.46 + i * 0.015],
                  [0, 1]
                ),
                scale: useTransform(
                  progress,
                  [0.44 + i * 0.015, 0.46 + i * 0.015],
                  [0.8, 1]
                ),
              }}
            >
              <span className={`text-sm font-medium ${profile.color} transition-all duration-300`}>
                {profile.trait}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Frase poderosa */}
        <motion.div
          className="mt-16"
          style={{
            opacity: useTransform(progress, [0.50, 0.52], [0, 1]),
            y: useTransform(progress, [0.50, 0.52], [20, 0]),
          }}
        >
          <p className="text-lg md:text-2xl text-white font-medium">
            Dois jogadores no mesmo elo.
          </p>
          <p className="mt-1 text-lg md:text-2xl text-moss-400">
            Resultados opostos.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================
// TELA 5 - "Missões, não dicas"
// ============================================
function MissionsScreen({
  progress,
}: {
  progress: ReturnType<typeof useTransform<number, number>>;
}) {
  // Tela 4: 56% - 74%
  const opacity = useTransform(progress, [0.56, 0.58, 0.72, 0.74], [0, 1, 1, 0]);

  const missions = [
    "7 CS/min até 10 min",
    "Não lutar antes do mítico",
    "Recall antes do pico inimigo",
  ];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
      style={{ opacity }}
    >
      <div className="max-w-2xl">
        {/* Headline */}
        <motion.h2
          className="text-center font-[family-name:var(--font-serif)] text-3xl md:text-5xl font-medium italic text-white leading-tight"
          style={{
            opacity: useTransform(progress, [0.57, 0.60], [0, 1]),
            y: useTransform(progress, [0.57, 0.60], [30, 0]),
          }}
        >
          Jogar mais não te faz melhor.
          <br />
          <span className="text-moss-400">Jogar certo faz.</span>
        </motion.h2>

        {/* Card de missão */}
        <motion.div
          className="mt-12 mx-auto max-w-md"
          style={{
            opacity: useTransform(progress, [0.61, 0.63], [0, 1]),
            y: useTransform(progress, [0.61, 0.63], [20, 0]),
          }}
        >
          <div className="border border-moss-700/50 rounded-lg bg-moss-950/30 overflow-hidden transition-all duration-300 hover:border-moss-600 hover:shadow-lg hover:shadow-moss-900/50">
            {/* Header do card */}
            <div className="px-5 py-3 border-b border-moss-800/40 bg-moss-950/50">
              <span className="text-xs font-medium uppercase tracking-widest text-moss-500">
                No próximo jogo
              </span>
            </div>

            {/* Missões */}
            <div className="p-5 space-y-3">
              {missions.map((mission, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 cursor-default group"
                  style={{
                    opacity: useTransform(
                      progress,
                      [0.63 + i * 0.02, 0.65 + i * 0.02],
                      [0, 1]
                    ),
                    x: useTransform(
                      progress,
                      [0.63 + i * 0.02, 0.65 + i * 0.02],
                      [-10, 0]
                    ),
                  }}
                >
                  <div className="w-5 h-5 rounded border border-moss-600/50 flex items-center justify-center transition-all duration-300 group-hover:border-moss-400 group-hover:bg-moss-800/50">
                    <div className="w-2 h-2 rounded-sm bg-moss-600/30 transition-all duration-300 group-hover:bg-moss-400/50" />
                  </div>
                  <span className="text-moss-200 transition-colors duration-300 group-hover:text-white">{mission}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Resultado */}
          <motion.div
            className="mt-6 text-center"
            style={{
              opacity: useTransform(progress, [0.68, 0.70], [0, 1]),
              y: useTransform(progress, [0.68, 0.70], [10, 0]),
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-moss-900/50 border border-moss-600/30 cursor-default transition-all duration-300 hover:bg-moss-800/50 hover:border-moss-500 hover:scale-105">
              <span className="text-moss-400">✓</span>
              <span className="text-sm text-moss-300">
                2 de 3 objetivos cumpridos
              </span>
            </div>
            <p className="mt-3 text-sm text-moss-500 uppercase tracking-wider animate-pulse">
              Evolução detectada
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================
// TELA 6 - "Não somos para todos"
// ============================================
function FilterScreen({
  progress,
}: {
  progress: ReturnType<typeof useTransform<number, number>>;
}) {
  // Tela 5: 74% - 90%
  const opacity = useTransform(progress, [0.74, 0.76, 0.88, 0.90], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
      style={{ opacity }}
    >
      <div className="max-w-2xl text-center">
        <motion.p
          className="text-xl md:text-2xl text-moss-400/80 leading-relaxed"
          style={{
            opacity: useTransform(progress, [0.76, 0.79], [0, 1]),
            y: useTransform(progress, [0.76, 0.79], [20, 0]),
          }}
        >
          Se você só quer culpar o time,
          <br />
          <span className="text-moss-600">não somos pra você.</span>
        </motion.p>

        <motion.div
          className="my-10 h-px w-24 mx-auto bg-moss-700/50"
          style={{
            opacity: useTransform(progress, [0.80, 0.82], [0, 1]),
            scaleX: useTransform(progress, [0.80, 0.82], [0, 1]),
          }}
        />

        <motion.p
          className="text-2xl md:text-3xl text-white font-medium leading-relaxed"
          style={{
            opacity: useTransform(progress, [0.82, 0.85], [0, 1]),
            y: useTransform(progress, [0.82, 0.85], [20, 0]),
          }}
        >
          Se você quer evoluir,
          <br />
          <span className="text-moss-300 font-[family-name:var(--font-serif)] italic">
            bem-vindo.
          </span>
        </motion.p>
      </div>
    </motion.div>
  );
}

// ============================================
// TELA FINAL - CTA
// ============================================
function CTAScreen({
  progress,
}: {
  progress: ReturnType<typeof useTransform<number, number>>;
}) {
  // Tela 6: 90% - 100%
  const opacity = useTransform(progress, [0.90, 0.92, 1], [0, 1, 1]);

  // Posições dos olhos espalhados pela tela
  const eyePositions = [
    { x: 8, y: 20, size: 55, intensity: 0.9, delay: 0 },
    { x: 92, y: 15, size: 45, intensity: 0.8, delay: 0.1 },
    { x: 5, y: 75, size: 50, intensity: 0.85, delay: 0.2 },
    { x: 95, y: 80, size: 60, intensity: 0.9, delay: 0.15 },
    { x: 15, y: 45, size: 35, intensity: 0.6, delay: 0.3 },
    { x: 85, y: 50, size: 40, intensity: 0.7, delay: 0.25 },
    { x: 3, y: 90, size: 30, intensity: 0.5, delay: 0.4 },
    { x: 97, y: 92, size: 35, intensity: 0.55, delay: 0.35 },
    { x: 20, y: 10, size: 25, intensity: 0.4, delay: 0.5 },
    { x: 80, y: 8, size: 28, intensity: 0.45, delay: 0.45 },
    { x: 12, y: 60, size: 32, intensity: 0.5, delay: 0.55 },
    { x: 88, y: 65, size: 38, intensity: 0.6, delay: 0.5 },
  ];

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity }}
    >
      {/* Container dos olhos - separado do conteúdo */}
      <div className="absolute inset-0 pointer-events-none">
        {eyePositions.map((eye, index) => (
          <ScaryEye
            key={index}
            x={eye.x}
            y={eye.y}
            size={eye.size}
            intensity={eye.intensity}
            delay={eye.delay}
          />
        ))}
      </div>

      {/* Conteúdo central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
        <div className="text-center relative z-10">
          <motion.h2
            className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl lg:text-6xl font-medium italic text-white leading-tight"
            style={{
              opacity: useTransform(progress, [0.91, 0.93], [0, 1]),
              y: useTransform(progress, [0.91, 0.93], [30, 0]),
            }}
          >
            Veja o que você
            <br />
            <span className="text-moss-400">não está vendo.</span>
          </motion.h2>

          <motion.div
            className="mt-12"
            style={{
              opacity: useTransform(progress, [0.94, 0.96], [0, 1]),
              y: useTransform(progress, [0.94, 0.96], [20, 0]),
            }}
          >
            <ScaryButton href="/auth">
              Analisar minha última partida
            </ScaryButton>
          </motion.div>

          <motion.p
            className="mt-8 text-sm text-moss-600 uppercase tracking-widest"
            style={{
              opacity: useTransform(progress, [0.97, 1], [0, 1]),
            }}
          >
            A verdade te espera
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function DeepDiveSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const totalHeight = 800; // vh - mais altura para scroll mais lento

  return (
    <section
      ref={containerRef}
      className="relative bg-[#040604]"
      style={{ height: `${totalHeight}vh` }}
    >
      {/* Noise background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#040604]" />

        {/* Tela 2 - Revelação */}
        <RevelationScreen progress={scrollYProgress} />

        {/* Tela 3 - Porquê */}
        <WhyScreen progress={scrollYProgress} />

        {/* Tela 4 - Personalização */}
        <PersonalizationScreen progress={scrollYProgress} />

        {/* Tela 5 - Missões */}
        <MissionsScreen progress={scrollYProgress} />

        {/* Tela 6 - Filtro */}
        <FilterScreen progress={scrollYProgress} />

        {/* CTA Final */}
        <CTAScreen progress={scrollYProgress} />

        {/* Indicador de progresso lateral - só visível durante esta seção */}
        <motion.div
          className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3"
          style={{
            opacity: useTransform(
              scrollYProgress,
              [0, 0.02, 0.95, 1],
              [0, 1, 1, 0]
            ),
          }}
        >
          {[0, 0.18, 0.38, 0.56, 0.74, 0.90].map((threshold, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full border border-moss-700/50"
              style={{
                backgroundColor: useTransform(
                  scrollYProgress,
                  [threshold, threshold + 0.02],
                  ["transparent", "rgb(74 124 74)"]
                ),
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
