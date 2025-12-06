import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import ListingFilters from "@/components/listings/ListingFilters";
import ListingCard, { FeedItem } from "@/components/listings/ListingCard";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardOverview({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const params = await searchParams;

  let query = supabase
    .from('unified_feed')
    .select('*')
    .order('created_at', { ascending: false }); // It sorts by newest, so the title fits perfectly

  // --- 1. SEARCH FILTER ---
  if (params.search) {
    const term = `%${params.search}%`;
    query = query.or(`title.ilike.${term},description.ilike.${term},location.ilike.${term}`);
  }

  // --- 2. TYPE FILTER ---
  if (params.type && params.type !== 'all') {
    query = query.eq('type', params.type);
  }

  // --- 3. SORTING LOGIC ---
  if (params.sort === 'price_asc') {
    query = query.order('budget_or_price', { ascending: true });
  } else if (params.sort === 'price_desc') {
    query = query.order('budget_or_price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data: posts, error } = await query;

  if (error) console.error("Error fetching feed:", error);

  return (
    <div className="space-y-6 w-full">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening near VSU.</p>
        </div>

        <div className="flex gap-3">
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
        <div className="flex flex-col gap-6 mb-8">
          <div>
            {/* CHANGED: Neutral Title & Description */}
            <h2 className="text-2xl font-bold text-gray-900">Latest Listings</h2>
            <p className="text-gray-500 text-sm mt-1">Browse the newest rooms and roommate requests.</p>
          </div>
          <ListingFilters />
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <ListingCard
                key={`${post.type}-${post.post_id}`} 
                item={post as FeedItem} 
              />  
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No results found for "{params.search}"</h3>
              <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
                Try a different keyword or sort order.
              </p>
              
              <Link href="/dashboard">
                <Button variant="outline">Clear Search</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}