import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ListingFilters from "@/components/listings/ListingFilters";
import ListingCard, { FeedItem } from "@/components/listings/ListingCard"; // Updated Import
import { createClient } from "@/utils/supabase/server"; // Server Client

export default async function DashboardOverview() {
  const supabase = await createClient();

  // Fetch data from our new View
  const { data: posts, error } = await supabase
    .from('unified_feed')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching feed:", error);
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening near VSU.</p>
        </div>

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
      
      {/* FEED */}
      <section className="pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            <p className="text-gray-500 text-sm mt-1">Based on your preferences and budget.</p>
          </div>
          <ListingFilters />
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <ListingCard
                key={post.post_id}
                item={post as FeedItem} // Cast to our type
              />  
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
              <p>No listings found yet. Be the first to post!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}