// Riot API Integration
// Documentation: https://developer.riotgames.com/apis

const RIOT_API_KEY = process.env.RIOT_API_KEY;

// Regional routing for Account API
const ACCOUNT_REGIONS = {
  americas: "americas.api.riotgames.com",
  europe: "europe.api.riotgames.com",
  asia: "asia.api.riotgames.com",
} as const;

// Platform routing for Summoner/Match APIs
const PLATFORM_REGIONS = {
  BR1: "br1.api.riotgames.com",
  EUN1: "eun1.api.riotgames.com",
  EUW1: "euw1.api.riotgames.com",
  JP1: "jp1.api.riotgames.com",
  KR: "kr.api.riotgames.com",
  LA1: "la1.api.riotgames.com",
  LA2: "la2.api.riotgames.com",
  NA1: "na1.api.riotgames.com",
  OC1: "oc1.api.riotgames.com",
  PH2: "ph2.api.riotgames.com",
  RU: "ru.api.riotgames.com",
  SG2: "sg2.api.riotgames.com",
  TH2: "th2.api.riotgames.com",
  TR1: "tr1.api.riotgames.com",
  TW2: "tw2.api.riotgames.com",
  VN2: "vn2.api.riotgames.com",
} as const;

// Try to guess account region from tag, but will try all if not found
function guessAccountRegion(tag: string): keyof typeof ACCOUNT_REGIONS {
  const upperTag = tag.toUpperCase();
  if (["NA", "BR", "LA", "OC"].some(r => upperTag.includes(r))) {
    return "americas";
  }
  if (["EUW", "EUN", "TR", "RU"].some(r => upperTag.includes(r))) {
    return "europe";
  }
  if (["KR", "JP", "TW", "VN", "TH", "SG", "PH"].some(r => upperTag.includes(r))) {
    return "asia";
  }
  // Default to americas for BR players
  return "americas";
}

// Map tag to platform region
function getPlatformRegion(tag: string): keyof typeof PLATFORM_REGIONS {
  const upperTag = tag.toUpperCase();

  if (upperTag.includes("BR")) return "BR1";
  if (upperTag.includes("EUN")) return "EUN1";
  if (upperTag.includes("EUW")) return "EUW1";
  if (upperTag.includes("JP")) return "JP1";
  if (upperTag.includes("KR")) return "KR";
  if (upperTag.includes("LA1")) return "LA1";
  if (upperTag.includes("LA2")) return "LA2";
  if (upperTag.includes("NA")) return "NA1";
  if (upperTag.includes("OC")) return "OC1";
  if (upperTag.includes("RU")) return "RU";
  if (upperTag.includes("TR")) return "TR1";

  // Default to NA if can't determine
  return "NA1";
}

export type RiotAccount = {
  puuid: string;
  gameName: string;
  tagLine: string;
};

export type Summoner = {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
};

export type LeagueEntry = {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
};

export type SummonerProfile = {
  account: RiotAccount;
  summoner: Summoner;
  leagues: LeagueEntry[];
  region: string;
};

async function riotFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "X-Riot-Token": RIOT_API_KEY!,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.status?.message || `Riot API error: ${response.status}`);
  }

  return response.json();
}

// Get account by Riot ID (gameName#tagLine) - tries all regions if needed
export async function getAccountByRiotId(gameName: string, tagLine: string): Promise<RiotAccount & { accountRegion: string }> {
  const guessedRegion = guessAccountRegion(tagLine);
  const regionsToTry: (keyof typeof ACCOUNT_REGIONS)[] = [
    guessedRegion,
    ...Object.keys(ACCOUNT_REGIONS).filter(r => r !== guessedRegion) as (keyof typeof ACCOUNT_REGIONS)[]
  ];

  let lastError: Error | null = null;

  for (const region of regionsToTry) {
    const host = ACCOUNT_REGIONS[region];
    const url = `https://${host}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

    try {
      const account = await riotFetch<RiotAccount>(url);
      return { ...account, accountRegion: region };
    } catch (error) {
      lastError = error as Error;
      // If it's not a 404, throw immediately (rate limit, auth error, etc)
      if (!lastError.message.includes("404") && !lastError.message.includes("not found")) {
        throw lastError;
      }
      // Otherwise continue to next region
    }
  }

  throw lastError || new Error("Account not found in any region");
}

// Map account region to possible platform regions
const ACCOUNT_TO_PLATFORMS: Record<string, (keyof typeof PLATFORM_REGIONS)[]> = {
  americas: ["BR1", "NA1", "LA1", "LA2", "OC1"],
  europe: ["EUW1", "EUN1", "TR1", "RU"],
  asia: ["KR", "JP1", "TW2", "VN2", "TH2", "SG2", "PH2"],
};

// Get summoner by PUUID - tries multiple platforms if needed
export async function getSummonerByPuuid(puuid: string, accountRegion: string): Promise<Summoner & { platform: string }> {
  const platformsToTry = ACCOUNT_TO_PLATFORMS[accountRegion] || ACCOUNT_TO_PLATFORMS.americas;

  let lastError: Error | null = null;

  for (const platform of platformsToTry) {
    const host = PLATFORM_REGIONS[platform];
    const url = `https://${host}/lol/summoner/v4/summoners/by-puuid/${puuid}`;

    try {
      const summoner = await riotFetch<Summoner>(url);
      return { ...summoner, platform };
    } catch (error) {
      lastError = error as Error;
      // If it's not a 404, throw immediately
      if (!lastError.message.includes("404") && !lastError.message.includes("not found")) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error("Summoner not found in any platform");
}

// Get ranked stats by PUUID (newer endpoint)
export async function getLeagueEntriesByPuuid(puuid: string, platform: string): Promise<LeagueEntry[]> {
  const host = PLATFORM_REGIONS[platform as keyof typeof PLATFORM_REGIONS];
  if (!host) {
    console.error("[getLeagueEntriesByPuuid] Invalid platform:", platform);
    return [];
  }

  const url = `https://${host}/lol/league/v4/entries/by-puuid/${puuid}`;
  console.log("[getLeagueEntriesByPuuid] Fetching:", url);

  try {
    const data = await riotFetch<LeagueEntry[]>(url);
    console.log("[getLeagueEntriesByPuuid] Response:", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("[getLeagueEntriesByPuuid] Error:", error);
    return []; // Return empty if no ranked data
  }
}

// Get ranked stats by summoner ID (legacy endpoint)
export async function getLeagueEntries(summonerId: string, platform: string): Promise<LeagueEntry[]> {
  const host = PLATFORM_REGIONS[platform as keyof typeof PLATFORM_REGIONS];
  if (!host) {
    console.error("[getLeagueEntries] Invalid platform:", platform);
    return [];
  }

  const url = `https://${host}/lol/league/v4/entries/by-summoner/${summonerId}`;
  console.log("[getLeagueEntries] Fetching:", url);

  try {
    const data = await riotFetch<LeagueEntry[]>(url);
    console.log("[getLeagueEntries] Response:", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("[getLeagueEntries] Error:", error);
    return []; // Return empty if no ranked data
  }
}

// Get complete summoner profile
export async function getSummonerProfile(gameName: string, tagLine: string): Promise<SummonerProfile> {
  // Step 1: Get account by Riot ID (tries all regions)
  const account = await getAccountByRiotId(gameName, tagLine);
  console.log("[getSummonerProfile] Account:", JSON.stringify(account));

  // Step 2: Get summoner data (tries platforms based on account region)
  const summoner = await getSummonerByPuuid(account.puuid, account.accountRegion);
  console.log("[getSummonerProfile] Summoner:", JSON.stringify(summoner));

  // Step 3: Get ranked data using PUUID (more reliable)
  console.log("[getSummonerProfile] Fetching leagues for puuid:", account.puuid, "platform:", summoner.platform);
  const leagues = await getLeagueEntriesByPuuid(account.puuid, summoner.platform);
  console.log("[getSummonerProfile] Leagues:", JSON.stringify(leagues));

  return {
    account: {
      puuid: account.puuid,
      gameName: account.gameName,
      tagLine: account.tagLine,
    },
    summoner: {
      id: summoner.id,
      accountId: summoner.accountId,
      puuid: summoner.puuid,
      profileIconId: summoner.profileIconId,
      revisionDate: summoner.revisionDate,
      summonerLevel: summoner.summonerLevel,
    },
    leagues,
    region: summoner.platform,
  };
}

// ============================================================================
// MATCH API
// ============================================================================

// Match API uses regional routing (same as account API)
const PLATFORM_TO_MATCH_REGION: Record<string, string> = {
  BR1: "americas",
  NA1: "americas",
  LA1: "americas",
  LA2: "americas",
  OC1: "americas",
  EUW1: "europe",
  EUN1: "europe",
  TR1: "europe",
  RU: "europe",
  KR: "asia",
  JP1: "asia",
  TW2: "sea",
  VN2: "sea",
  TH2: "sea",
  SG2: "sea",
  PH2: "sea",
};

const MATCH_REGIONS: Record<string, string> = {
  americas: "americas.api.riotgames.com",
  europe: "europe.api.riotgames.com",
  asia: "asia.api.riotgames.com",
  sea: "sea.api.riotgames.com",
};

// Match types from Riot API
export type MatchParticipant = {
  puuid: string;
  summonerName: string;
  riotIdGameName: string;
  riotIdTagline: string;
  championId: number;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  visionScore: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  win: boolean;
  teamPosition: string;
  lane: string;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  summoner1Id: number;
  summoner2Id: number;
  perks: {
    styles: Array<{
      style: number;
      selections: Array<{ perk: number }>;
    }>;
  };
};

export type MatchInfo = {
  gameId: number;
  gameDuration: number;
  gameStartTimestamp: number;
  gameEndTimestamp: number;
  gameMode: string;
  gameType: string;
  queueId: number;
  participants: MatchParticipant[];
};

export type Match = {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: MatchInfo;
};

// Simplified match for our UI
export type SimpleMatch = {
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

// Get match IDs for a player
export async function getMatchIds(
  puuid: string,
  platform: string,
  count: number = 10,
  queueId?: number
): Promise<string[]> {
  const matchRegion = PLATFORM_TO_MATCH_REGION[platform] || "americas";
  const host = MATCH_REGIONS[matchRegion];

  let url = `https://${host}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`;
  if (queueId) {
    url += `&queue=${queueId}`;
  }

  try {
    return await riotFetch<string[]>(url);
  } catch {
    return [];
  }
}

// Get match details
export async function getMatch(matchId: string, platform: string): Promise<Match | null> {
  const matchRegion = PLATFORM_TO_MATCH_REGION[platform] || "americas";
  const host = MATCH_REGIONS[matchRegion];

  const url = `https://${host}/lol/match/v5/matches/${matchId}`;

  try {
    return await riotFetch<Match>(url);
  } catch {
    return null;
  }
}

// Get recent matches with details for a player
export async function getRecentMatches(
  puuid: string,
  platform: string,
  count: number = 10
): Promise<SimpleMatch[]> {
  const matchIds = await getMatchIds(puuid, platform, count);
  const matches: SimpleMatch[] = [];

  for (const matchId of matchIds) {
    const match = await getMatch(matchId, platform);
    if (!match) continue;

    const participant = match.info.participants.find(p => p.puuid === puuid);
    if (!participant) continue;

    const cs = participant.totalMinionsKilled + participant.neutralMinionsKilled;
    const gameDurationMinutes = match.info.gameDuration / 60;
    const kda = participant.deaths === 0
      ? participant.kills + participant.assists
      : (participant.kills + participant.assists) / participant.deaths;

    matches.push({
      matchId: match.metadata.matchId,
      championId: participant.championId,
      championName: participant.championName,
      kills: participant.kills,
      deaths: participant.deaths,
      assists: participant.assists,
      cs,
      visionScore: participant.visionScore,
      goldEarned: participant.goldEarned,
      damage: participant.totalDamageDealtToChampions,
      win: participant.win,
      gameDuration: match.info.gameDuration,
      gameStartTimestamp: match.info.gameStartTimestamp,
      queueId: match.info.queueId,
      position: participant.teamPosition || participant.lane,
      items: [
        participant.item0,
        participant.item1,
        participant.item2,
        participant.item3,
        participant.item4,
        participant.item5,
        participant.item6,
      ],
      summoners: [participant.summoner1Id, participant.summoner2Id],
      kda: Math.round(kda * 100) / 100,
      csPerMin: Math.round((cs / gameDurationMinutes) * 10) / 10,
    });
  }

  return matches;
}

// ============================================================================
// DATA DRAGON HELPERS
// ============================================================================

export const DDRAGON_VERSION = "16.2.1";

export function getProfileIconUrl(iconId: number): string {
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/profileicon/${iconId}.png`;
}

export function getChampionIconUrl(championName: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${championName}.png`;
}

export function getItemIconUrl(itemId: number): string {
  if (itemId === 0) return "";
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${itemId}.png`;
}

export function getSummonerSpellIconUrl(spellId: number): string {
  const spellMap: Record<number, string> = {
    1: "SummonerBoost",
    3: "SummonerExhaust",
    4: "SummonerFlash",
    6: "SummonerHaste",
    7: "SummonerHeal",
    11: "SummonerSmite",
    12: "SummonerTeleport",
    13: "SummonerMana",
    14: "SummonerDot",
    21: "SummonerBarrier",
    32: "SummonerSnowball",
  };
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${spellMap[spellId] || "SummonerFlash"}.png`;
}

export function getRankedEmblemUrl(tier: string): string {
  return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${tier.toLowerCase()}.png`;
}

export function formatGameDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days === 1) return "Ontem";
  if (days < 7) return `${days}d atrás`;
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

// Queue ID to name mapping
export function getQueueName(queueId: number): string {
  const queues: Record<number, string> = {
    420: "Ranqueada Solo",
    440: "Ranqueada Flex",
    400: "Normal Draft",
    430: "Normal Blind",
    450: "ARAM",
    900: "URF",
    1020: "One for All",
    1300: "Nexus Blitz",
    1400: "Ultimate Spellbook",
  };
  return queues[queueId] || "Partida";
}
