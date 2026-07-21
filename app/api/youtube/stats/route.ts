import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getChannelInfo } from "@/lib/youtube";

const CACHE_MINUTES = 10;

// Default fallbacks in case no cache exists and API fails
const DEFAULT_STATS = {
  subscribers: 10000,
  views: 1000000,
  videos: 500,
  community: 5000,
  lastSynced: new Date().toISOString(),
};

export async function GET() {
  try {
    // 1. Fetch current settings from database
    const settings = await db.siteSetting.findMany({
      where: {
        key: {
          in: [
            "site_subscribers_count",
            "site_views_count",
            "site_videos_count",
            "site_youtube_last_synced",
          ],
        },
      },
    });

    const getVal = (key: string): string | null => {
      const match = settings.find((s) => s.key === key);
      return match ? match.value : null;
    };

    const cachedSubscribers = getVal("site_subscribers_count");
    const cachedViews = getVal("site_views_count");
    const cachedVideos = getVal("site_videos_count");
    const cachedLastSynced = getVal("site_youtube_last_synced");

    const now = Date.now();
    const lastSyncedTime = cachedLastSynced ? new Date(cachedLastSynced).getTime() : 0;
    const cacheExpired = now - lastSyncedTime > CACHE_MINUTES * 60 * 1000;

    // 2. If expired or empty, try to fetch fresh from YouTube Data API
    if (!cachedLastSynced || cacheExpired) {
      try {
        const fresh = await getChannelInfo();
        
        const keys = {
          site_subscribers_count: String(fresh.subscribers),
          site_views_count: String(fresh.views),
          site_videos_count: String(fresh.videosCount),
          site_youtube_last_synced: new Date().toISOString(),
        };

        // Write fresh stats to database SiteSetting
        for (const [key, value] of Object.entries(keys)) {
          await db.siteSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          });
        }

        return NextResponse.json({
          success: true,
          data: {
            subscribers: fresh.subscribers,
            views: fresh.views,
            videos: fresh.videosCount,
            community: DEFAULT_STATS.community, // Option community stat is static/env-driven
            lastSynced: keys.site_youtube_last_synced,
          },
        });
      } catch (apiErr) {
        console.warn("YouTube API stats fetch failed. Serving cached values:", apiErr);
      }
    }

    // 3. Serve from database cache
    if (cachedSubscribers && cachedViews && cachedVideos) {
      return NextResponse.json({
        success: true,
        data: {
          subscribers: parseInt(cachedSubscribers, 10),
          views: parseInt(cachedViews, 10),
          videos: parseInt(cachedVideos, 10),
          community: DEFAULT_STATS.community,
          lastSynced: cachedLastSynced || new Date().toISOString(),
        },
      });
    }

    // 4. Ultimate fallback if both API and DB cache are empty
    return NextResponse.json({
      success: true,
      data: DEFAULT_STATS,
    });
  } catch (err: any) {
    console.error("GET /api/youtube/stats fatal error:", err);
    // Never crash
    return NextResponse.json({
      success: true,
      data: DEFAULT_STATS,
    });
  }
}
