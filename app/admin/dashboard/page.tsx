import { Mail, Users, LayoutDashboard, Globe } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

async function getDashboardData() {
  const [totalEnquiries, teamMembers, totalContent, recentEnquiries, siteSetting] = await Promise.all([
    db.contactEnquiry.count(),
    db.teamMember.count({ where: { isActive: true } }),
    db.newsArticle.count(),
    db.contactEnquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.siteSetting.findUnique({ where: { key: "site_status" } }),
  ]);
  return { totalEnquiries, teamMembers, totalContent, recentEnquiries, siteStatus: siteSetting?.value || "online" };
}

export default async function AdminDashboardPage() {
  const { totalEnquiries, teamMembers, totalContent, recentEnquiries, siteStatus } = await getDashboardData();

  const statusColors: Record<string, string> = {
    NEW: "text-dragon-neon bg-dragon-neon/10",
    RESPONDED: "text-blue-400 bg-blue-500/10",
    CLOSED: "text-dragon-text-muted bg-dragon-bg-600",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-dragon-text mb-1">Dashboard Overview</h1>
        <p className="text-dragon-text-secondary text-sm">Welcome back, Admin.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <AdminStatCard label="Total Enquiries" value={totalEnquiries} icon={<Mail className="w-5 h-5" />} description="Contact form submissions" />
        <AdminStatCard label="Active Team Members" value={teamMembers} icon={<Users className="w-5 h-5" />} description="Current team roster" />
        <AdminStatCard label="Content Articles" value={totalContent} icon={<LayoutDashboard className="w-5 h-5" />} description="CMS news articles" />
        <AdminStatCard
          label="Website Status"
          value={siteStatus === "online" ? "Online" : "Maintenance"}
          icon={<Globe className="w-5 h-5" />}
          description="Current site status"
        />
      </div>

      {/* Recent enquiries */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-dragon-neon/10">
          <h2 className="font-heading font-bold text-dragon-text">Recent Enquiries</h2>
        </div>
        {recentEnquiries.length === 0 ? (
          <div className="p-12 text-center text-dragon-text-muted">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No enquiries yet. Contact form submissions will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Recent enquiries">
              <thead>
                <tr className="border-b border-dragon-neon/10">
                  {["Name", "Email", "Type", "Subject", "Status", "Date"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-heading uppercase tracking-wider text-dragon-text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.map((eq) => (
                  <tr key={eq.id} className="border-b border-dragon-neon/5 hover:bg-dragon-neon/3 transition-colors">
                    <td className="px-6 py-4 text-dragon-text font-medium">{eq.name}</td>
                    <td className="px-6 py-4 text-dragon-text-secondary">{eq.email}</td>
                    <td className="px-6 py-4 text-dragon-text-secondary capitalize">{eq.type}</td>
                    <td className="px-6 py-4 text-dragon-text-secondary max-w-xs truncate">{eq.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-heading uppercase tracking-wider ${statusColors[eq.status] || statusColors.NEW}`}>
                        {eq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dragon-text-muted whitespace-nowrap">
                      {formatDate(eq.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
