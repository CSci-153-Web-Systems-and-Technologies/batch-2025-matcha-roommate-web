"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";

interface MessageButtonProps {
  targetUserId: string;
  targetName?: string;
  className?: string;
}

export function MessageButton({ targetUserId, targetName, className }: MessageButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleMessage = async () => {
    setLoading(true);
    
    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // 2. Prevent messaging yourself
    if (user.id === targetUserId) {
      alert("You cannot message yourself!");
      setLoading(false);
      return;
    }

    try {
      // 3. Call our SQL Function (make sure you ran the SQL from the previous step!)
      const { data: conversationId, error } = await supabase.rpc(
        'get_or_create_conversation', 
        { other_user_id: targetUserId }
      );

      if (error) throw error;

      // 4. Redirect to the chat
      router.push(`/dashboard/messages?chatId=${conversationId}`);

    } catch (err: any) {
      console.error("Chat Error:", err);
      alert("Could not start conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleMessage} 
      disabled={loading} 
      className={className ?? "w-full bg-green-600 hover:bg-green-700 text-white font-bold"}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <MessageCircle className="w-4 h-4 mr-2" />
      )}
      {loading ? "Starting Chat..." : `Message ${targetName || "Owner"}`}
    </Button>
  );
}