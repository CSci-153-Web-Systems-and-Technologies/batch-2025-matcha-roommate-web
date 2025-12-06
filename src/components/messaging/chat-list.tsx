"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { User, MessageSquare } from "lucide-react";
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
      const { data } = await supabase
        .from("my_conversations")
        .select("*")
        .eq("my_user_id", currentUserId)
        .order("last_message_at", { ascending: false });

      if (data) setConversations(data);
    };

    fetchChats();
    
    const channel = supabase
      .channel('conversations_list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchChats)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUserId]);

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400 text-sm p-4">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
           <MessageSquare className="w-6 h-6 opacity-30" />
        </div>
        <p>No conversations yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-3">
      {conversations.map((chat) => (
        <button
          key={chat.conversation_id}
          onClick={() => onSelect(chat.conversation_id, { 
            first_name: chat.first_name, 
            avatar_url: chat.avatar_url 
          })}
          className={cn(
            "flex items-center gap-4 p-3 rounded-xl text-left transition-all duration-200",
            activeId === chat.conversation_id 
              ? "bg-green-50/80 border-green-100 shadow-sm ring-1 ring-green-100" 
              : "hover:bg-gray-50 border-transparent"
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
            <div className="flex justify-between items-center mb-1">
              <span className={cn(
                "font-bold truncate text-sm",
                activeId === chat.conversation_id ? "text-green-900" : "text-gray-900"
              )}>
                {chat.first_name} {chat.last_name}
              </span>
              <span className="text-[10px] text-gray-400">
                {new Date(chat.last_message_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p className={cn(
              "text-xs truncate max-w-[180px]",
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