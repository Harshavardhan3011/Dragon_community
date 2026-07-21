"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { Loader2 } from "lucide-react";

export interface GuildMemberItem {
  id: string;
  name: string;
  nickname: string;
  avatar: string | null;
  uid: string;
  role: "GUILD_LEADER" | "ACTING_GUILD_LEADER" | "OFFICER" | "PLAYER";
  status: "ACTIVE" | "OFFLINE" | "ON_BREAK";
  joinedAt: string;
  favoriteGame: string | null;
  displayOrder: number;
  isActive: boolean;
  
  // Profile stats and info
  country: string | null;
  about: string | null;
  achievements: string | null;
  rank: string | null;
  level: number | null;
  matchesPlayed: number | null;
  wins: number | null;
  mvpCount: number | null;
  favoriteWeapon: string | null;
  favoriteCharacter: string | null;
  favoritePet: string | null;
  device: string | null;
  
  // Social Links
  youtube: string | null;
  instagram: string | null;
  discord: string | null;
  facebook: string | null;
  createdAt: string;
  updatedAt: string;
}

interface GuildEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editItem?: GuildMemberItem | null;
}

const ROLE_OPTIONS = [
  { value: "PLAYER", label: "Guild Player" },
  { value: "OFFICER", label: "Officer" },
  { value: "ACTING_GUILD_LEADER", label: "Acting Guild Leader" },
  { value: "GUILD_LEADER", label: "Guild Leader" },
];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "OFFLINE", label: "Offline" },
  { value: "ON_BREAK", label: "On Break" },
];

export default function GuildEditor({
  isOpen,
  onClose,
  onSaved,
  editItem,
}: GuildEditorProps) {
  const { addToast } = useToast();
  const isEdit = !!editItem;

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"core" | "stats" | "bio">("core");

  const [form, setForm] = useState({
    name: "",
    nickname: "",
    avatar: "",
    uid: "",
    role: "PLAYER" as "GUILD_LEADER" | "ACTING_GUILD_LEADER" | "OFFICER" | "PLAYER",
    status: "ACTIVE" as "ACTIVE" | "OFFLINE" | "ON_BREAK",
    joinedAt: new Date().toISOString().split("T")[0],
    favoriteGame: "",
    displayOrder: 0,
    isActive: true,
    country: "",
    about: "",
    achievements: "",
    rank: "",
    level: "",
    matchesPlayed: "",
    wins: "",
    mvpCount: "",
    favoriteWeapon: "",
    favoriteCharacter: "",
    favoritePet: "",
    device: "",
    youtube: "",
    instagram: "",
    discord: "",
    facebook: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setForm({
          name: editItem.name,
          nickname: editItem.nickname,
          avatar: editItem.avatar || "",
          uid: editItem.uid,
          role: editItem.role,
          status: editItem.status,
          joinedAt: new Date(editItem.joinedAt).toISOString().split("T")[0],
          favoriteGame: editItem.favoriteGame || "",
          displayOrder: editItem.displayOrder,
          isActive: editItem.isActive,
          country: editItem.country || "",
          about: editItem.about || "",
          achievements: editItem.achievements || "",
          rank: editItem.rank || "",
          level: editItem.level !== null ? String(editItem.level) : "",
          matchesPlayed: editItem.matchesPlayed !== null ? String(editItem.matchesPlayed) : "",
          wins: editItem.wins !== null ? String(editItem.wins) : "",
          mvpCount: editItem.mvpCount !== null ? String(editItem.mvpCount) : "",
          favoriteWeapon: editItem.favoriteWeapon || "",
          favoriteCharacter: editItem.favoriteCharacter || "",
          favoritePet: editItem.favoritePet || "",
          device: editItem.device || "",
          youtube: editItem.youtube || "",
          instagram: editItem.instagram || "",
          discord: editItem.discord || "",
          facebook: editItem.facebook || "",
        });
      } else {
        setForm({
          name: "",
          nickname: "",
          avatar: "",
          uid: "",
          role: "PLAYER",
          status: "ACTIVE",
          joinedAt: new Date().toISOString().split("T")[0],
          favoriteGame: "Free Fire",
          displayOrder: 0,
          isActive: true,
          country: "India",
          about: "",
          achievements: "",
          rank: "",
          level: "",
          matchesPlayed: "",
          wins: "",
          mvpCount: "",
          favoriteWeapon: "",
          favoriteCharacter: "",
          favoritePet: "",
          device: "",
          youtube: "",
          instagram: "",
          discord: "",
          facebook: "",
        });
      }
      setActiveTab("core");
      setErrors({});
    }
  }, [isOpen, editItem]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }
    if (!form.nickname.trim() || form.nickname.length < 2) {
      newErrors.nickname = "Gaming Name must be at least 2 characters.";
    }
    if (!form.uid.trim() || form.uid.length < 3) {
      newErrors.uid = "UID must be at least 3 characters.";
    }
    if (form.youtube && !form.youtube.startsWith("http")) {
      newErrors.youtube = "YouTube URL must be valid.";
    }
    if (form.instagram && !form.instagram.startsWith("http")) {
      newErrors.instagram = "Instagram URL must be valid.";
    }
    if (form.discord && !form.discord.startsWith("http")) {
      newErrors.discord = "Discord URL must be valid.";
    }
    if (form.facebook && !form.facebook.startsWith("http")) {
      newErrors.facebook = "Facebook URL must be valid.";
    }
    
    // Validate integers if provided
    const checkInt = (val: string, key: string, name: string) => {
      if (val && (isNaN(Number(val)) || !Number.isInteger(Number(val)) || Number(val) < 0)) {
        newErrors[key] = `${name} must be a positive integer.`;
      }
    };
    checkInt(form.level, "level", "Level");
    checkInt(form.matchesPlayed, "matchesPlayed", "Matches Played");
    checkInt(form.wins, "wins", "Wins");
    checkInt(form.mvpCount, "mvpCount", "MVP Count");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast({
        type: "error",
        title: "Validation Failed",
        message: "Please check the form for errors in each tab.",
      });
      return;
    }

    setSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/guild/${editItem!.id}`
        : "/api/admin/guild";
      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        name: form.name.trim(),
        nickname: form.nickname.trim(),
        avatar: form.avatar.trim() || null,
        uid: form.uid.trim(),
        role: form.role,
        status: form.status,
        joinedAt: new Date(form.joinedAt).toISOString(),
        favoriteGame: form.favoriteGame.trim() || null,
        displayOrder: Number(form.displayOrder) || 0,
        isActive: form.isActive,
        country: form.country.trim() || null,
        about: form.about.trim() || null,
        achievements: form.achievements.trim() || null,
        rank: form.rank.trim() || null,
        level: form.level ? Number(form.level) : null,
        matchesPlayed: form.matchesPlayed ? Number(form.matchesPlayed) : null,
        wins: form.wins ? Number(form.wins) : null,
        mvpCount: form.mvpCount ? Number(form.mvpCount) : null,
        favoriteWeapon: form.favoriteWeapon.trim() || null,
        favoriteCharacter: form.favoriteCharacter.trim() || null,
        favoritePet: form.favoritePet.trim() || null,
        device: form.device.trim() || null,
        youtube: form.youtube.trim() || null,
        instagram: form.instagram.trim() || null,
        discord: form.discord.trim() || null,
        facebook: form.facebook.trim() || null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        addToast({
          type: "success",
          title: isEdit ? "Member Updated" : "Member Created",
          message: isEdit
            ? `"${form.name}" has been updated.`
            : `"${form.name}" has been created.`,
        });
        onSaved();
        onClose();
      } else {
        if (json.issues) {
          const apiErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(json.issues)) {
            apiErrors[key] = (msgs as string[])[0];
          }
          setErrors(apiErrors);
        }
        addToast({
          type: "error",
          title: "Save Failed",
          message: json.error || "Could not save guild member.",
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Network Error",
        message: "Failed to connect to the server.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit: ${editItem?.name} (${editItem?.nickname})` : "Add New Guild Member"}
      className="max-w-3xl"
    >
      {/* Premium Tab Bar */}
      <div className="flex border-b border-dragon-neon/10 mb-6">
        {[
          { id: "core", label: "Core Information" },
          { id: "stats", label: "Player Stats" },
          { id: "bio", label: "Bio & Socials" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-heading tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-dragon-neon text-dragon-neon"
                : "border-transparent text-dragon-text-secondary hover:text-dragon-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* ─── TAB 1: CORE INFORMATION ─────────────────────────────────── */}
        {activeTab === "core" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Real Name <span className="text-red-400">*</span>
                </label>
                <Input
                  id="guild-name"
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  disabled={saving}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Gaming Name / Nickname <span className="text-red-400">*</span>
                </label>
                <Input
                  id="guild-nickname"
                  placeholder="e.g. DRAGON_OP"
                  value={form.nickname}
                  onChange={(e) => setForm((prev) => ({ ...prev, nickname: e.target.value }))}
                  disabled={saving}
                />
                {errors.nickname && <p className="text-red-400 text-xs mt-1">{errors.nickname}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Guild UID <span className="text-red-400">*</span>
                </label>
                <Input
                  id="guild-uid"
                  placeholder="e.g. UID-12345678"
                  value={form.uid}
                  onChange={(e) => setForm((prev) => ({ ...prev, uid: e.target.value }))}
                  disabled={saving || isEdit} // UID unique, disable edits once created
                />
                {errors.uid && <p className="text-red-400 text-xs mt-1">{errors.uid}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Joined Date
                </label>
                <Input
                  id="guild-joinedAt"
                  type="date"
                  value={form.joinedAt}
                  onChange={(e) => setForm((prev) => ({ ...prev, joinedAt: e.target.value }))}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Guild Role <span className="text-red-400">*</span>
                </label>
                <Select
                  options={ROLE_OPTIONS}
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as any }))}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Active Status
                </label>
                <Select
                  options={STATUS_OPTIONS}
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as any }))}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Avatar Path / URL
                </label>
                <Input
                  id="guild-avatar"
                  placeholder="e.g. /images/team/avatar.png"
                  value={form.avatar}
                  onChange={(e) => setForm((prev) => ({ ...prev, avatar: e.target.value }))}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Display Order
                </label>
                <Input
                  id="guild-order"
                  type="number"
                  placeholder="0"
                  value={form.displayOrder}
                  onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: parseInt(e.target.value, 10) || 0 }))}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  disabled={saving}
                  className="w-4 h-4 rounded accent-green-500 cursor-pointer"
                />
                <span className="text-sm text-dragon-text-secondary">Visible on Website (Active in list)</span>
              </label>
            </div>
          </div>
        )}

        {/* ─── TAB 2: PLAYER STATS ──────────────────────────────────────── */}
        {activeTab === "stats" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Level
                </label>
                <Input
                  id="guild-level"
                  type="number"
                  placeholder="e.g. 75"
                  value={form.level}
                  onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
                  disabled={saving}
                />
                {errors.level && <p className="text-red-400 text-xs mt-1">{errors.level}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Rank
                </label>
                <Input
                  id="guild-rank"
                  placeholder="e.g. Grandmaster"
                  value={form.rank}
                  onChange={(e) => setForm((prev) => ({ ...prev, rank: e.target.value }))}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Country
                </label>
                <Input
                  id="guild-country"
                  placeholder="e.g. India"
                  value={form.country}
                  onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Device
                </label>
                <Input
                  id="guild-device"
                  placeholder="e.g. iPad Pro"
                  value={form.device}
                  onChange={(e) => setForm((prev) => ({ ...prev, device: e.target.value }))}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Matches
                </label>
                <Input
                  id="guild-matches"
                  type="number"
                  placeholder="0"
                  value={form.matchesPlayed}
                  onChange={(e) => setForm((prev) => ({ ...prev, matchesPlayed: e.target.value }))}
                  disabled={saving}
                />
                {errors.matchesPlayed && <p className="text-red-400 text-xs mt-1">{errors.matchesPlayed}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Wins
                </label>
                <Input
                  id="guild-wins"
                  type="number"
                  placeholder="0"
                  value={form.wins}
                  onChange={(e) => setForm((prev) => ({ ...prev, wins: e.target.value }))}
                  disabled={saving}
                />
                {errors.wins && <p className="text-red-400 text-xs mt-1">{errors.wins}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  MVP Count
                </label>
                <Input
                  id="guild-mvps"
                  type="number"
                  placeholder="0"
                  value={form.mvpCount}
                  onChange={(e) => setForm((prev) => ({ ...prev, mvpCount: e.target.value }))}
                  disabled={saving}
                />
                {errors.mvpCount && <p className="text-red-400 text-xs mt-1">{errors.mvpCount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Favorite Game
                </label>
                <Input
                  id="guild-game"
                  placeholder="Free Fire"
                  value={form.favoriteGame}
                  onChange={(e) => setForm((prev) => ({ ...prev, favoriteGame: e.target.value }))}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Favorite Weapon
                </label>
                <Input
                  id="guild-weapon"
                  placeholder="e.g. AWM"
                  value={form.favoriteWeapon}
                  onChange={(e) => setForm((prev) => ({ ...prev, favoriteWeapon: e.target.value }))}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Favorite Character
                </label>
                <Input
                  id="guild-character"
                  placeholder="e.g. Alok"
                  value={form.favoriteCharacter}
                  onChange={(e) => setForm((prev) => ({ ...prev, favoriteCharacter: e.target.value }))}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Favorite Pet
                </label>
                <Input
                  id="guild-pet"
                  placeholder="e.g. Falco"
                  value={form.favoritePet}
                  onChange={(e) => setForm((prev) => ({ ...prev, favoritePet: e.target.value }))}
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: BIO & SOCIALS ─────────────────────────────────────── */}
        {activeTab === "bio" && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                About Player
              </label>
              <Textarea
                id="guild-about"
                placeholder="Introduce this guild member..."
                value={form.about}
                onChange={(e) => setForm((prev) => ({ ...prev, about: e.target.value }))}
                rows={3}
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                Achievements
              </label>
              <Textarea
                id="guild-achievements"
                placeholder="Key achievements e.g. Clan War Champion, MVP Season 10..."
                value={form.achievements}
                onChange={(e) => setForm((prev) => ({ ...prev, achievements: e.target.value }))}
                rows={2}
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  YouTube Profile Link
                </label>
                <Input
                  id="guild-youtube"
                  placeholder="https://youtube.com/..."
                  value={form.youtube}
                  onChange={(e) => setForm((prev) => ({ ...prev, youtube: e.target.value }))}
                  disabled={saving}
                />
                {errors.youtube && <p className="text-red-400 text-xs mt-1">{errors.youtube}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Instagram Link
                </label>
                <Input
                  id="guild-instagram"
                  placeholder="https://instagram.com/..."
                  value={form.instagram}
                  onChange={(e) => setForm((prev) => ({ ...prev, instagram: e.target.value }))}
                  disabled={saving}
                />
                {errors.instagram && <p className="text-red-400 text-xs mt-1">{errors.instagram}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Discord Server / Profile
                </label>
                <Input
                  id="guild-discord"
                  placeholder="https://discord.gg/..."
                  value={form.discord}
                  onChange={(e) => setForm((prev) => ({ ...prev, discord: e.target.value }))}
                  disabled={saving}
                />
                {errors.discord && <p className="text-red-400 text-xs mt-1">{errors.discord}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
                  Facebook Link
                </label>
                <Input
                  id="guild-facebook"
                  placeholder="https://facebook.com/..."
                  value={form.facebook}
                  onChange={(e) => setForm((prev) => ({ ...prev, facebook: e.target.value }))}
                  disabled={saving}
                />
                {errors.facebook && <p className="text-red-400 text-xs mt-1">{errors.facebook}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t border-dragon-neon/10 justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Member"
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
