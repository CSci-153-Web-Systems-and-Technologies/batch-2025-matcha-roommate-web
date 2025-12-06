"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();

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

  const handleBackToSidebar = () => {
    setActiveChatId(null);
    setActiveChatUser(null);
    router.replace('/dashboard/messages', { scroll: false });
  };

  if (!user) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <div className="h-[calc(100vh-7.5rem)] w-full">
      
      {/* 2. CHAT CARD: Uses FLEX instead of Grid for better control */}
      <div className="flex w-full h-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* SIDEBAR: Fixed width on desktop (w-80 or w-96), hidden on mobile if chat active */}
        <div className={`
          flex-col border-r border-gray-200 h-full bg-white
          w-full md:w-80 lg:w-96 shrink-0 
          ${activeChatId ? 'hidden md:flex' : 'flex'}
          `}>
          <div className="p-4 border-b border-gray-100 bg-white shrink-0 flex justify-between items-center h-16">
            <h2 className="font-bold text-gray-900 text-lg tracking-tight">Chats</h2>
          </div>
          
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ChatList 
              currentUserId={user.id} 
              activeId={activeChatId}
              onSelect={(id, otherUser) => {
                setActiveChatId(id);
                setActiveChatUser(otherUser);
                router.replace(`/dashboard/messages?chatId=${id}`, { scroll: false });
              }} 
            />
          </div>
        </div>

        {/* MAIN CHAT WINDOW: Flex-1 fills the remaining width */}
        <div className={`
          flex-1 flex-col h-full bg-slate-50 relative
          ${!activeChatId ? 'hidden md:flex' : 'flex'}
        `}>
          {/* We pass 'h-full' implicitly via the flex container */}
          <ChatWindow 
            conversationId={activeChatId} 
            currentUserId={user.id} 
            otherUser={activeChatUser}
            onBack={handleBackToSidebar}
          />
        </div>

      </div>
    </div>
  );
}