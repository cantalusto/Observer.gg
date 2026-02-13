import { NextRequest, NextResponse } from "next/server";
import { getMatch } from "@/lib/riot-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const platform = searchParams.get("platform");

  if (!matchId || !platform) {
    return NextResponse.json(
      { error: "matchId and platform are required" },
      { status: 400 }
    );
  }

  try {
    const match = await getMatch(matchId, platform);

    if (!match) {
      return NextResponse.json(
        { error: "Partida não encontrada" },
        { status: 404 }
      );
    }

    // Process participants data
    const participants = match.info.participants.map((p) => {
      const cs = p.totalMinionsKilled + p.neutralMinionsKilled;
      const gameDurationMinutes = match.info.gameDuration / 60;
      const kda = p.deaths === 0
        ? p.kills + p.assists
        : (p.kills + p.assists) / p.deaths;

      return {
        puuid: p.puuid,
        summonerName: p.riotIdGameName || p.summonerName,
        tagLine: p.riotIdTagline || "",
        championId: p.championId,
        championName: p.championName,
        championLevel: (p as any).champLevel || 0,
        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,
        kda: Math.round(kda * 100) / 100,
        cs,
        csPerMin: Math.round((cs / gameDurationMinutes) * 10) / 10,
        visionScore: p.visionScore,
        wardsPlaced: (p as any).wardsPlaced || 0,
        wardsKilled: (p as any).wardsKilled || 0,
        controlWardsPlaced: (p as any).detectorWardsPlaced || 0,
        goldEarned: p.goldEarned,
        goldPerMin: Math.round((p.goldEarned / gameDurationMinutes) * 10) / 10,
        totalDamageDealt: p.totalDamageDealtToChampions,
        totalDamageTaken: (p as any).totalDamageTaken || 0,
        totalHeal: (p as any).totalHeal || 0,
        damagePerMin: Math.round((p.totalDamageDealtToChampions / gameDurationMinutes) * 10) / 10,
        win: p.win,
        teamId: (p as any).teamId || (p.win ? 100 : 200),
        position: p.teamPosition || p.lane || "",
        items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],
        summoners: [p.summoner1Id, p.summoner2Id],
        perks: p.perks,
        // Combat stats
        doubleKills: (p as any).doubleKills || 0,
        tripleKills: (p as any).tripleKills || 0,
        quadraKills: (p as any).quadraKills || 0,
        pentaKills: (p as any).pentaKills || 0,
        firstBloodKill: (p as any).firstBloodKill || false,
        firstBloodAssist: (p as any).firstBloodAssist || false,
        turretKills: (p as any).turretKills || 0,
        inhibitorKills: (p as any).inhibitorKills || 0,
        // Additional stats
        largestKillingSpree: (p as any).largestKillingSpree || 0,
        largestMultiKill: (p as any).largestMultiKill || 0,
        killingSprees: (p as any).killingSprees || 0,
      };
    });

    // Separate teams
    const team1 = participants.filter((p) => p.teamId === 100);
    const team2 = participants.filter((p) => p.teamId === 200);

    // Calculate team stats
    const team1Stats = {
      teamId: 100,
      win: team1[0]?.win || false,
      totalKills: team1.reduce((sum, p) => sum + p.kills, 0),
      totalDeaths: team1.reduce((sum, p) => sum + p.deaths, 0),
      totalAssists: team1.reduce((sum, p) => sum + p.assists, 0),
      totalGold: team1.reduce((sum, p) => sum + p.goldEarned, 0),
      totalDamage: team1.reduce((sum, p) => sum + p.totalDamageDealt, 0),
      objectives: (match.info as any).teams?.find((t: any) => t.teamId === 100)?.objectives || {},
    };

    const team2Stats = {
      teamId: 200,
      win: team2[0]?.win || false,
      totalKills: team2.reduce((sum, p) => sum + p.kills, 0),
      totalDeaths: team2.reduce((sum, p) => sum + p.deaths, 0),
      totalAssists: team2.reduce((sum, p) => sum + p.assists, 0),
      totalGold: team2.reduce((sum, p) => sum + p.goldEarned, 0),
      totalDamage: team2.reduce((sum, p) => sum + p.totalDamageDealt, 0),
      objectives: (match.info as any).teams?.find((t: any) => t.teamId === 200)?.objectives || {},
    };

    return NextResponse.json({
      matchId: match.metadata.matchId,
      gameMode: match.info.gameMode,
      gameType: match.info.gameType,
      queueId: match.info.queueId,
      gameDuration: match.info.gameDuration,
      gameStartTimestamp: match.info.gameStartTimestamp,
      gameEndTimestamp: match.info.gameEndTimestamp,
      teams: {
        blue: { ...team1Stats, participants: team1 },
        red: { ...team2Stats, participants: team2 },
      },
    });
  } catch (error) {
    console.error("Error fetching match details:", error);

    const message = error instanceof Error ? error.message : "Failed to fetch match";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
