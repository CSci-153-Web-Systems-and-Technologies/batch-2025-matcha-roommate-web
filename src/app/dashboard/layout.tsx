"use client";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import ProfileCompletionModal from "@/components/dashboard/ProfileCompletionModal"; // <--- IMPORT MODAL
import { cn } from "@/lib/utils";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. THE ONBOARDING MODAL */}
      {/* This sits on top of everything and checks the user data */}
      <ProfileCompletionModal />

      <DashboardNavbar />
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