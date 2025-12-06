"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, ChevronLeft } from "lucide-react"; // Added ChevronLeft
import Image from "next/image";

interface ChatWindowProps {
  conversationId: string | null;
  currentUserId: string;
  otherUser: {
    first_name: string;
    avatar_url: string | null;
  } | null;
  onBack: () => void; // 1. New Prop
}

export function ChatWindow({ conversationId, currentUserId, otherUser, onBack }: ChatWindowProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      
      if (data) setMessages(data);
      await supabase.rpc('mark_chat_read', { chat_id: conversationId });
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `conversation_id=eq.${conversationId}` 
      }, 
      async (payload) => {
        setMessages((prev) => {
          if (prev.some(msg => msg.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
        
        if (payload.new.sender_id !== currentUserId) {
           await supabase.rpc('mark_chat_read', { chat_id: conversationId });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    const text = newMessage;
    setNewMessage(""); 

    const optimisticMsg = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: text,
    });

    if (error) {
      console.error("Error sending:", error);
      alert("Failed to send message");
    } else {
      await supabase.from("conversations").update({ last_message_at: new Date() }).eq("id", conversationId);
    }
  };

  if (!conversationId || !otherUser) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
        <User className="w-16 h-16 mb-4 opacity-10" />
        <p className="font-medium text-lg">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white">
      
      {/* Header */}
      <div className="p-3 border-b border-gray-100 flex items-center gap-3 bg-white shrink-0 shadow-sm z-10">
        
        {/* 2. BACK BUTTON (Visible only on Mobile) */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden -ml-2 text-gray-600"
          onClick={onBack}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative border border-gray-100 shrink-0">
          {otherUser.avatar_url ? (
            <Image src={otherUser.avatar_url} alt={otherUser.first_name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400"><User className="w-5 h-5" /></div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 leading-tight">{otherUser.first_name}</h3>
          <span className="text-xs text-green-600 flex items-center gap-1 font-medium">● Online</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? "bg-green-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
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
          className="flex-1 bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-green-500 rounded-full px-4 h-10"
        />
        <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700 text-white rounded-full w-10 h-10 shrink-0 shadow-sm transition-transform active:scale-95">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}