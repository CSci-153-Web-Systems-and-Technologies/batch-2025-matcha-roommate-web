import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import ListingFilters from "@/components/listings/ListingFilters";
import ListingCard, { FeedItem } from "@/components/listings/ListingCard"; // Import FeedItem type
import { listings } from "@/data/listings";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        
        {/* HERO SECTION */}
        <section className="bg-green-500 pt-24 pb-12 px-6 rounded-b-[2.5rem] shadow-sm">
          <div className="max-w-7xl mx-auto text-center mb-8 space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Find your <span className="text-green-100">perfect match</span>
              <br /> near VSU.
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              The safest way for VSU students and Baybay locals to find rooms, boarding houses, and compatible roommates.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6 justify-center">
            
            {/* Button 1: Owner */}
            <Link href="/register?redirect=/rooms/create" className="group block h-full">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-green-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start justify-center text-left h-full">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  Need a Roommate?
                </h3>
                <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-600">
                  List your property & find the perfect match
                </p>
                <div className="flex items-center gap-1 mt-4 text-green-600 font-bold text-base bg-green-50 px-4 py-2 rounded-full group-hover:bg-green-100 transition-colors">
                  List your Room <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Button 2: Seeker */}
            <Link href="/register?redirect=/profiles/create" className="group block h-full">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-green-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start justify-center text-left h-full">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  Looking for a Place?
                </h3>
                <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-600">
                  Browse listings & connect with roommates
                </p>
                <div className="flex items-center gap-1 mt-4 text-green-600 font-bold text-base bg-green-50 px-4 py-2 rounded-full group-hover:bg-green-100 transition-colors">
                  Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

          </div>
        </section>

        {/* LISTINGS SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Fresh Listings</h2>
              <p className="text-gray-500 mt-1">Newest rooms and roommate requests.</p>
            </div>
            <ListingFilters />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              // --- FIX IS HERE ---
              // We transform the old mock data into the new FeedItem format
              const feedItem: FeedItem = {
                post_id: listing.id.toString(),
                type: 'room', 
                title: listing.title,
                description: listing.description,
                budget_or_price: parseInt(listing.price), 
                location: listing.location,
                images: [listing.imageSrc], // Put the single string into an array
                first_name: "Host", 
                avatar_url: null,
                created_at: new Date().toISOString(),
                user_id: "mock-user-id"
              };

              return (
                <ListingCard
                  key={feedItem.post_id}
                  item={feedItem} // We pass the single 'item' object now
                />  
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}