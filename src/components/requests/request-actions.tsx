"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface RequestActionsProps {
  requestId: string;
  status: string;
  type: 'incoming' | 'outgoing';
  senderId: string;   
  receiverId: string;
  postId: string; // <--- ADDED THIS LINE TO FIX THE ERROR
}

export function RequestActions({ requestId, status, type, senderId, receiverId, postId }: RequestActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected') => {
    setLoading(true);
    try {
      // 1. Update Request Status
      const { error: updateError } = await supabase
        .from('housing_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // 2. Create Notification
      await supabase.from('notifications').insert({
        user_id: senderId,
        type: newStatus === 'accepted' ? 'request_accepted' : 'request_rejected',
        content: newStatus === 'accepted' 
          ? "Great news! Your request was ACCEPTED. ✅" 
          : "Update: Your request was declined.",
      });

      // 3. IF ACCEPTED: Auto-start Chat
      if (newStatus === 'accepted') {
        const { data: convId, error: rpcError } = await supabase.rpc('get_or_create_conversation', { 
          other_user_id: senderId 
        });
        
        if (rpcError) console.error("Chat creation failed:", rpcError);

        if (convId) {
          await supabase.from('messages').insert({
            conversation_id: convId,
            sender_id: receiverId, 
            content: "✅ I've accepted your request! Let's discuss the move-in details here.",
          });
        }
      }
      
      router.refresh(); 
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this request?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('housing_requests').delete().eq('id', requestId);
      if (error) throw error;
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---

  if (type === 'incoming') {
    if (status !== 'pending') return null;
    return (
      <div className="flex gap-2 w-full md:w-auto">
        <Button variant="outline" onClick={() => handleStatusUpdate('rejected')} disabled={loading} className="flex-1 bg-red-50 text-red-600 border-red-100 hover:bg-red-100">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Decline"}
        </Button>
        <Button onClick={() => handleStatusUpdate('accepted')} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Accept"}
        </Button>
      </div>
    );
  }

  if (type === 'outgoing') {
    if (status !== 'pending') return null;
    return (
      <Button variant="ghost" size="sm" onClick={handleCancel} disabled={loading} className="text-gray-400 hover:text-red-600">
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <span className="flex items-center gap-1"><Trash2 className="w-3 h-3" /> Cancel</span>}
      </Button>
    );
  }

  return null;
}