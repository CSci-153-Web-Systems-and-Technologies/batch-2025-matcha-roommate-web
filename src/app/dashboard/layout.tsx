"use client";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { cn } from "@/lib/utils";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Top Navbar (Fixed, h-16 = 64px) */}
      <DashboardNavbar />

      {/* 2. Sidebar (Fixed Left) */}
      <AppSidebar />

      {/* 3. Main Content Area */}
      <main 
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out pt-24 px-6 pb-6",
          isCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}