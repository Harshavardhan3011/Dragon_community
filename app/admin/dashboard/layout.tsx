import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-dragon-bg-900 text-dragon-text overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Admin top header bar */}
        <AdminHeader />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-dragon-bg-900">
          {children}
        </main>
      </div>
    </div>
  );
}
