"use client";

import { useEffect, useState } from "react";
import { Mail, Search, Eye, Filter, RefreshCw, AlertCircle } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
  status: string;
  reference: string;
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const { addToast } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/enquiries");
      const json = await res.json();
      if (res.ok && json.success) {
        setEnquiries(json.data);
      } else {
        setError(json.error || "Failed to fetch enquiries.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        addToast({ type: "success", title: "Status updated", message: `Enquiry status changed to ${newStatus}` });
        // Update local state
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        addToast({ type: "error", title: "Update failed", message: json.error || "Failed to update status." });
      }
    } catch {
      addToast({ type: "error", title: "Network error", message: "Failed to update status." });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filter & search logic
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.reference.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || e.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    NEW: "text-dragon-neon bg-dragon-neon/10 border border-dragon-neon/20",
    RESPONDED: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
    CLOSED: "text-dragon-text-muted bg-dragon-bg-600 border border-dragon-neon/10",
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dragon-text mb-1">Enquiries</h1>
          <p className="text-dragon-text-secondary text-sm">Manage user contact submissions and enquiries.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchEnquiries} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filter and Search controls */}
      <div className="glass-card rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by name, email, subject, or reference ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="w-4 h-4 text-dragon-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="w-full md:w-48">
          <Select
            options={[
              { value: "all", label: "All Statuses" },
              { value: "new", label: "New Only" },
              { value: "responded", label: "Responded" },
              { value: "closed", label: "Closed" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader size="lg" text="Loading enquiries..." />
        </div>
      ) : error ? (
        <div className="glass-card rounded-xl p-12 text-center max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-lg text-dragon-text mb-2">Error Loading Data</h3>
          <p className="text-dragon-text-secondary mb-6">{error}</p>
          <Button variant="primary" onClick={fetchEnquiries}>
            Try Again
          </Button>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <EmptyState
          icon={<Mail className="w-8 h-8 text-dragon-neon" />}
          title="No Enquiries Found"
          description={
            search || statusFilter !== "all"
              ? "Try adjusting your search query or filters."
              : "No enquiries have been submitted through the contact form yet."
          }
        />
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Contact enquiries">
              <thead>
                <tr className="border-b border-dragon-neon/10">
                  {["Reference ID", "Name", "Email", "Category", "Subject", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-heading uppercase tracking-wider text-dragon-text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((eq) => (
                  <tr key={eq.id} className="border-b border-dragon-neon/5 hover:bg-dragon-neon/3 transition-colors">
                    <td className="px-6 py-4 font-heading text-xs text-dragon-neon">{eq.reference}</td>
                    <td className="px-6 py-4 text-dragon-text font-medium">{eq.name}</td>
                    <td className="px-6 py-4 text-dragon-text-secondary">{eq.email}</td>
                    <td className="px-6 py-4 text-dragon-text-secondary capitalize">{eq.type}</td>
                    <td className="px-6 py-4 text-dragon-text-secondary max-w-xs truncate">{eq.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-heading uppercase tracking-wider ${statusColors[eq.status] || statusColors.NEW}`}>
                        {eq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dragon-text-muted whitespace-nowrap">
                      {formatDate(eq.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="secondary" size="sm" onClick={() => setSelectedEnquiry(eq)}>
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View/Edit Modal */}
      <Modal
        isOpen={!!selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        title={`Enquiry Details: ${selectedEnquiry?.reference}`}
        className="max-w-2xl"
      >
        {selectedEnquiry && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm border-b border-dragon-neon/10 pb-4">
              <div>
                <p className="text-dragon-text-muted">From Name</p>
                <p className="font-semibold text-dragon-text">{selectedEnquiry.name}</p>
              </div>
              <div>
                <p className="text-dragon-text-muted">Email Address</p>
                <p className="font-semibold text-dragon-text">
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-dragon-neon hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-dragon-text-muted">Category</p>
                <p className="font-semibold text-dragon-text capitalize">{selectedEnquiry.type}</p>
              </div>
              <div>
                <p className="text-dragon-text-muted">Date Submitted</p>
                <p className="font-semibold text-dragon-text">{formatDate(selectedEnquiry.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-dragon-text-muted mb-1">Subject</p>
              <h3 className="font-heading font-bold text-dragon-text text-lg">{selectedEnquiry.subject}</h3>
            </div>

            <div>
              <p className="text-sm text-dragon-text-muted mb-2">Message</p>
              <div className="bg-dragon-bg-600 border border-dragon-neon/10 rounded-lg p-4 text-dragon-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-dragon-neon/10">
              <div className="flex items-center gap-2">
                <span className="text-sm text-dragon-text-muted">Status:</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-heading uppercase tracking-wider ${statusColors[selectedEnquiry.status] || statusColors.NEW}`}>
                  {selectedEnquiry.status}
                </span>
              </div>

              <div className="flex gap-2">
                {selectedEnquiry.status !== "NEW" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, "NEW")}
                  >
                    Mark New
                  </Button>
                )}
                {selectedEnquiry.status !== "RESPONDED" && (
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, "RESPONDED")}
                  >
                    Mark Responded
                  </Button>
                )}
                {selectedEnquiry.status !== "CLOSED" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, "CLOSED")}
                  >
                    Close Enquiry
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
