"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, User, MessageSquare, List, Bell, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/client"; // Import Supabase

// ... sidebarItems logic stays the same ...
const sidebarItems = [
  { icon: Home, label: "Overview", href: "/dashboard" },
  { icon: User, label: "My Profile", href: "/dashboard/profile" },
  { icon: List, label: "My Listings", href: "/dashboard/listings" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", count: 3 },
  { icon: Bell, label: "Requests", href: "/dashboard/requests", count: 12 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter(); // Initialize Router
  const { isCollapsed, isMobile, toggleSidebar } = useSidebar();

  // --- Handle Sign Out ---
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login"); // Redirect to login
    router.refresh(); // Clear cache
  };

  const NavList = () => (
    <nav className="flex-1 py-4 space-y-1">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-4 py-3 text-sm font-medium transition-colors relative group",
              isActive
                ? "text-green-600 bg-green-50 border-r-4 border-green-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              isCollapsed && !isMobile ? "justify-center px-2" : "" 
            )}
          >
            {/* Icon Container */}
            <div className="relative">
              <item.icon className={cn("w-6 h-6 shrink-0", isActive ? "text-green-600" : "text-gray-500")} />
              {isCollapsed && !isMobile && item.count && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white">
                  {item.count > 9 ? '9+' : item.count}
                </span>
              )}
            </div>
            
            {/* Text & Badge */}
            {(!isCollapsed || isMobile) && (
              <div className="flex flex-1 items-center justify-between truncate">
                <span>{item.label}</span>
                {item.count && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green-100 px-1.5 text-xs font-bold text-green-700">
                    {item.count}
                  </span>
                )}
              </div>
            )}

            {/* Hover Tooltip (Mini Mode) */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {item.label}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );

  if (isMobile) {
    return (
      <Sheet open={!isCollapsed} onOpenChange={toggleSidebar}>
        <SheetContent side="left" className="p-0 w-64 bg-white border-r-0">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
             <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">M</div>
             <span className="font-bold text-green-800">MatchaRoommate</span>
          </div>
          <NavList />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-white border-r border-gray-200 h-[calc(100vh-64px)] fixed left-0 top-16 transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <NavList />
      
      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button 
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-4 w-full text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors p-2",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="w-6 h-6 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}