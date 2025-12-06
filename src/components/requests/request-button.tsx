"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarCheck, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

interface RequestButtonProps {
  postType: 'room' | 'seeker';
  postId: string;
  receiverId: string;
  className?: string;
}

export function RequestButton({ postType, postId, receiverId, className }: RequestButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');
  const router = useRouter();
  const supabase = createClient();

  // Dynamic Label Logic
  const label = postType === 'room' ? "Room Request" : "Roommate Request";
  const Icon = postType === 'room' ? CalendarCheck : UserPlus;
  const requestType = postType === 'room' ? 'application' : 'invite';

  const handleRequest = async () => {
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
      // Check if already requested
      const { data: existing } = await supabase
        .from('housing_requests')
        .select('id')
        .eq('sender_id', user.id)
        .eq('post_id', postId)
        .single();

      if (existing) {
        alert("You have already sent a request for this.");
        setLoading(false);
        return;
      }

      // Insert Request
      const { error } = await supabase.from('housing_requests').insert({
        sender_id: user.id,
        receiver_id: receiverId,
        post_id: postId,
        request_type: requestType,
        status: 'pending'
      });

      if (error) throw error;

      setStatus('sent');
      alert("Request sent successfully!");
      router.refresh();

    } catch (error: any) {
      alert("Error sending request: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'sent') {
    return (
      <Button disabled className={`bg-gray-100 text-gray-500 border-gray-200 ${className}`}>
        Request Sent
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleRequest} 
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