import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
// 1. IMPORT THE NEW COMPONENT
import { RequestActions } from "@/components/requests/request-actions";

export default async function RequestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch Incoming
  const { data: incoming } = await supabase
    .from('housing_requests')
    .select(`*, sender:profiles!sender_id(*), post:posts!post_id(title, type)`)
    .eq('receiver_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch Outgoing
  const { data: outgoing } = await supabase
    .from('housing_requests')
    .select(`*, receiver:profiles!receiver_id(*), post:posts!post_id(title, type)`)
    .eq('sender_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
        <p className="text-gray-500 mt-1">Manage your applications and roommate invites.</p>
      </div>

      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          {/* Show count of PENDING requests only */}
          <TabsTrigger value="incoming">Incoming ({incoming?.filter(r => r.status === 'pending').length || 0})</TabsTrigger>
          <TabsTrigger value="outgoing">Sent ({outgoing?.filter(r => r.status === 'pending').length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4 mt-6">
          {incoming?.length === 0 ? <p className="text-gray-500 text-center py-10">No requests.</p> : incoming?.map(req => <RequestCard key={req.id} request={req} type="incoming" />)}
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-4 mt-6">
          {outgoing?.length === 0 ? <p className="text-gray-500 text-center py-10">No requests sent.</p> : outgoing?.map(req => <RequestCard key={req.id} request={req} type="outgoing" />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RequestCard({ request, type }: { request: any, type: 'incoming' | 'outgoing' }) {
  const otherUser = type === 'incoming' ? request.sender : request.receiver;
  const isRoomRequest = request.request_type === 'application';
  
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    accepted: "bg-green-100 text-green-700 hover:bg-green-100",
    rejected: "bg-red-100 text-red-700 hover:bg-red-100",
  };

  return (
    <Card>
      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden relative border shrink-0">
             {otherUser?.avatar_url && <Image src={otherUser.avatar_url} fill alt="Avatar" className="object-cover" />}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              {otherUser?.first_name} {otherUser?.last_name}
              <Badge variant="outline" className={isRoomRequest ? "text-blue-700 bg-blue-50" : "text-purple-700 bg-purple-50"}>
                {isRoomRequest ? "Room Request" : "Roommate Invite"}
              </Badge>
            </h4>
            <p className="text-sm text-gray-500 mt-0.5">
              for <span className="font-medium text-gray-700">{request.post?.title || "Unknown Post"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Show Status Badge if NOT pending (or if it's outgoing) */}
          {(request.status !== 'pending' || type === 'outgoing') && (
             <Badge className={`px-3 py-1 capitalize ${statusColors[request.status]}`}>
               {request.status}
             </Badge>
          )}

          {/* 2. INSERT THE ACTION COMPONENT HERE */}
          <RequestActions 
            requestId={request.id} 
            status={request.status} 
            type={type}
            senderId={request.sender_id}
            receiverId={request.receiver_id}
          />
        </div>
      </CardContent>
    </Card>
  );
}