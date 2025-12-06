"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, X } from "lucide-react"; // Added 'X' icon
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";
import { NotificationsPopover } from "@/components/notifications/notifications-popover";
import { createClient } from "@/utils/supabase/client";

export function DashboardNavbar() {
  const { toggleSidebar } = useSidebar();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initials, setInitials] = useState("?");
  
  // --- SEARCH STATE ---
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || ""); 

  // Sync Input with URL (Handles browser back button or page refresh)
  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Helper to push URL updates
  const updateSearchParam = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term.trim()) {
      params.set("search", term.trim());
    } else {
      params.delete("search");
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParam(query);
  };

  // 1. FIXED: Auto-reset when text is erased
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setQuery(newVal);
    
    // If the user clears the input completely, reset the search immediately
    if (newVal === "") {
      updateSearchParam("");
    }
  };

  // 2. NEW: "X" Button Handler
  const clearSearch = () => {
    setQuery("");
    updateSearchParam(""); // Clears URL immediately
  };

  // --- USER FETCHING ---
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url, first_name, last_name')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          setAvatarUrl(profile.avatar_url);
          const first = profile.first_name?.[0] || "";
          const last = profile.last_name?.[0] || "";
          setInitials((first + last).toUpperCase() || "?");
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-green-500 border-b border-green-600 z-50 flex items-center justify-between shadow-sm px-2 sm:px-1 lg:px-2 transition-all">
      
      {/* LEFT: Logo */}
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
          <span className="text-lg font-bold text-white tracking-tight hidden lg:block">
            MatchaRoommate
          </span>
        </Link>
      </div>

      {/* CENTER: Interactive Search Bar */}
      <div className="flex-1 max-w-xl mx-2 md:mx-4">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            placeholder="Search listings..."
            value={query}
            onChange={handleInputChange} // Uses the new smart handler
            className="w-full pl-9 sm:pl-10 pr-10 py-2 rounded-full bg-green-700/30 border border-green-400/30 text-white placeholder-green-100 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all text-sm"
          />
          
          {/* Search Icon (Left) */}
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-green-100 hover:text-white group-focus-within:text-gray-400 group-focus-within:hover:text-green-600">
            <Search className="w-4 h-4" />
          </button>

          {/* Clear "X" Icon (Right) - Only shows when there is text */}
          {query && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-100 hover:text-white group-focus-within:text-gray-400 group-focus-within:hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* RIGHT: Profile */}
      <div className="flex items-center gap-2 sm:gap-4 mr-1">
        <NotificationsPopover />
        <Link href="/dashboard/profile">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-green-400/50 shadow-inner relative flex items-center justify-center bg-green-200 hover:border-white transition-colors cursor-pointer">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Profile" fill className="object-cover" />
            ) : (
              <span className="text-green-800 font-bold text-xs sm:text-sm">{initials}</span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}