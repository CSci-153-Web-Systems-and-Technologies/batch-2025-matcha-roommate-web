"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";
import { NotificationsPopover } from "@/components/notifications/notifications-popover";

export function DashboardNavbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-green-500 border-b border-green-600 z-50 flex items-center justify-between shadow-sm px-2 sm:px-2 lg:px-3 transition-all">
      
      {/* LEFT CONTAINER */}
      <div className="flex items-center gap-3 sm:gap-4 ml-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-white hover:bg-green-600 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </Button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 shadow-sm shrink-0">
            <Image
              src="/images/navbar/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {/* Hide text on mobile to save space for search bar */}
          <span className="text-lg font-bold text-white tracking-tight hidden lg:block">
            MatchaRoommate
          </span>
        </Link>
      </div>

      {/* CENTER: Search Bar (NOW VISIBLE ON MOBILE) */}
      {/* Changed: Removed 'hidden md:block' and adjusted margins */}
      <div className="flex-1 max-w-xl mx-2 md:mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 sm:pl-10 pr-4 py-2 rounded-full bg-green-700/30 border border-green-400/30 text-white placeholder-green-100 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100" />
        </div>
      </div>

   
      <div className="flex items-center gap-2 sm:gap-4 mr-1">
        
        <NotificationsPopover />

        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-xs sm:text-sm shadow-inner border-2 border-green-400/50">
          JP
        </div>
      </div>
    </header>
  );
}