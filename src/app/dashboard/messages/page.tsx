"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ChatList } from "@/components/messaging/chat-list";
import { ChatWindow } from "@/components/messaging/chat-window";
import { Loader2 } from "lucide-react";

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<any>(null);
  
  const supabase = createClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const paramChatId = searchParams.get("chatId");
      if (paramChatId) {
        setActiveChatId(paramChatId);
        
        const { data: participants } = await supabase
          .from("participants")
          .select("profiles(first_name, avatar_url)")
          .eq("conversation_id", paramChatId)
          .neq("user_id", user?.id)
          .single();
          
        if (participants?.profiles) {
          setActiveChatUser(participants.profiles);
        }
      }
    };
    init();
  }, [searchParams]);

  if (!user) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    // CONTAINER: Centers the content vertically and horizontally
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      
      {/* CHAT CARD: Fixed max-width and max-height for that "just right" feel */}
      <div className="w-full max-w-5xl h-[85vh] max-h-[700px] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Sidebar */}
        <div className={`flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
            <h2 className="font-bold text-gray-800 text-lg">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatList 
              currentUserId={user.id} 
              activeId={activeChatId}
              onSelect={(id, otherUser) => {
                setActiveChatId(id);
                setActiveChatUser(otherUser);
                window.history.replaceState(null, '', '/dashboard/messages');
              }} 
            />
          </div>
        </div>

        {/* Main Chat Window */}
        <div className={`md:col-span-2 lg:col-span-3 h-full ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <ChatWindow 
            conversationId={activeChatId} 
            currentUserId={user.id} 
            otherUser={activeChatUser}
          />
        </div>

      </div>
    </div>
  );
}