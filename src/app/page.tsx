// src/app/page.tsx
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import ListingFilters from "@/components/ListingFilters";
import ListingCard from "@/components/ListingCard";
import { listings } from "@/data/listings";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="pt-20 min-h-screen bg-amber-50">
        {/* Hero — Two perfect illustration buttons */}
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-24">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center justify-center">

            {/* Need a roommate? */}
            <Link href="/register" className="block">
              <div className="hover:scale-105 transition-transform duration-300">
                <Image
                  src="/images/landing/need-roommate.png"
                  alt="Need a roommate? List your room"
                  width={900}
                  height={450}
                  className="w-full max-w-sm md:max-w-md mx-auto select-none pointer-events-none"
                  priority
                />
              </div>
            </Link>

            {/* Looking for a room? */}
            <Link href="/register" className="block">
              <div className="hover:scale-105 transition-transform duration-300">
                <Image
                  src="/images/landing/looking-for-room.png"
                  alt="Looking for a room? Create Your Profile"
                  width={900}
                  height={450}
                  className="w-full max-w-sm md:max-w-md mx-auto select-none pointer-events-none"
                  priority
                />
              </div>
            </Link>

          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pt-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Title */}
            <h2 className="text-5xl md:text-6xl font-bold text-green-800 whitespace-nowrap">
              Listing
            </h2>

            {/* Filters — now on the same line on large screens */}
            <ListingFilters />
          </div>

          {/* Step 3: The 3 cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                imageSrc={listing.imageSrc}
                badge={listing.badge}
                price={listing.price}
                title={listing.title}
                description={listing.description}
                location={listing.location}
              />  
            ))}
          </div>
        </section>
      </main>
    </>
  );
}