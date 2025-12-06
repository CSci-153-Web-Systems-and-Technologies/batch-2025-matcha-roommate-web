"use client";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { cn } from "@/lib/utils";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <AppSidebar />

      <main 
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out pt-24 px-6 pb-6", // Padding creates the "Margin"
          isCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        {/* REMOVED the <div class="max-w-7xl mx-auto"> wrapper here */}
        {children}
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