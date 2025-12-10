"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; 
import { User } from "@supabase/supabase-js"; 
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const supabase = createClient();
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  return (
    // CHANGED: bg-green-500 -> bg-green-600
    // CHANGED: border-green-600 -> border-green-700 (for subtle contrast)
    <nav className="fixed top-0 left-0 right-0 z-50 bg-green-600 border-b border-green-700">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
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

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button className="bg-white text-green-700 hover:bg-green-50 font-bold rounded-lg shadow-sm">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                 <Button variant="ghost" className="text-white hover:bg-green-700 hover:text-white font-medium">
                   Log In
                 </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-white text-green-700 hover:bg-green-50 font-bold rounded-lg shadow-sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}