import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const LEADERBOARD_KEY = "lol:leaderboard";
const MAX_ENTRIES = 50;

export type LeaderboardEntry = {
  username: string;
  score: number;
  total: number;
  date: string;
};

function parseEntries(raw: string[]): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = [];
  for (let i = 0; i < raw.length; i += 2) {
    try {
      const entry =
        typeof raw[i] === "string" ? JSON.parse(raw[i]) : raw[i];
      entries.push(entry);
    } catch {
      // skip malformed
    }
  }
  return entries;
}

export async function GET() {
  try {
    const redis = getRedis();
    if (!redis) return NextResponse.json([]);

    const raw = await redis.zrange<string[]>(LEADERBOARD_KEY, 0, MAX_ENTRIES - 1, {
      rev: true,
      withScores: true,
    });

    return NextResponse.json(parseEntries(raw));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const redis = getRedis();
    if (!redis) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await req.json();
    const { username, score, total } = body;

    if (!username || score === undefined || !total) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const entry: LeaderboardEntry = {
      username,
      score: Number(score),
      total: Number(total),
      date: new Date().toISOString(),
    };

    const member = JSON.stringify(entry);
    await redis.zadd(LEADERBOARD_KEY, {
      score: entry.score * 1000 + (Date.now() % 1000),
      member,
    });

    // Trim to max entries
    const count = await redis.zcard(LEADERBOARD_KEY);
    if (count > MAX_ENTRIES) {
      await redis.zremrangebyrank(LEADERBOARD_KEY, 0, count - MAX_ENTRIES - 1);
    }

    const raw = await redis.zrange<string[]>(LEADERBOARD_KEY, 0, MAX_ENTRIES - 1, {
      rev: true,
      withScores: true,
    });

    return NextResponse.json(parseEntries(raw), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}
