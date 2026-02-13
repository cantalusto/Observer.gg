import { NextRequest, NextResponse } from "next/server";
import { getSummonerProfile } from "@/lib/riot-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: "gameName and tagLine are required" },
      { status: 400 }
    );
  }

  try {
    const profile = await getSummonerProfile(gameName, tagLine);

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching summoner:", error);

    const message = error instanceof Error ? error.message : "Failed to fetch summoner";

    // Check for common Riot API errors
    if (message.includes("404") || message.includes("not found")) {
      return NextResponse.json(
        { error: "Invocador não encontrado" },
        { status: 404 }
      );
    }

    if (message.includes("403") || message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "API Key inválida ou expirada" },
        { status: 403 }
      );
    }

    if (message.includes("429") || message.includes("rate")) {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente em alguns segundos." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
