import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-40px)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64 bg-gradient-to-br from-[#0f0f23] to-[#1a1a3e]">
        {children}
      </main>
    </div>
  );
}
