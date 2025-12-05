"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User } from "lucide-react";
import Image from "next/image";

interface ChatWindowProps {
  conversationId: string | null;
  currentUserId: string;
  otherUser: {
    first_name: string;
    avatar_url: string | null;
  } | null;
}

export function ChatWindow({ conversationId, currentUserId, otherUser }: ChatWindowProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Messages
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      
      if (data) setMessages(data);
    };

    fetchMessages();

    // Realtime Listener
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `conversation_id=eq.${conversationId}` 
      }, 
      (payload) => {
        // Only add if we don't already have it (prevents duplicates from optimistic update)
        setMessages((prev) => {
          if (prev.some(msg => msg.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  // 2. Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    const text = newMessage;
    setNewMessage(""); // Clear input

    // A. Optimistic Update (Show immediately)
    const optimisticMsg = {
      id: crypto.randomUUID(), // Temporary ID
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    // B. Send to Database
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: text,
    });

    if (error) {
      console.error("Error sending:", error);
      // Optional: Remove the message if it failed
      alert("Failed to send message");
    } else {
      // Update parent timestamp
      await supabase.from("conversations").update({ last_message_at: new Date() }).eq("id", conversationId);
    }
  };

  if (!conversationId || !otherUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 h-full text-gray-400 rounded-xl border border-gray-200">
        <User className="w-12 h-12 mb-2 opacity-20" />
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    // REMOVED fixed height (h-screen) so it fits the parent layout
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative border border-gray-100">
          {otherUser.avatar_url ? (
            <Image src={otherUser.avatar_url} alt={otherUser.first_name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400"><User className="w-5 h-5" /></div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{otherUser.first_name}</h3>
          <span className="text-xs text-green-600 flex items-center gap-1">● Online</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50" ref={scrollRef}>
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
        <Input 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Type a message..." 
          className="flex-1 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-green-500 rounded-full px-4"
        />
        <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700 text-white rounded-full w-10 h-10 shrink-0 shadow-sm">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}