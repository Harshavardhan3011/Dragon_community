"use client";

import { useEffect, useState } from "react";
import { Youtube, Save, RefreshCw, AlertCircle, Loader2, ShieldCheck, HelpCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";

export default function AdminYouTubeSettingsPage() {
  const { addToast } = useToast();

  // ─── State ────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    apiKey: "",
    channelId: "",
    cacheTime: "15",
    videosPerPage: "12",
    enableShorts: true,
    enableLive: true,
    enablePlaylists: true,
    enableFeatured: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/youtube-sync", {
        method: "POST",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        addToast({
          type: "success",
          title: "YouTube Synced",
          message: "Latest YouTube statistics successfully synced & cached.",
        });
      } else {
        addToast({
          type: "error",
          title: "Sync Failed",
          message: json.error || "Failed to sync YouTube stats.",
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Network Error",
        message: "Failed to connect to the sync endpoint.",
      });
    } finally {
      setSyncing(false);
    }
  };

  // ─── Fetch Settings ────────────────────────────────────────────────
  const fetchSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/youtube-settings");
      const json = await res.json();
      if (res.ok && json.success) {
        setForm(json.data);
      } else {
        setError(json.error || "Failed to load YouTube settings.");
      }
    } catch {
      setError("Failed to communicate with settings server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ─── Validate Form ────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (form.apiKey && !form.apiKey.startsWith("AIzaSy")) {
      newErrors.apiKey = "Warning: Does not look like a valid Google API key (starts with AIzaSy).";
    }
    if (!form.channelId.trim()) {
      newErrors.channelId = "Channel ID is required.";
    }
    
    const checkInt = (val: string, key: string, name: string, min = 1) => {
      const num = Number(val);
      if (!val || isNaN(num) || !Number.isInteger(num) || num < min) {
        newErrors[key] = `${name} must be an integer greater than or equal to ${min}.`;
      }
    };
    checkInt(form.cacheTime, "cacheTime", "Cache Time", 1);
    checkInt(form.videosPerPage, "videosPerPage", "Videos Per Page", 1);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Save Settings ────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/youtube-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        addToast({
          type: "success",
          title: "Settings Saved",
          message: "YouTube configuration has been updated and caches cleared.",
        });
        fetchSettings();
      } else {
        addToast({
          type: "error",
          title: "Save Failed",
          message: json.error || "Failed to save settings.",
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Network Error",
        message: "Failed to connect to the settings endpoint.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs text-dragon-text-muted font-heading uppercase tracking-wider mb-1">
            Admin / Settings
          </p>
          <h1 className="font-heading text-2xl font-bold text-dragon-text mb-1 flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-500" /> YouTube Roster Settings
          </h1>
          <p className="text-dragon-text-secondary text-sm">
            Configure Data API v3 parameters, live modules, and cache parameters.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={handleSync} disabled={syncing || loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync YouTube Data"}
          </Button>
          <Button variant="secondary" size="sm" onClick={fetchSettings} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" text="Loading settings data..." />
        </div>
      ) : error ? (
        <div className="glass-card rounded-xl p-12 text-center max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-lg text-dragon-text mb-2">Error Loading Settings</h3>
          <p className="text-dragon-text-secondary mb-6">{error}</p>
          <Button variant="primary" onClick={fetchSettings}>
            Retry
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-3xl" noValidate>
          {/* API Connection Panel */}
          <div className="glass-card rounded-xl p-6 border border-dragon-neon/10 space-y-4">
            <h2 className="font-heading text-sm font-bold text-dragon-text border-b border-dragon-neon/10 pb-3 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-dragon-neon" /> API Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5 flex items-center gap-1.5">
                  YouTube API Key
                  <span className="group relative text-dragon-text-muted cursor-help">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/95 text-[10px] text-white p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      Your Google Cloud Console credentials for YouTube Data API v3.
                    </span>
                  </span>
                </label>
                <Input
                  id="yt-key"
                  type="password"
                  placeholder="e.g. AIzaSy..."
                  value={form.apiKey}
                  onChange={(e) => setForm((prev) => ({ ...prev, apiKey: e.target.value }))}
                  disabled={saving}
                />
                {errors.apiKey && <p className="text-amber-400 text-xs mt-1">{errors.apiKey}</p>}
                <p className="text-[10px] text-dragon-text-muted mt-1.5">
                  If left empty, fallback is read from env variable YOUTUBE_API_KEY. Key is never exposed to the frontend.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5 flex items-center gap-1.5">
                  YouTube Channel ID <span className="text-red-400">*</span>
                </label>
                <Input
                  id="yt-channel"
                  placeholder="e.g. UCDVH5..."
                  value={form.channelId}
                  onChange={(e) => setForm((prev) => ({ ...prev, channelId: e.target.value }))}
                  disabled={saving}
                />
                {errors.channelId && <p className="text-red-400 text-xs mt-1">{errors.channelId}</p>}
              </div>
            </div>
          </div>

          {/* Performance & Cache */}
          <div className="glass-card rounded-xl p-6 border border-dragon-neon/10 space-y-4">
            <h2 className="font-heading text-sm font-bold text-dragon-text border-b border-dragon-neon/10 pb-3 uppercase tracking-wider">
              Cache & Performance Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Cache TTL (Minutes)
                </label>
                <Input
                  id="yt-cache"
                  type="number"
                  placeholder="15"
                  value={form.cacheTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, cacheTime: e.target.value }))}
                  disabled={saving}
                />
                {errors.cacheTime && <p className="text-red-400 text-xs mt-1">{errors.cacheTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Videos Per Page limit
                </label>
                <Input
                  id="yt-limit"
                  type="number"
                  placeholder="12"
                  value={form.videosPerPage}
                  onChange={(e) => setForm((prev) => ({ ...prev, videosPerPage: e.target.value }))}
                  disabled={saving}
                />
                {errors.videosPerPage && <p className="text-red-400 text-xs mt-1">{errors.videosPerPage}</p>}
              </div>
            </div>
          </div>

          {/* Feature toggles */}
          <div className="glass-card rounded-xl p-6 border border-dragon-neon/10 space-y-4">
            <h2 className="font-heading text-sm font-bold text-dragon-text border-b border-dragon-neon/10 pb-3 uppercase tracking-wider">
              Module Feature Toggles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer select-none bg-dragon-bg-800/20 p-3 rounded-lg border border-dragon-neon/5 hover:border-dragon-neon/10">
                <input
                  type="checkbox"
                  checked={form.enableFeatured}
                  onChange={(e) => setForm((prev) => ({ ...prev, enableFeatured: e.target.checked }))}
                  disabled={saving}
                  className="w-4 h-4 rounded accent-green-500 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-bold text-dragon-text block">Featured Video block</span>
                  <span className="text-[10px] text-dragon-text-muted">Display the latest release in header featured spot</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none bg-dragon-bg-800/20 p-3 rounded-lg border border-dragon-neon/5 hover:border-dragon-neon/10">
                <input
                  type="checkbox"
                  checked={form.enableShorts}
                  onChange={(e) => setForm((prev) => ({ ...prev, enableShorts: e.target.checked }))}
                  disabled={saving}
                  className="w-4 h-4 rounded accent-green-500 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-bold text-dragon-text block">Enable Shorts Row</span>
                  <span className="text-[10px] text-dragon-text-muted">Scan and display vertical scrollable short items</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none bg-dragon-bg-800/20 p-3 rounded-lg border border-dragon-neon/5 hover:border-dragon-neon/10">
                <input
                  type="checkbox"
                  checked={form.enableLive}
                  onChange={(e) => setForm((prev) => ({ ...prev, enableLive: e.target.checked }))}
                  disabled={saving}
                  className="w-4 h-4 rounded accent-green-500 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-bold text-dragon-text block">Enable Livestream module</span>
                  <span className="text-[10px] text-dragon-text-muted">Scan and embed active livestream players automatically</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none bg-dragon-bg-800/20 p-3 rounded-lg border border-dragon-neon/5 hover:border-dragon-neon/10">
                <input
                  type="checkbox"
                  checked={form.enablePlaylists}
                  onChange={(e) => setForm((prev) => ({ ...prev, enablePlaylists: e.target.checked }))}
                  disabled={saving}
                  className="w-4 h-4 rounded accent-green-500 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-bold text-dragon-text block">Enable Playlists Cards</span>
                  <span className="text-[10px] text-dragon-text-muted">Display horizontal scrolling collection cards</span>
                </div>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-dragon-neon/10">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Settings...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Configurations
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
