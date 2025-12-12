"use client";

import { Suspense } from "react"; // <--- 1. Import Suspense
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import ProfileCompletionModal from "@/components/dashboard/ProfileCompletionModal"; 
import { cn } from "@/lib/utils";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileCompletionModal />

      {/* 2. Wrap Navbar in Suspense */}
      <Suspense fallback={<div className="h-16 w-full bg-green-600 fixed top-0 z-50" />}>
        <DashboardNavbar />
      </Suspense>
      
      <AppSidebar />

      <main 
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out pt-24 pb-6 px-4 sm:px-6 md:px-8", 
          isCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
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