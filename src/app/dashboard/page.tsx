import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react"; // Added Search icon
import ListingFilters from "@/components/listings/ListingFilters";
import ListingCard, { FeedItem } from "@/components/listings/ListingCard";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardOverview() {
  const supabase = await createClient();

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
           {/* CHANGED: "Update Profile" -> "Room Wanted" */}
           <Link href="/profiles/create">
            <Button variant="outline" className="gap-2 border-green-600 text-green-700 hover:bg-green-50 font-bold">
              <Search className="w-4 h-4" />
              Room Wanted
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
      
      {/* FEED SECTION */}
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
                key={`${post.type}-${post.post_id}`} 
                item={post as FeedItem} 
              />  
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No listings found</h3>
              <p className="text-gray-500 max-w-sm mx-auto mt-2">
                It looks like the feed is empty right now. Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}