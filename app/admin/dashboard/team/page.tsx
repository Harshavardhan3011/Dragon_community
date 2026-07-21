"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Filter,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  UserCheck,
  UserX,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import AdminStatCard from "@/components/admin/AdminStatCard";
import TeamEditor, { type TeamMemberItem } from "@/components/admin/TeamEditor";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { useToast } from "@/components/ui/Toast";

const ITEMS_PER_PAGE = 10;

const STATUS_FILTERS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminTeamPage() {
  const { addToast } = useToast();

  // ─── State ────────────────────────────────────────────────────────
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Modals
  const [editorOpen, setEditorOpen] = useState(false);
  const [editItem, setEditItem] = useState<TeamMemberItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<TeamMemberItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Fetch Data ───────────────────────────────────────────────────
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/team?${params}`);
      const json = await res.json();

      if (res.ok && json.success) {
        setMembers(json.data);
        setMeta(json.meta);
      } else {
        setError(json.error || "Failed to fetch team members.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // ─── Toggle Active ────────────────────────────────────────────────
  const handleToggleActive = async (item: TeamMemberItem) => {
    const newStatus = !item.isActive;
    try {
      const res = await fetch(`/api/admin/team/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        addToast({
          type: "success",
          title: "Status Updated",
          message: `"${item.name}" is now ${newStatus ? "active" : "inactive"}.`,
        });
        fetchMembers();
      } else {
        addToast({ type: "error", title: "Update Failed", message: json.error });
      }
    } catch {
      addToast({ type: "error", title: "Network Error", message: "Failed to update active state." });
    }
  };

  // ─── Reorder displayOrder ─────────────────────────────────────────
  const handleReorder = async (item: TeamMemberItem, direction: "up" | "down") => {
    const change = direction === "up" ? -1 : 1;
    const newOrder = Math.max(0, item.displayOrder + change);
    try {
      const res = await fetch(`/api/admin/team/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: newOrder }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        addToast({
          type: "success",
          title: "Order Updated",
          message: `Updated display order for "${item.name}".`,
        });
        fetchMembers();
      } else {
        addToast({ type: "error", title: "Update Failed", message: json.error });
      }
    } catch {
      addToast({ type: "error", title: "Network Error", message: "Failed to update order." });
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/team/${deleteItem.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        addToast({
          type: "success",
          title: "Member Deleted",
          message: `"${deleteItem.name}" has been permanently removed.`,
        });
        setDeleteItem(null);
        fetchMembers();
      } else {
        addToast({ type: "error", title: "Delete Failed", message: json.error });
      }
    } catch {
      addToast({ type: "error", title: "Network Error", message: "Failed to delete member." });
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats
  const activeCount = members.filter((m) => m.isActive).length;
  const inactiveCount = members.filter((m) => !m.isActive).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs text-dragon-text-muted font-heading uppercase tracking-wider mb-1">
            Admin / Team
          </p>
          <h1 className="font-heading text-2xl font-bold text-dragon-text mb-1">
            Team Management
          </h1>
          <p className="text-dragon-text-secondary text-sm">
            Configure the community leaders and founders displayed on the Team page.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchMembers} disabled={loading}>
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
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <AdminStatCard
          label="Total Members"
          value={meta.total}
          icon={<Users className="w-5 h-5" />}
          description="All team members"
        />
        <AdminStatCard
          label="Active"
          value={activeCount}
          icon={<UserCheck className="w-5 h-5 text-dragon-neon" />}
          description="Visible on website"
        />
        <AdminStatCard
          label="Inactive"
          value={inactiveCount}
          icon={<UserX className="w-5 h-5 text-yellow-500" />}
          description="Hidden"
        />
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by name, role, bio, favorite game or skills..."
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
        </div>
      </div>

      {/* Team list table */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" text="Loading team members..." />
        </div>
      ) : error ? (
        <div className="glass-card rounded-xl p-12 text-center max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-lg text-dragon-text mb-2">
            Error Loading Team Members
          </h3>
          <p className="text-dragon-text-secondary mb-6">{error}</p>
          <Button variant="primary" onClick={fetchMembers}>
            Try Again
          </Button>
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8 text-dragon-neon" />}
          title="No Team Members Found"
          description={
            search || statusFilter !== "all"
              ? "Try adjusting your filters or search terms."
              : "Add your first team member to display them here."
          }
          actionLabel={search || statusFilter !== "all" ? undefined : "Add Member"}
          onAction={() => {
            setEditItem(null);
            setEditorOpen(true);
          }}
        />
      ) : (
        <>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Team member list table">
                <thead>
                  <tr className="border-b border-dragon-neon/10">
                    {[
                      "Name / Info",
                      "Role / Bio",
                      "Favorite Game",
                      "Skills",
                      "Active",
                      "Display Order",
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
                  {members.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-dragon-neon/5 hover:bg-dragon-neon/3 transition-colors animate-fade-in"
                    >
                      {/* Name / Info */}
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-dragon-text font-medium">{member.name}</p>
                        <p className="text-dragon-text-muted text-xs truncate font-mono mt-0.5">
                          {member.socialLink || "No social link"}
                        </p>
                      </td>

                      {/* Role / Bio */}
                      <td className="px-5 py-4 max-w-md">
                        <p className="text-dragon-text-secondary font-medium">{member.role}</p>
                        <p className="text-dragon-text-muted text-xs mt-1 line-clamp-2">
                          {member.bio}
                        </p>
                      </td>

                      {/* Favorite Game */}
                      <td className="px-5 py-4 whitespace-nowrap text-dragon-text-secondary text-sm">
                        {member.favoriteGame || <span className="text-dragon-text-muted italic">—</span>}
                      </td>

                      {/* Skills */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {member.skills ? (
                            member.skills.split(",").map((s) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 bg-dragon-bg-600 border border-dragon-neon/10 text-dragon-text-secondary rounded text-[10px]"
                              >
                                {s.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-dragon-text-muted italic text-xs">—</span>
                          )}
                        </div>
                      </td>

                      {/* Active Status Toggle Button */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(member)}
                          title={member.isActive ? "Deactivate member" : "Activate member"}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-heading uppercase tracking-wider border transition-opacity hover:opacity-75 ${
                            member.isActive
                              ? "text-dragon-neon bg-dragon-neon/10 border-dragon-neon/20"
                              : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                          }`}
                        >
                          {member.isActive ? "ACTIVE" : "INACTIVE"}
                        </button>
                      </td>

                      {/* Display Order with quick adjust buttons */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-dragon-text-secondary w-6 text-center font-bold">
                            {member.displayOrder}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => handleReorder(member, "up")}
                              title="Move Up (Decrease displayOrder)"
                              className="p-0.5 rounded hover:bg-dragon-neon/10 hover:text-dragon-neon text-dragon-text-muted transition-colors cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorder(member, "down")}
                              title="Move Down (Increase displayOrder)"
                              className="p-0.5 rounded hover:bg-dragon-neon/10 hover:text-dragon-neon text-dragon-text-muted transition-colors cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              setEditItem(member);
                              setEditorOpen(true);
                            }}
                            title="Edit Member"
                            className="p-1.5 rounded text-dragon-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteItem(member)}
                            title="Delete Member"
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
                {Math.min(page * ITEMS_PER_PAGE, meta.total)} of {meta.total} members
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
      <TeamEditor
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditItem(null);
        }}
        onSaved={fetchMembers}
        editItem={editItem}
      />

      <DeleteConfirm
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemTitle={deleteItem?.name || ""}
      />
    </div>
  );
}
