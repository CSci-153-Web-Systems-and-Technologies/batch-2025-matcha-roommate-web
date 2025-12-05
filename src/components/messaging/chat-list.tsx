"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatListProps {
  currentUserId: string;
  activeId: string | null;
  onSelect: (id: string, user: any) => void;
}

export function ChatList({ currentUserId, activeId, onSelect }: ChatListProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchChats = async () => {
      // Fetch from our SQL VIEW 'my_conversations'
      const { data } = await supabase
        .from("my_conversations")
        .select("*")
        .eq("my_user_id", currentUserId)
        .order("last_message_at", { ascending: false });

      if (data) setConversations(data);
    };

    fetchChats();
    
    // Realtime subscription for new conversations
    const channel = supabase
      .channel('conversations_list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchChats)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUserId]);

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 text-sm">
        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
        <p>No messages yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      {conversations.map((chat) => (
        <button
          key={chat.conversation_id}
          onClick={() => onSelect(chat.conversation_id, { 
            first_name: chat.first_name, 
            avatar_url: chat.avatar_url 
          })}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl text-left transition-all",
            activeId === chat.conversation_id 
              ? "bg-green-50 border border-green-200 shadow-sm" 
              : "hover:bg-gray-50 border border-transparent"
          )}
        >
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative shrink-0 border border-gray-100">
            {chat.avatar_url ? (
              <Image src={chat.avatar_url} alt={chat.first_name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400"><User className="w-6 h-6" /></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-bold text-gray-900 truncate">{chat.first_name} {chat.last_name}</span>
              <span className="text-[10px] text-gray-400">
                {new Date(chat.last_message_at).toLocaleDateString()}
              </span>
            </div>
            <p className={cn(
              "text-xs truncate",
              activeId === chat.conversation_id ? "text-green-700 font-medium" : "text-gray-500"
            )}>
              {chat.last_message || "Started a conversation"}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}