"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import MonsterScrubbing from "./MonsterScrubbing";

const features = [
  {
    title: "Análise que vai além dos números",
    description:
      "Não dizemos apenas o que aconteceu — explicamos por que você ganhou ou perdeu. Identificamos decisões invisíveis, erros mascarados por vitórias e acertos escondidos em derrotas.",
    highlight: "Entenda o porquê",
    details: [
      "Análises causais, não apenas estatísticas",
      "Comparação com jogadores do seu elo",
      "Identifica partidas 'mentirosas'",
    ],
  },
  {
    title: "Seu perfil único de jogador",
    description:
      "Criamos seu DNA de jogador: agressividade, consistência, tomada de decisão. Acompanhe sua evolução real e veja previsões de onde você pode chegar.",
    highlight: "Evolução personalizada",
    details: [
      "Curva de aprendizado por habilidade",
      "Identifica padrões e tendências",
      "Previsão de evolução de elo",
    ],
  },
  {
    title: "Meta feito para você",
    description:
      "Esqueça tier lists genéricas. Recomendamos campeões e estratégias que combinam com seu estilo, com missões personalizadas para cada partida.",
    highlight: "Recomendações inteligentes",
    details: [
      "Campeões ideais para seu perfil",
      "Desafios práticos pós-partida",
      "Evolução mensurável",
    ],
  },
  {
    title: "Coach que conhece você",
    description:
      "Converse com uma IA que estudou seu histórico. Pergunte sobre builds, derrotas ou decisões — receba respostas baseadas nos seus dados, não em teoria genérica.",
    highlight: "Assistente pessoal",
    details: [
      "Respostas contextualizadas",
      "Análise nível profissional",
      "Disponível 24/7",
    ],
  },
];

function FeatureCard({
  feature,
  index,
  progress,
}: {
  feature: (typeof features)[0];
  index: number;
  progress: ReturnType<typeof useTransform<number, number>>;
}) {
  const totalFeatures = features.length;
  const featuresEnd = 0.45;

  const startProgress = (index / totalFeatures) * featuresEnd;
  const endProgress = ((index + 1) / totalFeatures) * featuresEnd;
  const peakProgress = startProgress + (endProgress - startProgress) / 2;

  const cardOpacity = useTransform(
    progress,
    [startProgress, startProgress + 0.02, peakProgress, endProgress - 0.02, endProgress],
    [0, 1, 1, 1, 0]
  );

  const cardY = useTransform(
    progress,
    [startProgress, startProgress + 0.03, endProgress - 0.03, endProgress],
    [50, 0, 0, -50]
  );

  const cardScale = useTransform(
    progress,
    [startProgress, startProgress + 0.03, endProgress - 0.03, endProgress],
    [0.97, 1, 1, 0.97]
  );

  // Line reveal animation
  const lineWidth = useTransform(
    progress,
    [startProgress, startProgress + 0.03],
    ["0%", "100%"]
  );

  // Staggered details
  const detailsOpacity = useTransform(
    progress,
    [startProgress + 0.02, startProgress + 0.04],
    [0, 1]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-start px-8 md:px-12 lg:px-16"
      style={{ opacity: cardOpacity, y: cardY, scale: cardScale }}
    >
      <div className="max-w-xl">
        {/* Number with line */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-5xl font-bold text-moss-700/40">
            {String(index + 1).padStart(2, "0")}
          </span>
          <motion.div 
            className="h-px bg-gradient-to-r from-moss-600 to-transparent"
            style={{ width: lineWidth, maxWidth: "4rem" }}
          />
        </div>

        {/* Tag */}
        <div className="mb-4 inline-block rounded-full border border-moss-600/40 bg-moss-950/60 px-4 py-1.5">
          <span className="text-xs font-medium uppercase tracking-widest text-moss-400">
            {feature.highlight}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-[family-name:var(--font-serif)] text-2xl font-medium italic text-white md:text-3xl lg:text-4xl leading-tight">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="mt-4 text-base leading-relaxed text-moss-300/80 md:text-lg">
          {feature.description}
        </p>

        {/* Details */}
        <motion.ul className="mt-6 space-y-2.5" style={{ opacity: detailsOpacity }}>
          {feature.details.map((detail, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-moss-400">
              <span className="h-1.5 w-1.5 rounded-full bg-moss-500" />
              {detail}
            </li>
          ))}
        </motion.ul>

        {/* Progress bar */}
        <div className="mt-8 flex items-center gap-3">
          <div className="h-1 flex-1 max-w-48 overflow-hidden rounded-full bg-moss-900">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-moss-600 to-moss-400"
              style={{
                width: useTransform(progress, [startProgress, endProgress], ["0%", "100%"]),
              }}
            />
          </div>
          <span className="text-xs text-moss-600">
            {index + 1} / {features.length}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function StorytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // === TIMELINE ===
  // 0-45%: Features + frames scrubbing
  // 45-55%: Barra da direita fecha (vai para direita)
  // 55-60%: Monstro toma tela inteira
  // 60-80%: Zoom dramático no olho
  // 80-100%: Texto final

  // Progress para os frames do monstro (0-55%)
  const monsterProgress = useTransform(scrollYProgress, [0, 0.55], [0, 1]);

  // === BARRA DA DIREITA FECHANDO ===
  const rightPanelX = useTransform(scrollYProgress, [0.45, 0.55], ["0%", "100%"]);
  const rightPanelOpacity = useTransform(scrollYProgress, [0.45, 0.52], [1, 0]);

  // === MONSTRO EXPANDE PARA TELA INTEIRA ===
  const monsterWidth = useTransform(scrollYProgress, [0.45, 0.58], ["50%", "100%"]);

  // === ZOOM NO OLHO ===
  const eyeZoomScale = useTransform(scrollYProgress, [0.58, 0.78], [1, 15]);
  const eyeZoomOpacity = useTransform(scrollYProgress, [0.58, 0.62, 0.75, 0.8], [1, 1, 1, 0]);
  // Ajuste fino do zoom no olho:
  // - eyeZoomY: movimento vertical durante zoom (positivo = move para baixo visualmente)
  // - eyeZoomX: movimento horizontal durante zoom (negativo = move para esquerda visualmente)
  const eyeZoomY = useTransform(scrollYProgress, [0.58, 0.78], ["0%", "25%"]);
  const eyeZoomX = useTransform(scrollYProgress, [0.58, 0.78], ["0%", "0%"]);

  // === GLOW DO OLHO ===
  const eyeGlowOpacity = useTransform(scrollYProgress, [0.62, 0.72, 0.8], [0, 1, 0]);
  const eyeGlowScale = useTransform(scrollYProgress, [0.62, 0.78], [1, 6]);

  // === TEXTO FINAL ===
  const textOpacity = useTransform(scrollYProgress, [0.8, 0.88], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.8, 0.88], [60, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.86, 0.94], [0, 1]);
  const lineWidth = useTransform(scrollYProgress, [0.9, 1], ["0%", "60%"]);

  const totalHeight = 800; // vh

  return (
    <section
      id="servicos"
      ref={containerRef}
      className="relative bg-[#040604]"
      style={{ height: `${totalHeight}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[#040604]" />

        {/* === MONSTER CONTAINER === */}
        <motion.div
          className="absolute left-0 top-0 h-full overflow-hidden"
          style={{ width: monsterWidth }}
        >
          {/* Monster com zoom */}
          <motion.div
            className="absolute inset-0"
            style={{ opacity: eyeZoomOpacity }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                scale: eyeZoomScale,
                y: eyeZoomY,
                x: eyeZoomX,
                // AJUSTE DO ZOOM NO OLHO:
                // Primeiro valor = posição horizontal (0% esquerda, 100% direita)
                // Segundo valor = posição vertical (0% topo, 100% fundo)
                // Aumente o primeiro para mover o ponto de zoom para a DIREITA
                // Aumente o segundo para mover o ponto de zoom para BAIXO
                transformOrigin: "52% 25%",
              }}
            >
              <MonsterScrubbing progress={monsterProgress} />
            </motion.div>
          </motion.div>

          {/* Glow do olho */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: eyeGlowOpacity,
              scale: eyeGlowScale,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '22%',
              paddingLeft: '4%', // Ajuste horizontal do glow
            }}
          >
            <div
              className="w-24 h-24 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(100, 255, 100, 0.9) 0%, rgba(74, 200, 74, 0.5) 30%, transparent 60%)`,
                filter: "blur(20px)",
                boxShadow: "0 0 120px rgba(74, 255, 74, 0.8), 0 0 200px rgba(74, 200, 74, 0.4)",
              }}
            />
          </motion.div>
        </motion.div>

        {/* === BARRA DA DIREITA (FEATURES) === */}
        <motion.div
          className="absolute right-0 top-0 h-full w-1/2 hidden md:block"
          style={{ x: rightPanelX, opacity: rightPanelOpacity }}
        >
          {/* Divisor esquerdo */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, rgba(74, 180, 74, 0.4) 30%, rgba(74, 180, 74, 0.4) 70%, transparent)`,
            }}
          />

          {/* Background da barra */}
          <div className="absolute inset-0 bg-[#040604]" />

          {/* Header */}
          <motion.div
            className="absolute top-8 left-8 z-20"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.02, 0.4, 0.45], [1, 0.5, 0.5, 0]),
            }}
          >
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-moss-600">
              Por que escolher o Observer
            </span>
          </motion.div>

          {/* Feature cards */}
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              progress={scrollYProgress}
            />
          ))}

          {/* Navigation dots */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
            {features.map((_, index) => {
              const featuresEnd = 0.45;
              const dotStart = (index / features.length) * featuresEnd;
              const dotEnd = ((index + 1) / features.length) * featuresEnd;

              return (
                <motion.div
                  key={index}
                  className="h-2.5 w-2.5 rounded-full border border-moss-700"
                  style={{
                    backgroundColor: useTransform(
                      scrollYProgress,
                      [dotStart, dotStart + 0.015, dotEnd - 0.015, dotEnd],
                      ["transparent", "rgb(74 124 74)", "rgb(74 124 74)", "transparent"]
                    ),
                    scale: useTransform(
                      scrollYProgress,
                      [dotStart, dotStart + 0.015, dotEnd - 0.015, dotEnd],
                      [1, 1.3, 1.3, 1]
                    ),
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* === TEXTO FINAL "NÃO SOMOS MAIS UM OP.GG" === */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-8 z-20"
          style={{ opacity: textOpacity }}
        >
          <motion.h2
            className="text-center font-[family-name:var(--font-serif)] text-4xl md:text-6xl lg:text-7xl font-medium italic text-white"
            style={{ y: textY }}
          >
            Não somos mais um{" "}
            <span className="text-moss-600 line-through decoration-moss-500/50 decoration-2">OP.GG</span>
          </motion.h2>

          <motion.div
            className="mt-10 text-center max-w-2xl"
            style={{ opacity: text2Opacity }}
          >
            <p className="text-xl md:text-2xl text-moss-300/90 leading-relaxed">
              Somos o <span className="text-moss-400 font-semibold">Observador</span>.
            </p>
            <p className="mt-3 text-xl md:text-2xl text-white font-medium">
              Nós revelamos a verdade que você não quer ver.
            </p>
          </motion.div>

          <motion.div
            className="mt-12 h-px bg-gradient-to-r from-transparent via-moss-500 to-transparent"
            style={{ width: lineWidth }}
          />

          <motion.p
            className="mt-12 text-sm uppercase tracking-[0.4em] text-moss-600"
            style={{ opacity: useTransform(scrollYProgress, [0.94, 1], [0, 1]) }}
          >
            A verdade dói. Mas é ela que te faz evoluir.
          </motion.p>
        </motion.div>

        {/* === MOBILE === */}
        <div className="absolute inset-0 md:hidden">
          {/* === Features com MonsterScrubbing de fundo (0-70%) === */}
          <motion.div
            className="absolute inset-0"
            style={{ 
              opacity: useTransform(scrollYProgress, [0, 0.65, 0.72], [1, 1, 0]),
              zIndex: 20
            }}
          >
            {/* MonsterScrubbing de fundo */}
            <div className="absolute inset-0">
              <MonsterScrubbing progress={useTransform(scrollYProgress, [0, 0.65], [0, 0.7])} />
              {/* Overlay escuro sobre o monster */}
              <div className="absolute inset-0 bg-[#040604]/75" />
            </div>
            
            {/* Vinheta sutil nas bordas */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(to bottom, #040604 0%, transparent 8%, transparent 92%, #040604 100%),
                  linear-gradient(to right, #040604 0%, transparent 5%, transparent 95%, #040604 100%)
                `,
              }}
            />
            
            {/* Header "Por que escolher o Observer" */}
            <motion.div
              className="absolute top-6 left-0 right-0 text-center z-30"
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.05, 0.6, 0.65], [0, 1, 1, 0]),
              }}
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-moss-500">
                Por que escolher o Observer
              </span>
            </motion.div>

            {/* Cards centralizados */}
            <div className="absolute inset-0 flex items-center justify-center px-5 pt-12 pb-8">
              {features.map((feature, index) => {
                const totalFeatures = features.length;
                const featureRange = 0.55; // 0% a 55% = 55%
                const featureStart = 0.05;
                
                const startProgress = featureStart + (index / totalFeatures) * featureRange;
                const endProgress = featureStart + ((index + 1) / totalFeatures) * featureRange;

                return (
                  <motion.div
                    key={index}
                    className="absolute inset-x-5 flex items-center justify-center"
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [startProgress, startProgress + 0.03, endProgress - 0.03, endProgress],
                        [0, 1, 1, 0]
                      ),
                      y: useTransform(
                        scrollYProgress,
                        [startProgress, startProgress + 0.03, endProgress - 0.03, endProgress],
                        [40, 0, 0, -40]
                      ),
                      scale: useTransform(
                        scrollYProgress,
                        [startProgress, startProgress + 0.03, endProgress - 0.03, endProgress],
                        [0.95, 1, 1, 0.95]
                      ),
                    }}
                  >
                    <div className="w-full max-w-sm rounded-lg border border-moss-700/30 bg-moss-950/90 p-5 backdrop-blur-sm shadow-[0_0_40px_rgba(4,6,4,0.8)]">
                      {/* Número */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono text-3xl font-bold text-moss-700/50">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-moss-600/50 to-transparent" />
                      </div>

                      {/* Tag */}
                      <div className="mb-3 inline-block rounded-full border border-moss-600/40 bg-moss-900/60 px-3 py-1">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-moss-400">
                          {feature.highlight}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-[family-name:var(--font-serif)] text-xl font-medium italic text-white leading-tight">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 text-sm leading-relaxed text-moss-300/80">
                        {feature.description}
                      </p>

                      {/* Details */}
                      <ul className="mt-4 space-y-2">
                        {feature.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-moss-400">
                            <span className="h-1 w-1 rounded-full bg-moss-500" />
                            {detail}
                          </li>
                        ))}
                      </ul>

                      {/* Progress indicator */}
                      <div className="mt-5 flex items-center gap-2">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-moss-900">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-moss-600 to-moss-400"
                            style={{
                              width: useTransform(scrollYProgress, [startProgress, endProgress], ["0%", "100%"]),
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-moss-600">
                          {index + 1} / {features.length}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Vinheta nas bordas */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(to bottom, #040604 0%, transparent 12%, transparent 88%, #040604 100%),
                  linear-gradient(to right, #040604 0%, transparent 8%, transparent 92%, #040604 100%)
                `,
              }}
            />
          </motion.div>

          {/* === FASE 3: Zoom no olho (70-85%) === */}
          <motion.div
            className="absolute inset-0"
            style={{ 
              opacity: useTransform(scrollYProgress, [0.65, 0.72, 0.8, 0.85], [0, 1, 1, 0]),
              zIndex: useTransform(scrollYProgress, [0.65, 0.72, 0.85], [0, 30, 0])
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                scale: useTransform(scrollYProgress, [0.7, 0.85], [1, 8]),
                transformOrigin: "50% 35%",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full" style={{ transform: "scale(1.3)" }}>
                  <MonsterScrubbing progress={useTransform(scrollYProgress, [0.7, 0.85], [0.7, 1])} />
                </div>
              </div>
            </motion.div>
            
            {/* Glow do olho */}
            <motion.div
              className="absolute inset-0 pointer-events-none flex items-start justify-center"
              style={{
                opacity: useTransform(scrollYProgress, [0.72, 0.78, 0.85], [0, 1, 0]),
                paddingTop: '30%',
              }}
            >
              <motion.div
                className="w-32 h-32 rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(100, 255, 100, 0.9) 0%, rgba(74, 200, 74, 0.5) 30%, transparent 60%)`,
                  filter: "blur(25px)",
                  boxShadow: "0 0 100px rgba(74, 255, 74, 0.8), 0 0 180px rgba(74, 200, 74, 0.4)",
                  scale: useTransform(scrollYProgress, [0.72, 0.85], [1, 4]),
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* === PARTÍCULAS DURANTE ZOOM === */}
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ opacity: useTransform(scrollYProgress, [0.6, 0.7, 0.8], [0, 1, 0]) }}
        >
          {[
            { l: 20, t: 30, mx: 120, my: -80, o: 0.6 },
            { l: 35, t: 45, mx: -90, my: 110, o: 0.8 },
            { l: 50, t: 25, mx: 60, my: -130, o: 0.5 },
            { l: 65, t: 55, mx: -140, my: 70, o: 0.7 },
            { l: 25, t: 60, mx: 100, my: 90, o: 0.9 },
            { l: 40, t: 35, mx: -70, my: -100, o: 0.6 },
            { l: 55, t: 70, mx: 130, my: -60, o: 0.8 },
            { l: 70, t: 40, mx: -110, my: 120, o: 0.5 },
            { l: 30, t: 50, mx: 80, my: -90, o: 0.7 },
            { l: 45, t: 65, mx: -60, my: 80, o: 0.9 },
            { l: 60, t: 30, mx: 100, my: 110, o: 0.6 },
            { l: 75, t: 55, mx: -120, my: -70, o: 0.8 },
            { l: 22, t: 42, mx: 70, my: 100, o: 0.5 },
            { l: 38, t: 58, mx: -80, my: -110, o: 0.7 },
            { l: 52, t: 38, mx: 110, my: 60, o: 0.9 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-moss-400"
              style={{
                left: `${p.l}%`,
                top: `${p.t}%`,
                x: useTransform(scrollYProgress, [0.6, 0.8], [0, p.mx]),
                y: useTransform(scrollYProgress, [0.6, 0.8], [0, p.my]),
                opacity: p.o,
              }}
            />
          ))}
        </motion.div>

        {/* === FLASH DURANTE TRANSIÇÃO === */}
        <motion.div
          className="absolute inset-0 bg-moss-500 pointer-events-none"
          style={{
            opacity: useTransform(scrollYProgress, [0.54, 0.56, 0.58], [0, 0.15, 0]),
            mixBlendMode: "overlay",
          }}
        />
      </div>
    </section>
  );
}
