"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";

export function DashboardNavbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-green-500 border-b border-green-600 z-50 flex items-center px-4 justify-between shadow-sm">
      
      {/* LEFT: Hamburger + Logo */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-white hover:bg-green-600 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </Button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 shadow-sm">
            <Image
              src="/images/navbar/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-lg font-bold text-white tracking-tight hidden sm:block">
            MatchaRoommate
          </span>
        </Link>
      </div>

      {/* CENTER: Search Bar (Hidden on small mobile) */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search listings..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-green-700/30 border border-green-400/30 text-white placeholder-green-100 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all text-sm"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100" />
        </div>
      </div>

      {/* RIGHT: Profile / Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-white hover:bg-green-600">
          <Bell className="w-5 h-5" />
        </Button>
        <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">
          JP
        </div>
      </div>
    </header>
  );
}