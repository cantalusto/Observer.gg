"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useCursor } from "@/contexts/CursorContext";

// ============================================
// BOTÃO CTA ESPECIAL
// ============================================
function ScaryButton({ children }: { children: React.ReactNode }) {
  const { setMode, isClicking } = useCursor();
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={buttonRef}
      className="group relative overflow-hidden"
      onMouseEnter={() => {
        setIsHovered(true);
        setMode("cta");
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setMode("normal");
      }}
    >
      {/* Fundo principal */}
      <div className={`
        relative z-10 px-10 py-5 rounded-lg font-medium text-lg
        transition-all duration-300 ease-out
        ${isHovered ? 'bg-transparent' : 'bg-moss-900/80'}
        border-2 border-moss-500/50
        ${isHovered ? 'border-moss-400' : ''}
        ${isClicking ? 'scale-95' : ''}
      `}>
        {/* Texto */}
        <span className={`
          relative z-20 transition-all duration-300
          ${isHovered ? 'text-white' : 'text-moss-200'}
          ${isClicking ? 'text-moss-300' : ''}
        `}>
          {children}
        </span>
      </div>

      {/* Glow de fundo no hover */}
      <div className={`
        absolute inset-0 rounded-lg transition-opacity duration-500
        bg-gradient-to-r from-moss-600/20 via-moss-500/30 to-moss-600/20
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `} />

      {/* Borda animada */}
      <div className={`
        absolute inset-0 rounded-lg transition-opacity duration-300
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="absolute inset-0 rounded-lg border-2 border-moss-400/60 animate-pulse" />
      </div>

      {/* Linhas de scan */}
      <div className={`
        absolute inset-0 overflow-hidden rounded-lg pointer-events-none
        ${isHovered ? 'opacity-100' : 'opacity-0'}
        transition-opacity duration-300
      `}>
        <div 
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-moss-400/80 to-transparent"
          style={{
            animation: isHovered ? 'scan-line 2s linear infinite' : 'none',
            top: '0%',
          }}
        />
        <div 
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-moss-400/40 to-transparent"
          style={{
            animation: isHovered ? 'scan-line 2s linear infinite 0.5s' : 'none',
            top: '0%',
          }}
        />
      </div>

      {/* Partículas flutuantes */}
      {isHovered && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-moss-400 rounded-full animate-float-particle"
              style={{
                left: `${15 + i * 15}%`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* Efeito de clique - onda de energia */}
      <div className={`
        absolute inset-0 rounded-lg pointer-events-none
        ${isClicking ? 'animate-click-ripple' : ''}
      `}>
        <div className={`
          absolute inset-0 rounded-lg border-2 border-moss-300
          ${isClicking ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}
          transition-all duration-200
        `} />
      </div>

      {/* Olho observador no canto */}
      <div className={`
        absolute -right-2 -bottom-2 w-10 h-10 
        transition-all duration-500 ease-out
        ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
      `}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse
            cx="50"
            cy="50"
            rx="45"
            ry="30"
            fill="rgba(4, 6, 4, 0.9)"
            stroke="rgba(100, 180, 100, 0.6)"
            strokeWidth="2"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="15" 
            fill="rgba(50, 140, 50, 0.8)"
            className={isClicking ? 'animate-pulse' : ''}
          />
          <circle 
            cx="50" 
            cy="50" 
            r="6" 
            fill="rgba(0, 0, 0, 0.9)"
          />
          <circle 
            cx="47" 
            cy="47" 
            r="2" 
            fill="rgba(100, 255, 100, 0.8)"
          />
        </svg>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes scan-line {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        
        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(100%) scale(0);
            opacity: 0;
          }
          50% { 
            transform: translateY(-50%) scale(1);
            opacity: 0.8;
          }
        }
        
        .animate-float-particle {
          animation: float-particle 2s ease-in-out infinite;
        }
        
        @keyframes click-ripple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        .animate-click-ripple > div {
          animation: click-ripple 0.4s ease-out;
        }
      `}</style>
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

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
      style={{ opacity }}
    >
      <div className="text-center">
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
          <ScaryButton>
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

        {/* Indicador de progresso lateral */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
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
        </div>
      </div>
    </section>
  );
}
