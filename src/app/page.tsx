// src/app/page.tsx
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="pt-20 min-h-screen bg-amber-50">
        {/* Hero — Two perfect illustration buttons */}
        <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Need a roommate? */}
            <Link href="/register" className="block group">
              <div className="transform transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/images/landing/need-roommate.png"
                  alt="Need a roommate? List your room"
                  width={400}
                  height={400}
                  className="w-full h-auto select-none pointer-events-none"  // ← THIS is the magic
                  priority
                />
              </div>
            </Link>

            {/* Looking for a room? */}
            <Link href="/register" className="block group">
              <div className="transform transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/images/landing/looking-for-room.png"
                  alt="Looking for a room? Create Your Profile"
                  width={400}
                  height={400}
                  className="w-full h-auto select-none pointer-events-none"  // ← same here
                  priority
                />
              </div>
            </Link>
          </div>
        </section>

        {/* Placeholder for the listings section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-bold text-green-800 text-center mb-12">
            Listings section coming next...
          </h2>
        </section>
      </main>
    </>
  );
}