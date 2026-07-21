import { NextRequest, NextResponse } from "next/server";
import { getVideosList } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));
    const filterShorts = searchParams.get("filterShorts") !== "false"; // default true

    let videos = await getVideosList(50); // fetch more to allow filtering of shorts

    if (filterShorts) {
      videos = videos.filter((v: any) => v.durationSeconds > 60);
    }

    // Limit to requested count
    const sliced = videos.slice(0, limit);

    return NextResponse.json({ success: true, data: sliced });
  } catch (err: any) {
    console.error("GET /api/youtube/videos error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch YouTube videos list." },
      { status: 500 }
    );
  }
}
