import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";

// ─── GET /api/admin/youtube-settings ────────────────────────────────
export async function GET() {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const settings = await db.siteSetting.findMany({
      where: {
        key: {
          startsWith: "youtube_",
        },
      },
    });

    const getVal = (key: string, fallback: string): string => {
      const match = settings.find((s) => s.key === key);
      return match ? match.value : fallback;
    };

    return NextResponse.json({
      success: true,
      data: {
        apiKey: getVal("youtube_api_key", ""),
        channelId: getVal("youtube_channel_id", "UCDVH5IWCNZ5e0lVkmtXpPTA"),
        cacheTime: getVal("youtube_cache_time", "15"),
        videosPerPage: getVal("youtube_videos_per_page", "12"),
        enableShorts: getVal("youtube_enable_shorts", "true") === "true",
        enableLive: getVal("youtube_enable_live", "true") === "true",
        enablePlaylists: getVal("youtube_enable_playlists", "true") === "true",
        enableFeatured: getVal("youtube_enable_featured", "true") === "true",
      },
    });
  } catch (err: any) {
    console.error("GET /api/admin/youtube-settings error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch YouTube settings." },
      { status: 500 }
    );
  }
}

// ─── POST /api/admin/youtube-settings ───────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();

    const keys = {
      youtube_api_key: body.apiKey ? sanitizeInput(body.apiKey.trim()) : "",
      youtube_channel_id: body.channelId ? sanitizeInput(body.channelId.trim()) : "UCDVH5IWCNZ5e0lVkmtXpPTA",
      youtube_cache_time: String(body.cacheTime || "15"),
      youtube_videos_per_page: String(body.videosPerPage || "12"),
      youtube_enable_shorts: body.enableShorts ? "true" : "false",
      youtube_enable_live: body.enableLive ? "true" : "false",
      youtube_enable_playlists: body.enablePlaylists ? "true" : "false",
      youtube_enable_featured: body.enableFeatured ? "true" : "false",
    };

    // Upsert each key in database
    for (const [key, value] of Object.entries(keys)) {
      await db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    // After updating configs, clean cache file by deleting it so new settings apply instantly
    const cacheFile = require("path").join(process.cwd(), "tmp", "youtube-cache.json");
    if (require("fs").existsSync(cacheFile)) {
      try {
        require("fs").unlinkSync(cacheFile);
      } catch (e) {
        console.warn("Failed to delete cache file during settings save:", e);
      }
    }

    return NextResponse.json({ success: true, message: "YouTube configuration saved successfully." });
  } catch (err: any) {
    console.error("POST /api/admin/youtube-settings error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save YouTube settings." },
      { status: 500 }
    );
  }
}
