import fs from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";

// Fallback defaults in case DB settings are not configured yet
const DEFAULT_API_KEY = process.env.YOUTUBE_API_KEY || "AIzaSyCHqAtE_z65T5SXPPZCHlSjbXgaml8AXWk";
const DEFAULT_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UCDVH5IWCNZ5e0lVkmtXpPTA";

const CACHE_DIR = path.join(process.cwd(), "tmp");
const CACHE_FILE = path.join(CACHE_DIR, "youtube-cache.json");

interface CacheEntry {
  expiresAt: number;
  data: any;
}

interface YouTubeConfig {
  apiKey: string;
  channelId: string;
  cacheTime: number; // in minutes
  videosPerPage: number;
  enableShorts: boolean;
  enableLive: boolean;
  enablePlaylists: boolean;
  enableFeatured: boolean;
}

// ─── Fetch YouTube Settings ──────────────────────────────────────────
export async function getYouTubeConfig(): Promise<YouTubeConfig> {
  try {
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

    return {
      apiKey: getVal("youtube_api_key", DEFAULT_API_KEY),
      channelId: getVal("youtube_channel_id", DEFAULT_CHANNEL_ID),
      cacheTime: parseInt(getVal("youtube_cache_time", "15"), 10),
      videosPerPage: parseInt(getVal("youtube_videos_per_page", "12"), 10),
      enableShorts: getVal("youtube_enable_shorts", "true") === "true",
      enableLive: getVal("youtube_enable_live", "true") === "true",
      enablePlaylists: getVal("youtube_enable_playlists", "true") === "true",
      enableFeatured: getVal("youtube_enable_featured", "true") === "true",
    };
  } catch (err) {
    console.warn("Failed to load YouTube config from DB, using fallback env:", err);
    return {
      apiKey: DEFAULT_API_KEY,
      channelId: DEFAULT_CHANNEL_ID,
      cacheTime: 15,
      videosPerPage: 12,
      enableShorts: true,
      enableLive: true,
      enablePlaylists: true,
      enableFeatured: true,
    };
  }
}

// ─── Duration Parser (ISO 8601) ──────────────────────────────────────
export function parseDuration(durationStr: string): { seconds: number; formatted: string } {
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return { seconds: 0, formatted: "0:00" };
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  let formatted = "";
  if (hours > 0) {
    formatted += `${hours}:${minutes.toString().padStart(2, "0")}:`;
  } else {
    formatted += `${minutes}:`;
  }
  formatted += seconds.toString().padStart(2, "0");
  return { seconds: totalSeconds, formatted };
}

// ─── File Caching Utility ───────────────────────────────────────────
function readCache(): Record<string, CacheEntry> {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    if (!fs.existsSync(CACHE_FILE)) {
      return {};
    }
    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

function writeCache(cache: Record<string, CacheEntry>) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write YouTube cache file:", err);
  }
}

export function getCachedData(key: string): any | null {
  const cache = readCache();
  const entry = cache[key];
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data;
  }
  return null;
}

export function getExpiredFallbackData(key: string): any | null {
  const cache = readCache();
  const entry = cache[key];
  return entry ? entry.data : null;
}

export function setCachedData(key: string, data: any, cacheTimeMinutes: number) {
  const cache = readCache();
  cache[key] = {
    expiresAt: Date.now() + cacheTimeMinutes * 60 * 1000,
    data,
  };
  writeCache(cache);
}

// ─── Generic YouTube Fetcher (with Cache + Quota Fallback) ───────────
async function fetchYouTubeAPI(endpoint: string, queryParams: Record<string, string>): Promise<any> {
  const config = await getYouTubeConfig();
  const cacheKey = `${endpoint}_${JSON.stringify(queryParams)}`;

  // 1. Check Active Cache
  const active = getCachedData(cacheKey);
  if (active) return active;

  // 2. Fetch fresh
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  url.searchParams.append("key", config.apiKey);
  for (const [k, v] of Object.entries(queryParams)) {
    url.searchParams.append(k, v);
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 0 }, // handle caching manually inside our file
    });
    
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const errorMsg = errorJson?.error?.message || `HTTP error ${res.status}`;
      throw new Error(errorMsg);
    }

    const data = await res.json();
    
    // Cache the successful response
    setCachedData(cacheKey, data, config.cacheTime);
    return data;
  } catch (err) {
    console.warn(`YouTube API Fetch Failed for "${endpoint}". Attempting expired cache fallback:`, err);
    
    // 3. Fallback to Expired Cache (Quota Exceeded Recovery)
    const expired = getExpiredFallbackData(cacheKey);
    if (expired) {
      console.log(`Successfully recovered expired cache data for key "${cacheKey}"`);
      return expired;
    }

    // 4. Critical failure: no cache at all
    throw err;
  }
}

// ─── YouTube Specific Methods ────────────────────────────────────────

export async function getChannelInfo() {
  const config = await getYouTubeConfig();
  const data = await fetchYouTubeAPI("channels", {
    part: "snippet,statistics,brandingSettings,contentDetails",
    id: config.channelId,
  });

  if (!data?.items?.[0]) {
    throw new Error("Channel not found.");
  }

  const channel = data.items[0];
  return {
    title: channel.snippet.title,
    handle: channel.snippet.customUrl,
    description: channel.snippet.description,
    logo: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
    banner: channel.brandingSettings?.image?.bannerExternalUrl || "",
    subscribers: parseInt(channel.statistics.subscriberCount || "0", 10),
    views: parseInt(channel.statistics.viewCount || "0", 10),
    videosCount: parseInt(channel.statistics.videoCount || "0", 10),
    publishedAt: channel.snippet.publishedAt,
    country: channel.snippet.country || "",
    uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads || "",
  };
}

export async function getVideosList(maxResults = 24) {
  const channelInfo = await getChannelInfo();
  if (!channelInfo.uploadsPlaylistId) {
    return [];
  }

  // Get items in uploads playlist
  const playlistData = await fetchYouTubeAPI("playlistItems", {
    part: "snippet,contentDetails",
    playlistId: channelInfo.uploadsPlaylistId,
    maxResults: String(maxResults),
  });

  const items = playlistData?.items || [];
  if (items.length === 0) return [];

  const videoIds = items.map((item: any) => item.contentDetails.videoId);
  
  // Fetch detailed statistics & duration for these videos
  const videosData = await fetchYouTubeAPI("videos", {
    part: "snippet,statistics,contentDetails",
    id: videoIds.join(","),
  });

  const detailItems = videosData?.items || [];

  return items.map((item: any) => {
    const videoId = item.contentDetails.videoId;
    const details = detailItems.find((d: any) => d.id === videoId);
    const rawDuration = details?.contentDetails?.duration || "PT0S";
    const durationInfo = parseDuration(rawDuration);

    return {
      id: videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
      duration: durationInfo.formatted,
      durationSeconds: durationInfo.seconds,
      views: parseInt(details?.statistics?.viewCount || "0", 10),
    };
  });
}

export async function getPlaylistsList() {
  const config = await getYouTubeConfig();
  const data = await fetchYouTubeAPI("playlists", {
    part: "snippet,contentDetails",
    channelId: config.channelId,
    maxResults: "10",
  });

  const items = data?.items || [];
  return items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
    videoCount: parseInt(item.contentDetails?.itemCount || "0", 10),
    publishedAt: item.snippet.publishedAt,
  }));
}

export async function getLiveStream() {
  const config = await getYouTubeConfig();
  const data = await fetchYouTubeAPI("search", {
    part: "snippet",
    channelId: config.channelId,
    type: "video",
    eventType: "live",
    maxResults: "1",
  });

  const item = data?.items?.[0];
  if (!item) return null;

  return {
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
    publishedAt: item.snippet.publishedAt,
  };
}

export async function getUpcomingStream() {
  const config = await getYouTubeConfig();
  const data = await fetchYouTubeAPI("search", {
    part: "snippet",
    channelId: config.channelId,
    type: "video",
    eventType: "upcoming",
    maxResults: "2",
  });

  const items = data?.items || [];
  return items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
    publishedAt: item.snippet.publishedAt,
  }));
}

export async function searchChannelVideos(query: string) {
  const config = await getYouTubeConfig();
  const data = await fetchYouTubeAPI("search", {
    part: "snippet",
    channelId: config.channelId,
    type: "video",
    q: query,
    maxResults: "24",
  });

  const items = data?.items || [];
  if (items.length === 0) return [];

  const videoIds = items.map((item: any) => item.id.videoId).filter(Boolean);
  if (videoIds.length === 0) return [];

  // Fetch view count statistics for search results
  const videosData = await fetchYouTubeAPI("videos", {
    part: "snippet,statistics,contentDetails",
    id: videoIds.join(","),
  });

  const detailItems = videosData?.items || [];

  return items.map((item: any) => {
    const videoId = item.id.videoId;
    const details = detailItems.find((d: any) => d.id === videoId);
    const rawDuration = details?.contentDetails?.duration || "PT0S";
    const durationInfo = parseDuration(rawDuration);

    return {
      id: videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
      duration: durationInfo.formatted,
      durationSeconds: durationInfo.seconds,
      views: parseInt(details?.statistics?.viewCount || "0", 10),
    };
  });
}
