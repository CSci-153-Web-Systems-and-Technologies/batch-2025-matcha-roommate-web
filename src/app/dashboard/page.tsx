import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListingFilters from "@/components/listings/ListingFilters";
import ListingCard from "@/components/listings/ListingCard";
import { listings } from "@/data/listings";

export default function DashboardOverview() {
  return (
    <div className="space-y-6"> {/* Reduced space-y since we removed the cards */}
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening near VSU.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
           <Link href="/profiles/create">
            <Button variant="outline" className="gap-2 border-green-600 text-green-700 hover:bg-green-50">
              Update Profile
            </Button>
          </Link>

          <Link href="/rooms/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm font-bold">
              <Plus className="w-4 h-4" />
              List a Room
            </Button>
          </Link>
        </div>
      </div>
      
      {/* --- REMOVED: Stats Cards Grid --- */}

      {/* --- FEED SECTION --- */}
      <section className="pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            <p className="text-gray-500 text-sm mt-1">Based on your preferences and budget.</p>
          </div>
          <ListingFilters />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}