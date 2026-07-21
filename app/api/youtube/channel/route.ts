import { NextResponse } from "next/server";
import { getChannelInfo } from "@/lib/youtube";

export async function GET() {
  try {
    const data = await getChannelInfo();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("GET /api/youtube/channel error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch YouTube channel." },
      { status: 500 }
    );
  }
}
