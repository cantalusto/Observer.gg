"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

// ============================================================================
// CONSTANTS & TYPES
// ============================================================================
const DDRAGON_VERSION = "16.2.1";
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img`;

type Participant = {
  puuid: string;
  summonerName: string;
  tagLine: string;
  championId: number;
  championName: string;
  championLevel: number;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  cs: number;
  csPerMin: number;
  visionScore: number;
  wardsPlaced: number;
  wardsKilled: number;
  controlWardsPlaced: number;
  goldEarned: number;
  goldPerMin: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  totalHeal: number;
  damagePerMin: number;
  win: boolean;
  teamId: number;
  position: string;
  items: number[];
  summoners: number[];
  perks: any;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
  firstBloodKill: boolean;
  firstBloodAssist: boolean;
  turretKills: number;
  inhibitorKills: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  killingSprees: number;
};

type TeamStats = {
  teamId: number;
  win: boolean;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  totalGold: number;
  totalDamage: number;
  objectives: Record<string, { kills?: number; first?: boolean }>;
  participants: Participant[];
};

type MatchDetails = {
  matchId: string;
  gameMode: string;
  gameType: string;
  queueId: number;
  gameDuration: number;
  gameStartTimestamp: number;
  gameEndTimestamp: number;
  teams: {
    blue: TeamStats;
    red: TeamStats;
  };
};

// ============================================================================
// BACKGROUND
// ============================================================================
function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#0a0f0a]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

// ============================================================================
// HEADER
// ============================================================================
function Header({ gameName, tagLine }: { gameName?: string; tagLine?: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0f0a]/90 backdrop-blur-sm border-b border-moss-800/20">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Link
            href={gameName && tagLine ? `/profile/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}` : "/dashboard"}
            className="flex items-center gap-2 text-moss-500 hover:text-moss-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm hidden sm:block">Voltar ao Perfil</span>
          </Link>
          <div className="h-4 w-px bg-moss-800" />
          <Link href="/" className="flex items-center gap-1">
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-white">OBSERVER</span>
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-moss-500">.GG</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// MATCH HEADER
// ============================================================================
function MatchHeader({ match }: { match: MatchDetails }) {
  const blueWon = match.teams.blue.win;

  const getQueueName = (queueId: number) => {
    const queues: Record<number, string> = {
      420: "Ranqueada Solo/Duo",
      440: "Ranqueada Flex",
      400: "Normal Draft",
      430: "Normal Blind",
      450: "ARAM",
      900: "URF",
    };
    return queues[queueId] || "Partida";
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      className="rounded-xl border border-moss-800/30 bg-[#0d120d]/80 overflow-hidden mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="p-6">
        {/* Title row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">
              {getQueueName(match.queueId)}
            </h1>
            <p className="text-sm text-moss-500">{formatDate(match.gameStartTimestamp)}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-[family-name:var(--font-display)] font-bold text-white">
              {formatDuration(match.gameDuration)}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-moss-600">Duração</p>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className={`text-right ${blueWon ? "" : "opacity-50"}`}>
            <p className={`text-sm font-bold uppercase ${blueWon ? "text-green-400" : "text-red-400"}`}>
              {blueWon ? "Vitória" : "Derrota"}
            </p>
            <p className="text-xs text-blue-400">Time Azul</p>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`text-5xl font-[family-name:var(--font-display)] font-black ${blueWon ? "text-blue-400" : "text-blue-400/50"}`}
              style={{ textShadow: blueWon ? "0 0 20px rgba(59, 130, 246, 0.4)" : "none" }}
            >
              {match.teams.blue.totalKills}
            </span>

            <div className="w-12 h-12 rounded-full bg-moss-900/50 border border-moss-700/30 flex items-center justify-center">
              <span className="text-sm font-bold text-moss-400">VS</span>
            </div>

            <span
              className={`text-5xl font-[family-name:var(--font-display)] font-black ${!blueWon ? "text-red-400" : "text-red-400/50"}`}
              style={{ textShadow: !blueWon ? "0 0 20px rgba(239, 68, 68, 0.4)" : "none" }}
            >
              {match.teams.red.totalKills}
            </span>
          </div>

          <div className={`text-left ${!blueWon ? "" : "opacity-50"}`}>
            <p className={`text-sm font-bold uppercase ${!blueWon ? "text-green-400" : "text-red-400"}`}>
              {!blueWon ? "Vitória" : "Derrota"}
            </p>
            <p className="text-xs text-red-400">Time Vermelho</p>
          </div>
        </div>

        {/* Stats comparison */}
        <div className="grid grid-cols-3 gap-4">
          <StatBar
            label="Ouro Total"
            blueValue={match.teams.blue.totalGold}
            redValue={match.teams.red.totalGold}
            format="k"
          />
          <StatBar
            label="Dano Total"
            blueValue={match.teams.blue.totalDamage}
            redValue={match.teams.red.totalDamage}
            format="k"
          />
          <StatBar
            label="Abates"
            blueValue={match.teams.blue.totalKills}
            redValue={match.teams.red.totalKills}
            format="number"
          />
        </div>
      </div>
    </motion.div>
  );
}

function StatBar({
  label,
  blueValue,
  redValue,
  format,
}: {
  label: string;
  blueValue: number;
  redValue: number;
  format: "k" | "number";
}) {
  const total = blueValue + redValue;
  const bluePercent = total > 0 ? (blueValue / total) * 100 : 50;

  const formatValue = (val: number) => {
    if (format === "k") return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
  };

  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-widest text-moss-600 mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-blue-400 w-12 text-right">{formatValue(blueValue)}</span>
        <div className="flex-1 h-2 bg-moss-900 rounded-full overflow-hidden flex">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${bluePercent}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.div
            className="h-full bg-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${100 - bluePercent}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
        <span className="text-sm font-mono text-red-400 w-12 text-left">{formatValue(redValue)}</span>
      </div>
    </div>
  );
}

// ============================================================================
// PLAYER ROW
// ============================================================================
function PlayerRow({
  player,
  isBlueTeam,
  maxDamage,
  isHighlighted,
  index,
}: {
  player: Participant;
  isBlueTeam: boolean;
  maxDamage: number;
  isHighlighted: boolean;
  index: number;
}) {
  const damagePercent = maxDamage > 0 ? (player.totalDamageDealt / maxDamage) * 100 : 0;

  return (
    <motion.div
      className={`rounded-lg border p-3 transition-all ${
        isHighlighted
          ? "bg-moss-800/30 border-moss-500/50"
          : "bg-moss-900/20 border-moss-800/20 hover:bg-moss-900/30"
      }`}
      initial={{ opacity: 0, x: isBlueTeam ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-center gap-3">
        {/* Champion */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img
              src={`${DDRAGON_BASE}/champion/${player.championName}.png`}
              alt={player.championName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded bg-moss-950 border border-moss-700/50 flex items-center justify-center">
            <span className="text-[8px] font-bold text-moss-300">{player.championLevel}</span>
          </div>
        </div>

        {/* Name + KDA */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate">
              {player.summonerName}
            </span>
            {player.tagLine && (
              <span className="text-[10px] text-moss-600">#{player.tagLine}</span>
            )}
            {isHighlighted && (
              <span className="px-1.5 py-0.5 rounded bg-moss-600/30 text-moss-300 text-[9px] font-bold">
                VOCÊ
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            {/* Damage bar */}
            <div className="w-16 h-1 bg-moss-900 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${isBlueTeam ? "bg-blue-500" : "bg-red-500"}`}
                initial={{ width: 0 }}
                animate={{ width: `${damagePercent}%` }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
              />
            </div>
            <span className="text-[10px] text-moss-500">{(player.totalDamageDealt / 1000).toFixed(1)}k</span>
          </div>
        </div>

        {/* KDA */}
        <div className="text-center w-20">
          <p className="text-sm font-mono text-white">
            {player.kills}/<span className="text-red-400">{player.deaths}</span>/{player.assists}
          </p>
          <p className={`text-[10px] ${player.kda >= 3 ? "text-green-400" : player.kda >= 2 ? "text-moss-400" : "text-moss-500"}`}>
            {player.kda.toFixed(2)} KDA
          </p>
        </div>

        {/* CS */}
        <div className="text-center w-14 hidden sm:block">
          <p className="text-sm font-mono text-white">{player.cs}</p>
          <p className="text-[10px] text-moss-500">{player.csPerMin}/min</p>
        </div>

        {/* Vision */}
        <div className="text-center w-10 hidden md:block">
          <p className="text-sm font-mono text-white">{player.visionScore}</p>
          <p className="text-[10px] text-moss-500">Visão</p>
        </div>

        {/* Gold */}
        <div className="text-center w-16 hidden lg:block">
          <p className="text-sm font-mono text-yellow-500">{(player.goldEarned / 1000).toFixed(1)}k</p>
          <p className="text-[10px] text-moss-500">{player.goldPerMin}/min</p>
        </div>

        {/* Items */}
        <div className="flex gap-0.5">
          {player.items.slice(0, 6).map((itemId, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded bg-moss-900/50 border border-moss-800/30 overflow-hidden"
            >
              {itemId > 0 && (
                <img src={`${DDRAGON_BASE}/item/${itemId}.png`} alt="" className="w-full h-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Multi-kills */}
      {(player.doubleKills > 0 || player.tripleKills > 0 || player.quadraKills > 0 || player.pentaKills > 0 || player.firstBloodKill) && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {player.doubleKills > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-[9px] font-bold">
              Double x{player.doubleKills}
            </span>
          )}
          {player.tripleKills > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[9px] font-bold">
              Triple x{player.tripleKills}
            </span>
          )}
          {player.quadraKills > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[9px] font-bold">
              Quadra x{player.quadraKills}
            </span>
          )}
          {player.pentaKills > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold animate-pulse">
              PENTA x{player.pentaKills}
            </span>
          )}
          {player.firstBloodKill && (
            <span className="px-1.5 py-0.5 rounded bg-red-900/30 text-red-300 text-[9px] font-bold">
              First Blood
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// TEAM SECTION
// ============================================================================
function TeamSection({
  team,
  isBlueTeam,
  highlightedPuuid,
}: {
  team: TeamStats;
  isBlueTeam: boolean;
  highlightedPuuid?: string;
}) {
  const maxDamage = Math.max(...team.participants.map((p) => p.totalDamageDealt));

  return (
    <div className="flex-1">
      {/* Team header */}
      <div className={`flex items-center gap-3 mb-3 ${isBlueTeam ? "" : "flex-row-reverse"}`}>
        <div
          className={`w-2 h-2 rounded-full ${isBlueTeam ? "bg-blue-500" : "bg-red-500"}`}
          style={{ boxShadow: `0 0 8px ${isBlueTeam ? "rgba(59, 130, 246, 0.5)" : "rgba(239, 68, 68, 0.5)"}` }}
        />
        <span className={`text-sm font-bold uppercase tracking-wider ${isBlueTeam ? "text-blue-400" : "text-red-400"}`}>
          Time {isBlueTeam ? "Azul" : "Vermelho"}
        </span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
            team.win ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400/70"
          }`}
        >
          {team.win ? "VITÓRIA" : "DERROTA"}
        </span>
      </div>

      {/* Players */}
      <div className="space-y-2">
        {team.participants.map((player, index) => (
          <PlayerRow
            key={player.puuid}
            player={player}
            isBlueTeam={isBlueTeam}
            maxDamage={maxDamage}
            isHighlighted={player.puuid === highlightedPuuid}
            index={index}
          />
        ))}
      </div>

      {/* Team totals */}
      <div
        className={`mt-3 p-3 rounded-lg border ${
          isBlueTeam ? "bg-blue-950/20 border-blue-900/30" : "bg-red-950/20 border-red-900/30"
        }`}
      >
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className={`text-xl font-bold ${isBlueTeam ? "text-blue-400" : "text-red-400"}`}>
              {team.totalKills}
            </p>
            <p className="text-[9px] uppercase text-moss-600">Abates</p>
          </div>
          <div>
            <p className="text-xl font-bold text-moss-300">{team.totalDeaths}</p>
            <p className="text-[9px] uppercase text-moss-600">Mortes</p>
          </div>
          <div>
            <p className="text-xl font-bold text-yellow-500">{(team.totalGold / 1000).toFixed(1)}k</p>
            <p className="text-[9px] uppercase text-moss-600">Ouro</p>
          </div>
          <div>
            <p className="text-xl font-bold text-moss-300">{(team.totalDamage / 1000).toFixed(0)}k</p>
            <p className="text-[9px] uppercase text-moss-600">Dano</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LOADING & ERROR
// ============================================================================
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-moss-700/30 border-t-moss-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-moss-500 text-sm">Carregando...</p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-950/50 border border-red-800/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Erro</h2>
        <p className="text-moss-400 mb-6">{message}</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-moss-800/50 border border-moss-700/30 text-moss-300 hover:bg-moss-700/50 hover:text-white transition-all"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function MatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const matchId = params.matchId as string;
  const platform = searchParams.get("platform") || "BR1";
  const puuid = searchParams.get("puuid");
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");

  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatch() {
      try {
        const response = await fetch(`/api/match/${matchId}?platform=${platform}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Erro ao carregar partida");
          return;
        }

        setMatch(data);
      } catch {
        setError("Erro de conexão");
      } finally {
        setLoading(false);
      }
    }

    if (matchId) {
      fetchMatch();
    }
  }, [matchId, platform]);

  return (
    <div className="relative min-h-screen">
      <Background />
      <Header gameName={gameName || undefined} tagLine={tagLine || undefined} />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : match ? (
        <div className="relative z-10 pt-20 px-4 sm:px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <MatchHeader match={match} />

            {/* Teams side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TeamSection
                team={match.teams.blue}
                isBlueTeam={true}
                highlightedPuuid={puuid || undefined}
              />
              <TeamSection
                team={match.teams.red}
                isBlueTeam={false}
                highlightedPuuid={puuid || undefined}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
