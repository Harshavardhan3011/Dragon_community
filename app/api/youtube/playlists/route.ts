import { NextResponse } from "next/server";
import { getPlaylistsList } from "@/lib/youtube";

export async function GET() {
  try {
    const data = await getPlaylistsList();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("GET /api/youtube/playlists error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch playlists." },
      { status: 500 }
    );
  }
}
