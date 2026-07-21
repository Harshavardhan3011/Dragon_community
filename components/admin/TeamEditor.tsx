"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { Loader2 } from "lucide-react";

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string | null;
  favoriteGame: string | null;
  socialLink: string | null;
  skills: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TeamEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editItem?: TeamMemberItem | null;
}

export default function TeamEditor({
  isOpen,
  onClose,
  onSaved,
  editItem,
}: TeamEditorProps) {
  const { addToast } = useToast();
  const isEdit = !!editItem;

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
    image: "",
    favoriteGame: "",
    socialLink: "",
    skills: "",
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setForm({
          name: editItem.name,
          role: editItem.role,
          bio: editItem.bio,
          image: editItem.image || "",
          favoriteGame: editItem.favoriteGame || "",
          socialLink: editItem.socialLink || "",
          skills: editItem.skills || "",
          displayOrder: editItem.displayOrder,
          isActive: editItem.isActive,
        });
      } else {
        setForm({
          name: "",
          role: "",
          bio: "",
          image: "",
          favoriteGame: "",
          socialLink: "",
          skills: "",
          displayOrder: 0,
          isActive: true,
        });
      }
      setErrors({});
    }
  }, [isOpen, editItem]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }
    if (!form.role.trim() || form.role.length < 2) {
      newErrors.role = "Role must be at least 2 characters.";
    }
    if (!form.bio.trim() || form.bio.length < 5) {
      newErrors.bio = "Bio must be at least 5 characters.";
    }
    if (form.socialLink && !form.socialLink.startsWith("http")) {
      newErrors.socialLink = "Social link must be a valid URL.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/team/${editItem!.id}`
        : "/api/admin/team";
      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio.trim(),
        image: form.image.trim() || null,
        favoriteGame: form.favoriteGame.trim() || null,
        socialLink: form.socialLink.trim() || null,
        skills: form.skills.trim() || null,
        displayOrder: Number(form.displayOrder) || 0,
        isActive: form.isActive,
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
          message: json.error || "Could not save team member.",
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
      title={isEdit ? `Edit: ${editItem?.name}` : "Add New Team Member"}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Name & Role (row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <Input
              id="team-name"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              disabled={saving}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
              Role / Position <span className="text-red-400">*</span>
            </label>
            <Input
              id="team-role"
              placeholder="e.g. Lead Moderator"
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              disabled={saving}
            />
            {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
            Bio <span className="text-red-400">*</span>
          </label>
          <Textarea
            id="team-bio"
            placeholder="Introduce this team member..."
            value={form.bio}
            onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
            rows={4}
            disabled={saving}
          />
          {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio}</p>}
        </div>

        {/* Image path & Favorite game (row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
              Avatar Image Path / URL
            </label>
            <Input
              id="team-image"
              placeholder="e.g. /images/team/founder.png"
              value={form.image}
              onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
              Favorite Game
            </label>
            <Input
              id="team-game"
              placeholder="e.g. Free Fire"
              value={form.favoriteGame}
              onChange={(e) => setForm((prev) => ({ ...prev, favoriteGame: e.target.value }))}
              disabled={saving}
            />
          </div>
        </div>

        {/* Social link & Skills (row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
              Social Link / Profile URL
            </label>
            <Input
              id="team-social"
              placeholder="https://..."
              value={form.socialLink}
              onChange={(e) => setForm((prev) => ({ ...prev, socialLink: e.target.value }))}
              disabled={saving}
            />
            {errors.socialLink && <p className="text-red-400 text-xs mt-1">{errors.socialLink}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
              Skills (comma-separated)
            </label>
            <Input
              id="team-skills"
              placeholder="e.g. Video Editing, Moderation"
              value={form.skills}
              onChange={(e) => setForm((prev) => ({ ...prev, skills: e.target.value }))}
              disabled={saving}
            />
          </div>
        </div>

        {/* Display order & Active state (row) */}
        <div className="flex flex-col sm:flex-row gap-6 pt-2 border-t border-dragon-neon/10 items-end">
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
              Display Order
            </label>
            <Input
              id="team-order"
              type="number"
              value={form.displayOrder}
              onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: parseInt(e.target.value, 10) || 0 }))}
              disabled={saving}
            />
          </div>

          <div className="flex items-center gap-2 cursor-pointer h-12">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                disabled={saving}
                className="w-4 h-4 rounded accent-green-500 cursor-pointer"
              />
              <span className="text-sm text-dragon-text-secondary">Active Status</span>
            </label>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
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
