"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarCheck, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface RequestButtonProps {
  postType: 'room' | 'seeker';
  postId: string;
  receiverId: string;
  className?: string;
}

export function RequestButton({ postType, postId, receiverId, className }: RequestButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // Loading state for initial check
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // Dynamic Label Logic
  const label = postType === 'room' ? "Room Request" : "Roommate Request";
  const Icon = postType === 'room' ? CalendarCheck : UserPlus;
  const requestType = postType === 'room' ? 'application' : 'invite';

  // 1. Check for existing request on mount
  useEffect(() => {
    const checkRequest = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsChecking(false);
        return;
      }

      // Check if I already sent a request for this SPECIFIC post
      const { data } = await supabase
        .from('housing_requests')
        .select('id')
        .eq('sender_id', user.id)
        .eq('post_id', postId)
        .single();

      if (data) {
        setCurrentRequestId(data.id);
      }
      setIsChecking(false);
    };

    checkRequest();
  }, [postId, supabase]);

  const handleToggleRequest = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.id === receiverId) {
      alert("You cannot send a request to yourself.");
      setLoading(false);
      return;
    }

    try {
      if (currentRequestId) {
        // --- SCENARIO A: CANCEL REQUEST ---
        const { error } = await supabase
          .from('housing_requests')
          .delete()
          .eq('id', currentRequestId);

        if (error) throw error;

        setCurrentRequestId(null); // Switch UI back to "Send"
      } else {
        // --- SCENARIO B: SEND REQUEST ---
        const { data, error } = await supabase
          .from('housing_requests')
          .insert({
            sender_id: user.id,
            receiver_id: receiverId,
            post_id: postId,
            request_type: requestType,
            status: 'pending'
          })
          .select('id') // Get the new ID back
          .single();

        if (error) throw error;

        setCurrentRequestId(data.id); // Switch UI to "Cancel"
      }

      router.refresh(); // Refresh server components (like the Dashboard count)

    } catch (error: any) {
      alert("Error updating request: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show a loading spinner while checking status (prevents button flashing)
  if (isChecking) {
    return (
      <Button disabled className={`bg-gray-100 text-gray-400 border-gray-200 ${className}`}>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...
      </Button>
    );
  }

  // --- STATE 1: REQUEST ALREADY SENT (Show Cancel) ---
  if (currentRequestId) {
    return (
      <Button 
        onClick={handleToggleRequest} 
        disabled={loading} 
        variant="outline"
        className={`bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 font-bold shadow-sm ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <X className="w-4 h-4 mr-2" />
        )}
        Cancel Request
      </Button>
    );
  }

  // --- STATE 2: NO REQUEST (Show Send) ---
  return (
    <Button 
      onClick={handleToggleRequest} 
      disabled={loading} 
      className={`bg-green-600 hover:bg-green-700 text-white font-bold shadow-md ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Icon className="w-4 h-4 mr-2" />
      )}
      {label}
    </Button>
  );
}