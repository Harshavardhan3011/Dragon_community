import { NextResponse } from "next/server";
import { getLiveStream } from "@/lib/youtube";

export async function GET() {
  try {
    const data = await getLiveStream();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("GET /api/youtube/live error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch live stream." },
      { status: 500 }
    );
  }
}
