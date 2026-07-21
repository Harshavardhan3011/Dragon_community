import { NextRequest, NextResponse } from "next/server";
import { searchChannelVideos } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ success: true, data: [] });
    }

    const data = await searchChannelVideos(query);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("GET /api/youtube/search error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to search YouTube videos." },
      { status: 500 }
    );
  }
}
