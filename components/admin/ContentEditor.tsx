"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { Loader2 } from "lucide-react";

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string;
  authorName: string | null;
  status: "DRAFT" | "PUBLISHED";
  isFeatured: boolean;
  isPinned: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ContentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editItem?: ContentItem | null;
  categories: string[];
}

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
];

const CATEGORY_PRESETS = [
  "Guides",
  "News",
  "Opinion",
  "Announcements",
  "Tutorials",
  "Reviews",
  "Events",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ContentEditor({
  isOpen,
  onClose,
  onSaved,
  editItem,
  categories,
}: ContentEditorProps) {
  const { addToast } = useToast();
  const isEdit = !!editItem;

  const [saving, setSaving] = useState(false);
  const [slugLocked, setSlugLocked] = useState(isEdit);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "Guides",
    authorName: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    isFeatured: false,
    isPinned: false,
  });

  // Merge unique categories from db + presets
  const allCategories = Array.from(
    new Set([...CATEGORY_PRESETS, ...categories])
  ).sort();

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setForm({
          title: editItem.title,
          slug: editItem.slug,
          excerpt: editItem.excerpt || "",
          content: editItem.content,
          coverImage: editItem.coverImage || "",
          category: editItem.category,
          authorName: editItem.authorName || "",
          status: editItem.status,
          isFeatured: editItem.isFeatured,
          isPinned: editItem.isPinned,
        });
        setSlugLocked(true);
      } else {
        setForm({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          coverImage: "",
          category: "Guides",
          authorName: "",
          status: "DRAFT",
          isFeatured: false,
          isPinned: false,
        });
        setSlugLocked(false);
      }
      setErrors({});
    }
  }, [isOpen, editItem]);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugLocked ? prev.slug : slugify(title),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim() || form.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }
    if (!form.slug.trim() || !/^[a-z0-9-]+$/.test(form.slug)) {
      newErrors.slug = "Slug must be lowercase letters, numbers, and hyphens only.";
    }
    if (!form.content.trim() || form.content.length < 10) {
      newErrors.content = "Content must be at least 10 characters.";
    }
    if (!form.category.trim()) {
      newErrors.category = "Category is required.";
    }
    if (form.coverImage && !form.coverImage.startsWith("http")) {
      newErrors.coverImage = "Cover image must be a valid URL.";
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
        ? `/api/admin/content/${editItem!.id}`
        : "/api/admin/content";
      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim() || null,
        content: form.content.trim(),
        coverImage: form.coverImage.trim() || null,
        category: form.category.trim(),
        authorName: form.authorName.trim() || null,
        status: form.status,
        isFeatured: form.isFeatured,
        isPinned: form.isPinned,
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
          title: isEdit ? "Content Updated" : "Content Created",
          message: isEdit
            ? `"${form.title}" has been updated.`
            : `"${form.title}" has been created.`,
        });
        onSaved();
        onClose();
      } else {
        // Show field-level errors from API
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
          message: json.error || "Could not save content.",
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
      title={isEdit ? `Edit: ${editItem?.title}` : "Create New Content"}
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <Input
            id="content-title"
            placeholder="Enter a compelling title..."
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            disabled={saving}
          />
          {errors.title && (
            <p className="text-red-400 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
            Slug <span className="text-red-400">*</span>
            <span className="ml-2 text-xs text-dragon-text-muted font-normal">
              (URL path)
            </span>
          </label>
          <div className="flex gap-2">
            <Input
              id="content-slug"
              placeholder="auto-generated-slug"
              value={form.slug}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                }))
              }
              disabled={saving || slugLocked}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => setSlugLocked((l) => !l)}
              className="px-3 py-2 text-xs font-heading rounded-lg border border-dragon-neon/20 text-dragon-text-muted hover:text-dragon-neon hover:border-dragon-neon/40 transition-colors"
            >
              {slugLocked ? "Unlock" : "Lock"}
            </button>
          </div>
          {errors.slug && (
            <p className="text-red-400 text-xs mt-1">{errors.slug}</p>
          )}
        </div>

        {/* Category + Author (row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
              Category <span className="text-red-400">*</span>
            </label>
            <Select
              options={allCategories.map((c) => ({ value: c, label: c }))}
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
              disabled={saving}
            />
            {errors.category && (
              <p className="text-red-400 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
              Author Name
            </label>
            <Input
              id="content-author"
              placeholder="e.g. Dragon Up Creator"
              value={form.authorName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, authorName: e.target.value }))
              }
              disabled={saving}
            />
          </div>
        </div>

        {/* Cover Image URL */}
        <div>
          <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
            Cover Image URL
          </label>
          <Input
            id="content-cover"
            placeholder="https://..."
            value={form.coverImage}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, coverImage: e.target.value }))
            }
            disabled={saving}
          />
          {errors.coverImage && (
            <p className="text-red-400 text-xs mt-1">{errors.coverImage}</p>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
            Excerpt
            <span className="ml-2 text-xs text-dragon-text-muted font-normal">
              (short summary, max 500 chars)
            </span>
          </label>
          <Textarea
            id="content-excerpt"
            placeholder="A brief description shown in listing views..."
            value={form.excerpt}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, excerpt: e.target.value }))
            }
            rows={2}
            disabled={saving}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
            Content <span className="text-red-400">*</span>
          </label>
          <Textarea
            id="content-body"
            placeholder="Write your full content here..."
            value={form.content}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, content: e.target.value }))
            }
            rows={10}
            disabled={saving}
          />
          {errors.content && (
            <p className="text-red-400 text-xs mt-1">{errors.content}</p>
          )}
          <p className="text-xs text-dragon-text-muted mt-1">
            {form.content.length} characters
          </p>
        </div>

        {/* Status + Flags (row) */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-dragon-neon/10">
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
              Status
            </label>
            <Select
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as "DRAFT" | "PUBLISHED",
                }))
              }
              disabled={saving}
            />
          </div>

          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))
                }
                disabled={saving}
                className="w-4 h-4 rounded accent-green-500"
              />
              <span className="text-sm text-dragon-text-secondary">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPinned}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isPinned: e.target.checked }))
                }
                disabled={saving}
                className="w-4 h-4 rounded accent-green-500"
              />
              <span className="text-sm text-dragon-text-secondary">Pinned</span>
            </label>
          </div>
        </div>

        {/* Submit */}
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
              "Create Content"
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
