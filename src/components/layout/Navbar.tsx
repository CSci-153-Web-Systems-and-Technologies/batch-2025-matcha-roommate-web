"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { nearVsuLocations } from "@/data/nearVsuLocations";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredLocations = query
    ? nearVsuLocations.filter((loc) =>
        loc.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-green-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 hidden md:flex items-center justify-between gap-8">
        {/* Left: Logo + Name */}
        <Link href="/" className="flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-transparent shrink-0 flex items-center justify-center">
            <Image
              src="/images/navbar/logo.png"
              alt="MatchaRoommate"
              width={200}
              height={200}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
              priority
            />
          </div>
          <span className="text-white text-xl md:text-2xl font-bold hidden sm:block">
            MatchaRoommate
          </span>
        </Link>

        {/* Center: Search Bar + Dropdown */}
        <div className="flex-1 max-w-2xl relative">
          <input
            type="text"
            placeholder="Search location, price, or roommate..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            className="w-full pl-12 pr-6 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-green-300 transition shadow-sm"
          />

          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>

          {/* 3-column dropdown */}
          {showDropdown && filteredLocations.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 z-50">
              <div className="grid grid-cols-3 gap-x-8 gap-y-6 max-h-96 overflow-y-auto">
                {filteredLocations.map((loc) => (
                  <button
                    key={loc}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setQuery(loc);
                      setShowDropdown(false);
                    }}
                    className="text-center group"
                  >
                    <span className="text-lg font-medium text-gray-900 group-hover:text-green-700 transition">
                      {loc}
                    </span>
                    <div className="mt-1 h-0.5 bg-gray-300 group-hover:bg-green-600 transition"></div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Login Button */}
        <Link
          href="/login"
          className="bg-white text-green-700 px-8 py-3 rounded-full font-bold hover:bg-green-50 transition shadow-md whitespace-nowrap"
        >
          Login
        </Link>
      </div>

      {/* Mobile version */}
      <div className="md:hidden flex items-center justify-center py-3">
        <Image
          src="/logo.png"
          alt="MatchaRoommate"
          width={48}
          height={48}
          className="rounded-full"
          priority
        />
      </div>
    </nav>
  );
}