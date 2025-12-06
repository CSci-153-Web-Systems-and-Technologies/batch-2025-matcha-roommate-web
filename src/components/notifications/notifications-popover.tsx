"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel("notifications_box")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, 
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await supabase.from("notifications").delete().eq("id", id);
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open && unreadCount > 0) markAllRead();
    }}>
      <PopoverTrigger asChild>
        {/* ADDED: suppressHydrationWarning to ignore ID mismatch */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-white hover:bg-green-600 hover:text-white transition-colors rounded-full"
          suppressHydrationWarning={true}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-green-500 animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 bg-white border-gray-200 shadow-xl rounded-xl overflow-hidden" align="end">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h4 className="font-bold text-gray-900 text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">{unreadCount} new</span>
          )}
        </div>
        
        <div className="max-h-[350px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
              <Bell className="w-8 h-8 mb-2 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`relative group p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-green-50/40' : ''}`}
              >
                <div className="pr-6">
                  <p className="text-sm text-gray-800 leading-snug">
                    {notification.content}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1.5 block font-medium">
                    {timeAgo(notification.created_at)}
                  </span>
                </div>

                <button
                  onClick={(e) => deleteNotification(notification.id, e)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-50"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}