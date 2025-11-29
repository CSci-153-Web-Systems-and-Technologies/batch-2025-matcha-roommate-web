"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { nearVsuLocations } from "@/data/nearVsuLocations";
import { Search } from "lucide-react";
import { createClient } from "@/utils/supabase/client"; // Import Supabase
import { User } from "@supabase/supabase-js"; // Import Type

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Track user state

  // Check auth on load
  useEffect(() => {
    const supabase = createClient();
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const filteredLocations = query
    ? nearVsuLocations.filter((loc) =>
        loc.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-green-500 border-b border-green-600 pr-(--removed-body-scroll-bar-size)">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Left: Logo + Name */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform bg-white">
            <Image
              src="/images/navbar/logo.png"
              alt="MatchaRoommate Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
            MatchaRoommate
          </span>
        </Link>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search location..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-green-700/40 border border-green-400/50 text-white placeholder-green-100 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 focus:ring-2 focus:ring-green-300 transition-all text-sm outline-none"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100" />
          </div>

          {/* Dropdown Results */}
          {showDropdown && filteredLocations.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50">
              <div className="max-h-64 overflow-y-auto">
                {filteredLocations.map((loc) => (
                  <button
                    key={loc}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setQuery(loc);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            // IF LOGGED IN: Show Dashboard Button
            <Link
              href="/dashboard"
              className="bg-white text-green-600 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-green-50 transition shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Go to Dashboard
            </Link>
          ) : (
            // IF LOGGED OUT: Show Login/Register
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-white/90 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-white text-green-600 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-green-50 transition shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden h-14 flex items-center justify-center border-t border-green-600">
        <span className="font-bold text-white">MatchaRoommate</span>
      </div>
    </nav>
  );
}