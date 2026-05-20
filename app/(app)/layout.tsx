import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      <Sidebar />
      <div className="md:pl-64">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
