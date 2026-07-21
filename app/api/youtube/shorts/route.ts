import { NextRequest, NextResponse } from "next/server";
import { getVideosList } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    const videos = await getVideosList(50); // fetch more to increase chances of finding shorts
    const shorts = videos.filter((v: any) => v.durationSeconds > 0 && v.durationSeconds <= 60);

    return NextResponse.json({ success: true, data: shorts.slice(0, limit) });
  } catch (err: any) {
    console.error("GET /api/youtube/shorts error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch Shorts list." },
      { status: 500 }
    );
  }
}
