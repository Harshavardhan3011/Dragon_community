"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Settings,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  AlertCircle,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Clock,
  Settings2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import AdminStatCard from "@/components/admin/AdminStatCard";
import SettingsEditor, { type SettingItem } from "@/components/admin/SettingsEditor";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";

// Protected system keys that cannot be deleted or have their keys changed
const PROTECTED_KEYS = ["site_status", "maintenance_message", "last_updated"];

export default function AdminSettingsPage() {
  const { addToast } = useToast();

  // ─── State ────────────────────────────────────────────────────────
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modals
  const [editorOpen, setEditorOpen] = useState(false);
  const [editItem, setEditItem] = useState<SettingItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<SettingItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // ─── Fetch Settings ────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
      });

      const res = await fetch(`/api/admin/settings?${params}`);
      const json = await res.json();

      if (res.ok && json.success) {
        setSettings(json.data);
      } else {
        setError(json.error || "Failed to fetch settings.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ─── Toggle Maintenance Mode ──────────────────────────────────────
  const handleToggleMaintenance = async () => {
    const statusSetting = settings.find((s) => s.key === "site_status");
    if (!statusSetting) {
      addToast({
        type: "error",
        title: "Toggle Error",
        message: "Status setting 'site_status' not found in database.",
      });
      return;
    }

    const currentStatus = statusSetting.value;
    const newStatus = currentStatus === "online" ? "maintenance" : "online";

    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/admin/settings/${statusSetting.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newStatus }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        addToast({
          type: "success",
          title: "Site Status Updated",
          message: `Website status is now set to ${newStatus === "online" ? "Online" : "Maintenance Mode"}.`,
        });
        fetchSettings();
      } else {
        addToast({
          type: "error",
          title: "Update Failed",
          message: json.error || "Failed to update website status.",
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Network Error",
        message: "Failed to communicate with settings server.",
      });
    } finally {
      setStatusUpdating(false);
    }
  };

  // ─── Delete Custom Setting ────────────────────────────────────────
  const handleDeleteSetting = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/settings/${deleteItem.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (res.ok && json.success) {
        addToast({
          type: "success",
          title: "Setting Deleted",
          message: `Custom setting "${deleteItem.key}" has been deleted.`,
        });
        setDeleteItem(null);
        fetchSettings();
      } else {
        addToast({
          type: "error",
          title: "Delete Failed",
          message: json.error || "Failed to delete setting.",
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Network Error",
        message: "Failed to connect to the server.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Stats and Variables ───────────────────────────────────────────
  const statusSetting = settings.find((s) => s.key === "site_status");
  const isMaintenance = statusSetting ? statusSetting.value === "maintenance" : false;

  const lastUpdatedSetting = settings.find((s) => s.key === "last_updated");
  const lastUpdatedTime = lastUpdatedSetting ? lastUpdatedSetting.value : null;

  const totalSettings = settings.length;
  const systemSettings = settings.filter((s) => PROTECTED_KEYS.includes(s.key)).length;
  const customSettings = totalSettings - systemSettings;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs text-dragon-text-muted font-heading uppercase tracking-wider mb-1">
            Admin / Settings
          </p>
          <h1 className="font-heading text-2xl font-bold text-dragon-text mb-1">
            Site Configuration
          </h1>
          <p className="text-dragon-text-secondary text-sm">
            Control core features, toggle maintenance mode, and add custom key-value settings.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchSettings} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditItem(null);
              setEditorOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Setting
          </Button>
        </div>
      </div>

      {/* Control Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Maintenance Toggle Card */}
        <div className="glass-card rounded-xl p-5 flex flex-col justify-between min-h-[140px] border border-dragon-neon/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-dragon-neon/5 rounded-bl-full pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-heading uppercase tracking-wide text-dragon-text-muted mb-1">
                Maintenance Mode
              </p>
              <h3 className="font-heading font-bold text-lg text-dragon-text">
                {isMaintenance ? "Active (Under Maintenance)" : "Inactive (Live Online)"}
              </h3>
            </div>
            <button
              onClick={handleToggleMaintenance}
              disabled={statusUpdating || loading}
              title={isMaintenance ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
              className="p-1 rounded text-dragon-text hover:text-dragon-neon transition-colors cursor-pointer disabled:opacity-50"
            >
              {isMaintenance ? (
                <ToggleRight className="w-10 h-10 text-dragon-neon" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-dragon-text-muted" />
              )}
            </button>
          </div>
          <p className="text-xs text-dragon-text-secondary leading-relaxed mt-4">
            Toggle this mode to redirect public traffic to the maintenance landing page.
          </p>
        </div>

        {/* Last Sync Indicator */}
        <div className="glass-card rounded-xl p-5 flex flex-col justify-between min-h-[140px] border border-dragon-neon/10">
          <div>
            <p className="text-xs font-heading uppercase tracking-wide text-dragon-text-muted mb-1">
              Last Settings Update
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-dragon-neon" />
              <span className="font-mono text-sm text-dragon-text font-semibold">
                {lastUpdatedTime ? formatDate(lastUpdatedTime) : "Never updated"}
              </span>
            </div>
          </div>
          <p className="text-xs text-dragon-text-secondary leading-relaxed mt-4">
            Recorded timestamp of the most recent modifications applied to configuration tables.
          </p>
        </div>

        {/* Settings Count Summary */}
        <div className="glass-card rounded-xl p-5 flex flex-col justify-between min-h-[140px] border border-dragon-neon/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-heading uppercase tracking-wide text-dragon-text-muted mb-1">
                Settings Summary
              </p>
              <h3 className="font-heading font-bold text-lg text-dragon-text">
                {totalSettings} Config Entries
              </h3>
            </div>
            <Settings2 className="w-5 h-5 text-dragon-neon" />
          </div>
          <div className="flex gap-4 text-xs text-dragon-text-secondary mt-4">
            <span>
              System Keys: <strong className="text-dragon-text">{systemSettings}</strong>
            </span>
            <span>
              Custom Keys: <strong className="text-dragon-text">{customSettings}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Filter search bar */}
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="relative">
          <Input
            placeholder="Search config key name or content value..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="w-4 h-4 text-dragon-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Settings Grid */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" text="Loading settings configuration..." />
        </div>
      ) : error ? (
        <div className="glass-card rounded-xl p-12 text-center max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-lg text-dragon-text mb-2">
            Error Loading Settings
          </h3>
          <p className="text-dragon-text-secondary mb-6">{error}</p>
          <Button variant="primary" onClick={fetchSettings}>
            Try Again
          </Button>
        </div>
      ) : settings.length === 0 ? (
        <EmptyState
          icon={<Settings className="w-8 h-8 text-dragon-neon" />}
          title="No Configuration Found"
          description={
            search
              ? "No settings matched your search keyword."
              : "No settings are loaded. Click below to add one."
          }
          actionLabel={search ? undefined : "Add Custom Setting"}
          onAction={() => {
            setEditItem(null);
            setEditorOpen(true);
          }}
        />
      ) : (
        <>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Settings configuration table">
                <thead>
                  <tr className="border-b border-dragon-neon/10">
                    {["Setting Key", "Value Description", "Type", "Last Modified", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-heading uppercase tracking-wider text-dragon-text-muted whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {settings.map((setting) => {
                    const isProtected = PROTECTED_KEYS.includes(setting.key);
                    return (
                      <tr
                        key={setting.id}
                        className="border-b border-dragon-neon/5 hover:bg-dragon-neon/3 transition-colors animate-fade-in"
                      >
                        {/* Key */}
                        <td className="px-5 py-4 whitespace-nowrap font-mono text-dragon-text font-semibold text-xs">
                          {setting.key}
                        </td>

                        {/* Value */}
                        <td className="px-5 py-4 max-w-md">
                          <p className="text-dragon-text-secondary text-sm break-all font-mono line-clamp-3">
                            {setting.value}
                          </p>
                        </td>

                        {/* Type Badge */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {isProtected ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-heading uppercase tracking-wider bg-dragon-neon/10 text-dragon-neon border border-dragon-neon/20">
                              <ShieldCheck className="w-3 h-3" />
                              System
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-heading uppercase tracking-wider bg-dragon-bg-600 text-dragon-text-secondary border border-dragon-neon/10">
                              Custom
                            </span>
                          )}
                        </td>

                        {/* Last Modified */}
                        <td className="px-5 py-4 whitespace-nowrap text-dragon-text-muted text-xs">
                          {formatDate(setting.updatedAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                setEditItem(setting);
                                setEditorOpen(true);
                              }}
                              title="Edit Setting"
                              className="p-1.5 rounded text-dragon-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {/* Only show delete option for custom keys */}
                            {!isProtected ? (
                              <button
                                onClick={() => setDeleteItem(setting)}
                                title="Delete Custom Setting"
                                className="p-1.5 rounded text-dragon-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <span
                                className="p-1.5 text-dragon-text-muted opacity-25 cursor-not-allowed"
                                title="System protected setting cannot be deleted"
                              >
                                <Trash2 className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Editor Modal */}
      <SettingsEditor
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditItem(null);
        }}
        onSaved={fetchSettings}
        editItem={editItem}
        protectedKeys={PROTECTED_KEYS}
      />

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDeleteSetting}
        isDeleting={isDeleting}
        itemTitle={deleteItem?.key || ""}
      />
    </div>
  );
}
