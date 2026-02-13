import { NextRequest, NextResponse } from "next/server";
import { getRecentMatches } from "@/lib/riot-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const puuid = searchParams.get("puuid");
  const platform = searchParams.get("platform");
  const count = searchParams.get("count");

  if (!puuid || !platform) {
    return NextResponse.json(
      { error: "puuid and platform are required" },
      { status: 400 }
    );
  }

  try {
    const matches = await getRecentMatches(
      puuid,
      platform,
      count ? parseInt(count) : 10
    );

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Error fetching matches:", error);

    const message = error instanceof Error ? error.message : "Failed to fetch matches";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
