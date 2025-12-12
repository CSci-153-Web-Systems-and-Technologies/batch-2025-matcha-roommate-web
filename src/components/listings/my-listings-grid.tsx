"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ListingCard, { FeedItem } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MyListingsGridProps {
  initialPosts: FeedItem[];
  userId: string;
}

export default function MyListingsGrid({ initialPosts, userId }: MyListingsGridProps) {
  const [posts, setPosts] = useState<FeedItem[]>(initialPosts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (postId: string) => {
    setDeletingId(postId);
    try {
      // 1. Delete from the master 'posts' table
      // (Cascading delete will remove room_posts, images, etc.)
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId); // Security check: Ensure owner

      if (error) throw error;

      // 2. Update UI instantly
      setPosts((prev) => prev.filter((p) => p.post_id !== postId));
      router.refresh();

    } catch (error: any) {
      alert("Error deleting post: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No listings yet</h3>
        <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
          You haven't posted any rooms or roommate requests yet.
        </p>
        <Button onClick={() => router.push('/rooms/create')} className="bg-green-600 hover:bg-green-700">
          Create your first listing
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post.post_id} className="relative group">
          {/* Reuse your existing Card */}
          <ListingCard item={post} />

          {/* Overlay Actions */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="destructive" className="h-8 w-8 shadow-md">
                  {deletingId === post.post_id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this listing. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDelete(post.post_id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}