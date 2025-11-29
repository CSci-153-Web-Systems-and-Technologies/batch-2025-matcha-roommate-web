"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client"; // Import the helper we made

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Collect data from the form
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const middleInitial = formData.get("middleInitial") as string;
    const contact = formData.get("contact") as string;

    // 2. Initialize Supabase
    const supabase = createClient();

    // 3. Send to Supabase
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // We save these details as "User Metadata"
        data: {
          first_name: firstName,
          last_name: lastName,
          middle_initial: middleInitial,
          contact_number: contact,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // 4. Redirect on Success
      // Note: By default, Supabase might require email confirmation.
      // For now, we assume it lets them in or you disabled confirmation in settings.
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-2xl">
      <CardContent className="p-0 md:grid md:grid-cols-2">
        
        {/* Left Side: The Form */}
        <div className="p-8 md:p-12 bg-white">
          <div className="mx-auto max-w-md space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-green-800">Create Account</h1>
              <p className="mt-2 text-muted-foreground">
                Join MatchaRoommate today.
              </p>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="Juan" required />
                </div>
                <div className="space-y-2 w-20">
                  <Label htmlFor="middleInitial">M.I.</Label>
                  <Input id="middleInitial" name="middleInitial" placeholder="D." maxLength={2} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" placeholder="Dela Cruz" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input id="contact" name="contact" type="tel" placeholder="0912 345 6789" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@vsu.edu.ph" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>

              <Button 
                type="submit" 
                className="h-12 w-full text-lg font-semibold bg-green-700 hover:bg-green-800 mt-2"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="h-12 w-full text-lg">
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 6.75c1.65 0 3.12.63 4.29 1.83l3.21-3.21C17.46 3.06 14.97 2 12 2 7.7 2 3.99 4.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-green-700 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side Visuals */}
         <div className="relative hidden md:flex flex-col items-center justify-center bg-linear-to-br from-green-600 to-green-800 px-12 py-16 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 text-center max-w-lg space-y-10">
            <div className="mx-auto w-48 h-48 rounded-full overflow-hidden flex items-center justify-center border-4 border-white/20">
              <img
                src="/images/logo/logo.jpg" 
                alt="MatchaRoommate"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                Welcome to the Community
              </h2>
              <p className="text-lg md:text-xl leading-relaxed opacity-95">
                Connect with students, find affordable listings, and meet your perfect roommate match.
              </p>
            </div>
          </div>
        </div>
        
      </CardContent>
    </Card>
  );
}