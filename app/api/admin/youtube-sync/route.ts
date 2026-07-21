import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { getChannelInfo } from "@/lib/youtube";

export async function POST() {
  try {
    // 1. Verify admin session
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    // 2. Clear local file cache first to make sure getChannelInfo fetches fresh data from Google
    const cacheFile = require("path").join(process.cwd(), "tmp", "youtube-cache.json");
    if (require("fs").existsSync(cacheFile)) {
      try {
        require("fs").unlinkSync(cacheFile);
      } catch (e) {
        console.warn("Failed to delete cache file during forced admin sync:", e);
      }
    }

    // 3. Force fetch channel info from YouTube API
    const fresh = await getChannelInfo();

    // 4. Save to SiteSetting database
    const keys = {
      site_subscribers_count: String(fresh.subscribers),
      site_views_count: String(fresh.views),
      site_videos_count: String(fresh.videosCount),
      site_youtube_last_synced: new Date().toISOString(),
    };

    for (const [key, value] of Object.entries(keys)) {
      await db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Forced YouTube synchronization completed successfully.",
      data: {
        subscribers: fresh.subscribers,
        views: fresh.views,
        videos: fresh.videosCount,
        lastSynced: keys.site_youtube_last_synced,
      },
    });
  } catch (err: any) {
    console.error("POST /api/admin/youtube-sync error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to synchronize YouTube data." },
      { status: 500 }
    );
  }
}
