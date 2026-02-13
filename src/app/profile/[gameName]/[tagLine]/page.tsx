"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// ============================================================================
// CONSTANTS & TYPES
// ============================================================================
const DDRAGON_VERSION = "16.2.1";
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img`;

type SummonerProfile = {
  account: {
    puuid: string;
    gameName: string;
    tagLine: string;
  };
  summoner: {
    id: string;
    profileIconId: number;
    summonerLevel: number;
  };
  leagues: Array<{
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }>;
  region: string;
};

type RecentMatch = {
  matchId: string;
  championId: number;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  visionScore: number;
  goldEarned: number;
  damage: number;
  win: boolean;
  gameDuration: number;
  gameStartTimestamp: number;
  queueId: number;
  position: string;
  items: number[];
  summoners: number[];
  kda: number;
  csPerMin: number;
};

type MatchFilter = "all" | "ranked" | "normal" | "aram";

// Rank data with emblems
const RANK_DATA: Record<string, { color: string; short: string }> = {
  IRON: { color: "#5e5e5e", short: "I" },
  BRONZE: { color: "#cd7f32", short: "B" },
  SILVER: { color: "#c0c0c0", short: "S" },
  GOLD: { color: "#ffd700", short: "G" },
  PLATINUM: { color: "#00cec9", short: "P" },
  EMERALD: { color: "#2ecc71", short: "E" },
  DIAMOND: { color: "#b9f2ff", short: "D" },
  MASTER: { color: "#9b59b6", short: "M" },
  GRANDMASTER: { color: "#e74c3c", short: "GM" },
  CHALLENGER: { color: "#f1c40f", short: "C" },
};

// ============================================================================
// BACKGROUND
// ============================================================================
function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#0a0f0a]" />

      {/* Subtle gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(20, 40, 20, 0.3) 0%, transparent 50%)",
        }}
      />

      {/* Noise texture */}
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
function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 bg-[#0a0f0a]/90 backdrop-blur-sm border-b border-moss-800/20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-moss-500 hover:text-moss-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm hidden sm:block">Voltar</span>
          </Link>
          <div className="h-4 w-px bg-moss-800" />
          <Link href="/" className="flex items-center gap-1">
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-white">OBSERVER</span>
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-moss-500">.GG</span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

// ============================================================================
// RANK EMBLEM - Shows rank icon with animation
// ============================================================================
function RankEmblem({
  tier,
  rank,
  lp,
  wins,
  losses,
  queueLabel
}: {
  tier: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
  queueLabel: string;
}) {
  const rankInfo = RANK_DATA[tier];
  const color = rankInfo?.color || "#4a7c4a";
  const isUnranked = !rankInfo;
  const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

  // Use Community Dragon for rank emblems
  const getRankEmblemUrl = (tierName: string) => {
    const tierLower = tierName.toLowerCase();
    return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${tierLower}.png`;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Queue label */}
      <p className="text-[10px] uppercase tracking-widest text-moss-600 mb-2">{queueLabel}</p>

      {/* Emblem image - no box, just the image */}
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        {/* Glow effect behind image */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            filter: "blur(15px)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {isUnranked ? (
          <div
            className="w-24 h-24 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
              border: `2px solid ${color}50`,
            }}
          >
            <span className="text-3xl text-moss-500">?</span>
          </div>
        ) : (
          <img
            src={getRankEmblemUrl(tier)}
            alt={`${tier} ${rank}`}
            className="w-24 h-24 object-contain relative z-10"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        )}
      </motion.div>

      {/* Rank info */}
      <div className="mt-2 text-center">
        <p className="text-sm font-bold text-white">
          {isUnranked ? "Sem Rank" : `${tier} ${rank}`}
        </p>
        <p className="text-lg font-bold text-white">
          {isUnranked ? "—" : lp} <span className="text-moss-500 text-sm">LP</span>
        </p>
        <p className="text-[10px] text-moss-500">
          {wins}V {losses}D · {winRate}% WR
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// WIN RATE CIRCLE
// ============================================================================
function WinRateCircle({ wins, losses }: { wins: number; losses: number }) {
  const total = wins + losses;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (winRate / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(46, 204, 113, 0.15) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(74, 124, 74, 0.15)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#2ecc71"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 6px rgba(46, 204, 113, 0.5))" }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.span
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {winRate}%
            </motion.span>
            <p className="text-[9px] uppercase tracking-wider text-moss-500">Win Rate</p>
          </div>
        </div>
      </div>

      {/* W/L text */}
      <p className="mt-2 text-xs text-moss-500">
        {wins}V - {losses}D
      </p>
    </div>
  );
}

// ============================================================================
// PROFILE HEADER
// ============================================================================
function ProfileHeader({
  profile,
  matches,
}: {
  profile: SummonerProfile;
  matches: RecentMatch[];
}) {
  const soloQueue = profile.leagues.find((l) => l.queueType === "RANKED_SOLO_5x5");
  const flexQueue = profile.leagues.find((l) => l.queueType === "RANKED_FLEX_SR");

  // Recent match stats
  const recentWins = matches.filter((m) => m.win).length;
  const recentLosses = matches.filter((m) => !m.win).length;
  const avgKDA = matches.length > 0
    ? (matches.reduce((sum, m) => sum + m.kda, 0) / matches.length).toFixed(2)
    : "0.00";

  // Top champions
  const championStats = useMemo(() => {
    const stats: Record<string, { name: string; wins: number; losses: number; games: number }> = {};
    matches.forEach((m) => {
      if (!stats[m.championName]) {
        stats[m.championName] = { name: m.championName, wins: 0, losses: 0, games: 0 };
      }
      stats[m.championName].games++;
      if (m.win) stats[m.championName].wins++;
      else stats[m.championName].losses++;
    });
    return Object.values(stats).sort((a, b) => b.games - a.games).slice(0, 3);
  }, [matches]);

  return (
    <motion.div
      className="rounded-xl border border-moss-800/30 bg-[#0d120d]/80 backdrop-blur-sm overflow-hidden mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Profile icon + Name */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-moss-700/50">
                <img
                  src={`${DDRAGON_BASE}/profileicon/${profile.summoner.profileIconId}.png`}
                  alt={profile.account.gameName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `${DDRAGON_BASE}/profileicon/29.png`;
                  }}
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-moss-900 border border-moss-700 rounded text-xs font-bold text-moss-300">
                {profile.summoner.summonerLevel}
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">
                {profile.account.gameName}
                <span className="text-moss-500">#{profile.account.tagLine}</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-moss-900/50 border border-moss-700/30 text-xs text-moss-400">
                  {profile.region}
                </span>
              </div>
            </div>
          </div>

          {/* Rank Emblems - Solo/Duo and Flex */}
          <div className="flex items-center justify-center gap-6 lg:ml-auto">
            <RankEmblem
              tier={soloQueue?.tier || ""}
              rank={soloQueue?.rank || ""}
              lp={soloQueue?.leaguePoints || 0}
              wins={soloQueue?.wins || 0}
              losses={soloQueue?.losses || 0}
              queueLabel="Solo/Duo"
            />
            <RankEmblem
              tier={flexQueue?.tier || ""}
              rank={flexQueue?.rank || ""}
              lp={flexQueue?.leaguePoints || 0}
              wins={flexQueue?.wins || 0}
              losses={flexQueue?.losses || 0}
              queueLabel="Flex"
            />
          </div>

          {/* Recent Stats */}
          <div className="lg:ml-auto">
            <p className="text-[10px] uppercase tracking-widest text-moss-600 mb-3">
              Últimas {matches.length} Partidas
            </p>

            <div className="flex gap-3">
              <div className="text-center px-4 py-2 rounded-lg bg-moss-900/30 border border-moss-800/30">
                <p className="text-lg font-bold text-green-400">{recentWins}</p>
                <p className="text-[9px] uppercase text-moss-500">Vitórias</p>
              </div>
              <div className="text-center px-4 py-2 rounded-lg bg-moss-900/30 border border-moss-800/30">
                <p className="text-lg font-bold text-red-400">{recentLosses}</p>
                <p className="text-[9px] uppercase text-moss-500">Derrotas</p>
              </div>
              <div className="text-center px-4 py-2 rounded-lg bg-moss-900/30 border border-moss-800/30">
                <p className="text-lg font-bold text-moss-300">{avgKDA}</p>
                <p className="text-[9px] uppercase text-moss-500">KDA</p>
              </div>
            </div>

            {/* Top champions */}
            {championStats.length > 0 && (
              <div className="mt-3">
                <p className="text-[9px] uppercase tracking-widest text-moss-600 mb-2">Mais Jogados</p>
                <div className="flex gap-2">
                  {championStats.map((champ) => (
                    <div key={champ.name} className="relative">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-moss-700/30">
                        <img
                          src={`${DDRAGON_BASE}/champion/${champ.name}.png`}
                          alt={champ.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 py-0.5 rounded bg-moss-950 border border-moss-800/50 text-[8px]">
                        <span className="text-green-400">{champ.wins}</span>
                        <span className="text-moss-600">:</span>
                        <span className="text-red-400">{champ.losses}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MATCH FILTERS
// ============================================================================
function MatchFilters({
  filter,
  setFilter,
  matches,
}: {
  filter: MatchFilter;
  setFilter: (f: MatchFilter) => void;
  matches: RecentMatch[];
}) {
  const filters: { key: MatchFilter; label: string; count: number }[] = [
    { key: "all", label: "Todas", count: matches.length },
    { key: "ranked", label: "Ranqueada", count: matches.filter((m) => [420, 440].includes(m.queueId)).length },
    { key: "normal", label: "Normal", count: matches.filter((m) => [400, 430].includes(m.queueId)).length },
    { key: "aram", label: "ARAM", count: matches.filter((m) => m.queueId === 450).length },
  ];

  return (
    <div className="flex items-center gap-2 mb-4">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => setFilter(f.key)}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            filter === f.key
              ? "bg-moss-800/50 text-white border border-moss-600/50"
              : "bg-moss-900/30 text-moss-500 border border-moss-800/30 hover:bg-moss-800/30 hover:text-moss-400"
          }`}
        >
          {f.label}
          <span className="ml-2 text-[10px] opacity-70">{f.count}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// MATCH CARD - Simplified design
// ============================================================================
function MatchCard({
  match,
  index,
  puuid,
  platform,
  gameName,
  tagLine,
}: {
  match: RecentMatch;
  index: number;
  puuid: string;
  platform: string;
  gameName: string;
  tagLine: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Date(timestamp).toLocaleDateString("pt-BR");
  };

  const getQueueName = (queueId: number) => {
    const queues: Record<number, string> = {
      420: "Ranked Solo",
      440: "Ranked Flex",
      400: "Normal",
      430: "Blind",
      450: "ARAM",
      900: "URF",
    };
    return queues[queueId] || "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`rounded-lg border transition-all ${
        match.win
          ? "bg-[#0d1a0d]/80 border-green-900/30 hover:border-green-800/50"
          : "bg-[#1a0d0d]/80 border-red-900/30 hover:border-red-800/50"
      }`}
    >
      <div
        className="flex items-center gap-4 p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Champion */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            <img
              src={`${DDRAGON_BASE}/champion/${match.championName}.png`}
              alt={match.championName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{match.championName}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                match.win
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {match.win ? "VITÓRIA" : "DERROTA"}
            </span>
            <span className="text-[10px] text-moss-600">{getQueueName(match.queueId)}</span>
          </div>

          <div className="flex items-center gap-3 mt-1 text-sm">
            <span className="font-mono text-white">
              {match.kills}/<span className="text-red-400">{match.deaths}</span>/{match.assists}
            </span>
            <span className="text-moss-500">{match.kda} KDA</span>
            <span className="text-moss-500">{match.cs} CS ({match.csPerMin}/min)</span>
          </div>
        </div>

        {/* Items */}
        <div className="hidden sm:flex gap-0.5">
          {match.items.slice(0, 6).map((itemId, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded bg-moss-900/50 border border-moss-800/30 overflow-hidden"
            >
              {itemId > 0 && (
                <img src={`${DDRAGON_BASE}/item/${itemId}.png`} alt="" className="w-full h-full" />
              )}
            </div>
          ))}
        </div>

        {/* Time */}
        <div className="text-right">
          <p className="text-xs text-moss-500">{getTimeAgo(match.gameStartTimestamp)}</p>
          <p className="text-[10px] text-moss-600">{formatDuration(match.gameDuration)}</p>
        </div>

        {/* Expand */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-moss-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      {/* Expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 border-t border-moss-800/20">
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div className="text-center p-2 rounded bg-moss-900/30">
                  <p className="text-sm font-bold text-white">{match.damage.toLocaleString()}</p>
                  <p className="text-[9px] text-moss-500">Dano</p>
                </div>
                <div className="text-center p-2 rounded bg-moss-900/30">
                  <p className="text-sm font-bold text-yellow-500">{match.goldEarned.toLocaleString()}</p>
                  <p className="text-[9px] text-moss-500">Ouro</p>
                </div>
                <div className="text-center p-2 rounded bg-moss-900/30">
                  <p className="text-sm font-bold text-white">{match.visionScore}</p>
                  <p className="text-[9px] text-moss-500">Visão</p>
                </div>
                <div className="text-center p-2 rounded bg-moss-900/30">
                  <p className="text-sm font-bold text-white">{match.position || "—"}</p>
                  <p className="text-[9px] text-moss-500">Posição</p>
                </div>
              </div>

              <Link
                href={`/match/${match.matchId}?platform=${platform}&puuid=${puuid}&gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-moss-800/40 border border-moss-700/30 text-moss-300 hover:bg-moss-700/50 hover:text-white transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver análise completa
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// MATCH HISTORY
// ============================================================================
function MatchHistory({
  matches,
  loading,
  puuid,
  platform,
  gameName,
  tagLine,
}: {
  matches: RecentMatch[];
  loading: boolean;
  puuid: string;
  platform: string;
  gameName: string;
  tagLine: string;
}) {
  const [filter, setFilter] = useState<MatchFilter>("all");

  const filteredMatches = useMemo(() => {
    switch (filter) {
      case "ranked":
        return matches.filter((m) => [420, 440].includes(m.queueId));
      case "normal":
        return matches.filter((m) => [400, 430].includes(m.queueId));
      case "aram":
        return matches.filter((m) => m.queueId === 450);
      default:
        return matches;
    }
  }, [matches, filter]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-moss-900/20 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-[family-name:var(--font-display)] font-bold text-white">
          Histórico de Partidas
        </h2>
        <span className="text-xs text-moss-500">{filteredMatches.length} partidas</span>
      </div>

      <MatchFilters filter={filter} setFilter={setFilter} matches={matches} />

      {filteredMatches.length === 0 ? (
        <div className="text-center py-8 text-moss-500">
          Nenhuma partida encontrada
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMatches.map((match, i) => (
            <MatchCard
              key={match.matchId}
              match={match}
              index={i}
              puuid={puuid}
              platform={platform}
              gameName={gameName}
              tagLine={tagLine}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// LOADING
// ============================================================================
function LoadingSkeleton() {
  return (
    <div className="pt-20 px-6 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="h-48 bg-moss-900/30 rounded-xl animate-pulse mb-8" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-moss-900/20 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ERROR
// ============================================================================
function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-950/50 border border-red-800/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Invocador não encontrado</h2>
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
// MAIN
// ============================================================================
export default function ProfilePage() {
  const params = useParams();
  const gameName = decodeURIComponent(params.gameName as string);
  const tagLine = decodeURIComponent(params.tagLine as string);

  const [profile, setProfile] = useState<SummonerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(
          `/api/summoner?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Erro ao buscar invocador");
          return;
        }

        setProfile(data);
      } catch {
        setError("Erro de conexão");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [gameName, tagLine]);

  useEffect(() => {
    async function fetchMatches() {
      if (!profile) return;

      try {
        const response = await fetch(
          `/api/matches?puuid=${profile.account.puuid}&platform=${profile.region}&count=20`
        );
        const data = await response.json();

        if (response.ok && data.matches) {
          setRecentMatches(data.matches);
        }
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setMatchesLoading(false);
      }
    }

    fetchMatches();
  }, [profile]);

  return (
    <div className="relative min-h-screen">
      <Background />
      <Header />

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} />
      ) : profile ? (
        <div className="relative z-10 pt-20 px-4 sm:px-6 pb-12">
          <div className="max-w-5xl mx-auto">
            <ProfileHeader profile={profile} matches={recentMatches} />
            <MatchHistory
              matches={recentMatches}
              loading={matchesLoading}
              puuid={profile.account.puuid}
              platform={profile.region}
              gameName={gameName}
              tagLine={tagLine}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
