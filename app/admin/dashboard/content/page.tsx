"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FileText,
  Plus,
  Search,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  Filter,
  Pin,
  Star,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import AdminStatCard from "@/components/admin/AdminStatCard";
import ContentEditor, { type ContentItem } from "@/components/admin/ContentEditor";
import ContentPreview from "@/components/admin/ContentPreview";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";

const ITEMS_PER_PAGE = 20;

const STATUS_FILTERS = [
  { value: "all", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: string[];
}

export default function AdminContentPage() {
  const { addToast } = useToast();

  // ─── State ────────────────────────────────────────────────────────
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 1,
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Modals
  const [editorOpen, setEditorOpen] = useState(false);
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ContentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Fetch Data ───────────────────────────────────────────────────
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
      });

      const res = await fetch(`/api/admin/content?${params}`);
      const json = await res.json();

      if (res.ok && json.success) {
        setArticles(json.data);
        setMeta(json.meta);
      } else {
        setError(json.error || "Failed to fetch content.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, categoryFilter]);

  // ─── Publish Toggle ───────────────────────────────────────────────
  const handleTogglePublish = async (item: ContentItem) => {
    const newStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/admin/content/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        addToast({
          type: "success",
          title: "Status Updated",
          message: `"${item.title}" is now ${newStatus === "PUBLISHED" ? "published" : "a draft"}.`,
        });
        fetchArticles();
      } else {
        addToast({ type: "error", title: "Update Failed", message: json.error });
      }
    } catch {
      addToast({ type: "error", title: "Network Error", message: "Failed to update status." });
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/content/${deleteItem.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        addToast({
          type: "success",
          title: "Content Deleted",
          message: `"${deleteItem.title}" has been permanently removed.`,
        });
        setDeleteItem(null);
        fetchArticles();
      } else {
        addToast({ type: "error", title: "Delete Failed", message: json.error });
      }
    } catch {
      addToast({ type: "error", title: "Network Error", message: "Failed to delete content." });
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Stats ────────────────────────────────────────────────────────
  const publishedCount = articles.filter((a) => a.status === "PUBLISHED").length;
  const draftCount = articles.filter((a) => a.status === "DRAFT").length;
  const featuredCount = articles.filter((a) => a.isFeatured).length;

  // ─── Status badge style ───────────────────────────────────────────
  const statusBadge = (status: string) =>
    status === "PUBLISHED"
      ? "text-dragon-neon bg-dragon-neon/10 border border-dragon-neon/20"
      : "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20";

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...meta.categories.map((c) => ({ value: c, label: c })),
  ];

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          {/* Breadcrumb */}
          <p className="text-xs text-dragon-text-muted font-heading uppercase tracking-wider mb-1">
            Admin / Content
          </p>
          <h1 className="font-heading text-2xl font-bold text-dragon-text mb-1">
            Content Management
          </h1>
          <p className="text-dragon-text-secondary text-sm">
            Create, edit, and manage all published content.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchArticles} disabled={loading}>
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
            New Content
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AdminStatCard
          label="Total Content"
          value={meta.total}
          icon={<FileText className="w-5 h-5" />}
          description="All articles"
        />
        <AdminStatCard
          label="Published"
          value={publishedCount}
          icon={<FileText className="w-5 h-5" />}
          description="Live on site"
        />
        <AdminStatCard
          label="Drafts"
          value={draftCount}
          icon={<FileText className="w-5 h-5" />}
          description="Unpublished"
        />
        <AdminStatCard
          label="Featured"
          value={featuredCount}
          icon={<Star className="w-5 h-5" />}
          description="Highlighted content"
        />
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by title, slug, category, or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="w-4 h-4 text-dragon-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-dragon-text-muted text-sm">
            <Filter className="w-4 h-4" />
          </div>
          <div className="w-40">
            <Select
              options={STATUS_FILTERS}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" text="Loading content..." />
        </div>
      ) : error ? (
        <div className="glass-card rounded-xl p-12 text-center max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-lg text-dragon-text mb-2">
            Error Loading Content
          </h3>
          <p className="text-dragon-text-secondary mb-6">{error}</p>
          <Button variant="primary" onClick={fetchArticles}>
            Try Again
          </Button>
        </div>
      ) : articles.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8 text-dragon-neon" />}
          title="No Content Found"
          description={
            search || statusFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your search or filters."
              : "Create your first content item to get started."
          }
          actionLabel={
            search || statusFilter !== "all" || categoryFilter !== "all"
              ? undefined
              : "Create Content"
          }
          onAction={() => {
            setEditItem(null);
            setEditorOpen(true);
          }}
        />
      ) : (
        <>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Content management table">
                <thead>
                  <tr className="border-b border-dragon-neon/10">
                    {[
                      "Title",
                      "Category",
                      "Author",
                      "Status",
                      "Flags",
                      "Last Updated",
                      "Created",
                      "Actions",
                    ].map((h) => (
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
                  {articles.map((article) => (
                    <tr
                      key={article.id}
                      className="border-b border-dragon-neon/5 hover:bg-dragon-neon/3 transition-colors"
                    >
                      {/* Title */}
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-dragon-text font-medium truncate">
                          {article.title}
                        </p>
                        <p className="text-dragon-text-muted text-xs truncate font-mono mt-0.5">
                          /{article.slug}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-dragon-text-secondary text-xs px-2 py-0.5 rounded bg-dragon-bg-600 border border-dragon-neon/10">
                          {article.category}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="px-5 py-4 text-dragon-text-secondary whitespace-nowrap">
                        {article.authorName || (
                          <span className="text-dragon-text-muted italic">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleTogglePublish(article)}
                          title={
                            article.status === "PUBLISHED"
                              ? "Click to unpublish"
                              : "Click to publish"
                          }
                          className={`px-2.5 py-0.5 rounded text-[10px] font-heading uppercase tracking-wider border transition-opacity hover:opacity-75 ${statusBadge(article.status)}`}
                        >
                          {article.status}
                        </button>
                      </td>

                      {/* Flags */}
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5">
                          {article.isFeatured && (
                            <span title="Featured">
                              <Star className="w-3.5 h-3.5 text-yellow-400" />
                            </span>
                          )}
                          {article.isPinned && (
                            <span title="Pinned">
                              <Pin className="w-3.5 h-3.5 text-blue-400" />
                            </span>
                          )}
                          {!article.isFeatured && !article.isPinned && (
                            <span className="text-dragon-text-muted text-xs">—</span>
                          )}
                        </div>
                      </td>

                      {/* Last Updated */}
                      <td className="px-5 py-4 text-dragon-text-muted whitespace-nowrap text-xs">
                        {formatDate(article.updatedAt)}
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4 text-dragon-text-muted whitespace-nowrap text-xs">
                        {formatDate(article.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setPreviewItem(article)}
                            title="Preview"
                            className="p-1.5 rounded text-dragon-text-muted hover:text-dragon-neon hover:bg-dragon-neon/10 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditItem(article);
                              setEditorOpen(true);
                            }}
                            title="Edit"
                            className="p-1.5 rounded text-dragon-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteItem(article)}
                            title="Delete"
                            className="p-1.5 rounded text-dragon-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-5">
              <p className="text-dragon-text-muted text-sm">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(page * ITEMS_PER_PAGE, meta.total)} of {meta.total} items
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 py-1.5 text-sm text-dragon-text-secondary font-heading">
                  {page} / {meta.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <ContentEditor
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditItem(null);
        }}
        onSaved={fetchArticles}
        editItem={editItem}
        categories={meta.categories}
      />

      <ContentPreview
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        item={previewItem}
      />

      <DeleteConfirm
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemTitle={deleteItem?.title || ""}
      />
    </div>
  );
}
