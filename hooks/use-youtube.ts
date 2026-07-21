"use client";

import { useState, useEffect, useCallback } from "react";

// In-memory client-side cache to prevent duplicate requests on route transitions
const clientCache: Record<string, { timestamp: number; data: any }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes client-side cache

function getCached(key: string) {
  const entry = clientCache[key];
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data;
  }
  return null;
}

function setCached(key: string, data: any) {
  clientCache[key] = {
    timestamp: Date.now(),
    data,
  };
}

// ─── useChannel Hook ─────────────────────────────────────────────────
export function useChannel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = "youtube_channel";
    const cached = getCached(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    fetch("/api/youtube/channel")
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.success) {
          setData(json.data);
          setCached(cacheKey, json.data);
        } else {
          setError(json.error || "Failed to load channel info.");
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Network error.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}

// ─── useVideos Hook ──────────────────────────────────────────────────
export function useVideos(limit = 24, filterShorts = true) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = `youtube_videos_${limit}_${filterShorts}`;
    const cached = getCached(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    fetch(`/api/youtube/videos?limit=${limit}&filterShorts=${filterShorts}`)
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.success) {
          setData(json.data);
          setCached(cacheKey, json.data);
        } else {
          setError(json.error || "Failed to load videos.");
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Network error.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [limit, filterShorts]);

  return { data, loading, error };
}

// ─── useFeaturedVideo Hook ───────────────────────────────────────────
export function useFeaturedVideo() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = "youtube_featured";
    const cached = getCached(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    fetch("/api/youtube/featured")
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.success) {
          setData(json.data);
          setCached(cacheKey, json.data);
        } else {
          setError(json.error || "Failed to load featured video.");
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Network error.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}

// ─── usePlaylists Hook ───────────────────────────────────────────────
export function usePlaylists() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = "youtube_playlists";
    const cached = getCached(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    fetch("/api/youtube/playlists")
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.success) {
          setData(json.data);
          setCached(cacheKey, json.data);
        } else {
          setError(json.error || "Failed to load playlists.");
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Network error.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}

// ─── useShorts Hook ──────────────────────────────────────────────────
export function useShorts(limit = 12) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = `youtube_shorts_${limit}`;
    const cached = getCached(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    fetch(`/api/youtube/shorts?limit=${limit}`)
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.success) {
          setData(json.data);
          setCached(cacheKey, json.data);
        } else {
          setError(json.error || "Failed to load Shorts.");
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Network error.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [limit]);

  return { data, loading, error };
}

// ─── useLive Hook ────────────────────────────────────────────────────
export function useLive() {
  const [liveStream, setLiveStream] = useState<any>(null);
  const [upcomingStreams, setUpcomingStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = "youtube_live_upcoming";
    const cached = getCached(cacheKey);
    if (cached) {
      setLiveStream(cached.live);
      setUpcomingStreams(cached.upcoming);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    Promise.all([
      fetch("/api/youtube/live").then((res) => res.json()),
      fetch("/api/youtube/upcoming").then((res) => res.json()),
    ])
      .then(([liveJson, upcomingJson]) => {
        if (!active) return;

        const live = liveJson.success ? liveJson.data : null;
        const upcoming = upcomingJson.success ? upcomingJson.data : [];

        setLiveStream(live);
        setUpcomingStreams(upcoming);

        setCached(cacheKey, { live, upcoming });
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load live data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { liveStream, upcomingStreams, loading, error };
}

// ─── useSearch Hook ──────────────────────────────────────────────────
export function useSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const cacheKey = `youtube_search_${query.trim()}`;
    const cached = getCached(cacheKey);
    if (cached) {
      setResults(cached);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
        setCached(cacheKey, json.data);
      } else {
        setError(json.error || "Failed to search videos.");
      }
    } catch (err: any) {
      setError(err.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}
