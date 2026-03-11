import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const VIDEOS_KEY = "lol:videos";

export type SharedVideo = {
  id: string;
  title: string;
  type: "youtube";
  addedBy: string;
  addedAt: string;
};

export async function GET() {
  try {
    const redis = getRedis();
    if (!redis) return NextResponse.json([]);

    const videos = await redis.lrange<SharedVideo>(VIDEOS_KEY, 0, -1);
    return NextResponse.json(videos || []);
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
    const { id, title, type, addedBy } = body as SharedVideo;

    if (!id || !title || type !== "youtube" || !addedBy) {
      return NextResponse.json({ error: "Invalid video data" }, { status: 400 });
    }

    const existing = await redis.lrange<SharedVideo>(VIDEOS_KEY, 0, -1);
    if (existing?.some((v) => v.id === id)) {
      return NextResponse.json({ error: "Video already exists" }, { status: 409 });
    }

    const video: SharedVideo = {
      id,
      title,
      type: "youtube",
      addedBy,
      addedAt: new Date().toISOString(),
    };

    await redis.rpush(VIDEOS_KEY, video);
    return NextResponse.json(video, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add video" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const redis = getRedis();
    if (!redis) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("id");
    if (!videoId) {
      return NextResponse.json({ error: "Missing video id" }, { status: 400 });
    }

    const existing = await redis.lrange<SharedVideo>(VIDEOS_KEY, 0, -1);
    const toRemove = existing?.find((v) => v.id === videoId);
    if (toRemove) {
      await redis.lrem(VIDEOS_KEY, 1, toRemove);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove video" }, { status: 500 });
  }
}
