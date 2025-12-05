import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MyListingsGrid from "@/components/listings/my-listings-grid";
import { FeedItem } from "@/components/listings/ListingCard";

export default async function MyListingsPage() {
  const supabase = await createClient();

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch User's Posts from Unified Feed
  const { data: posts, error } = await supabase
    .from('unified_feed')
    .select('*')
    .eq('user_id', user.id) // Filter by logged-in user
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching my listings:", error);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        <p className="text-gray-500 mt-1">Manage your active room posts and requests.</p>
      </div>

      <MyListingsGrid 
        initialPosts={(posts as FeedItem[]) || []} 
        userId={user.id} 
      />
    </div>
  );
}