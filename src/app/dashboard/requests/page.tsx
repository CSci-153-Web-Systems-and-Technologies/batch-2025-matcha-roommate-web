import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function RequestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Fetch Incoming Requests
  const { data: incoming } = await supabase
    .from('housing_requests')
    .select(`
      *,
      sender:profiles!sender_id(*),
      post:posts!post_id(title, type)
    `)
    .eq('receiver_id', user.id)
    .order('created_at', { ascending: false });

  // 2. Fetch Outgoing Requests
  const { data: outgoing } = await supabase
    .from('housing_requests')
    .select(`
      *,
      receiver:profiles!receiver_id(*),
      post:posts!post_id(title, type)
    `)
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
          <TabsTrigger value="incoming">Incoming ({incoming?.length || 0})</TabsTrigger>
          <TabsTrigger value="outgoing">Sent ({outgoing?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4 mt-6">
          {incoming?.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No requests received yet.</p>
          ) : (
            incoming?.map((req) => (
              <RequestCard key={req.id} request={req} type="incoming" />
            ))
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-4 mt-6">
          {outgoing?.length === 0 ? (
            <p className="text-gray-500 text-center py-10">You haven't sent any requests.</p>
          ) : (
            outgoing?.map((req) => (
              <RequestCard key={req.id} request={req} type="outgoing" />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RequestCard({ request, type }: { request: any, type: 'incoming' | 'outgoing' }) {
  const otherUser = type === 'incoming' ? request.sender : request.receiver;
  const isRoomRequest = request.request_type === 'application';

  return (
    <Card>
      <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden relative border shrink-0">
             {otherUser?.avatar_url && <Image src={otherUser.avatar_url} fill alt="Avatar" className="object-cover" />}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              {otherUser?.first_name} {otherUser?.last_name}
              <Badge variant="outline" className={isRoomRequest ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}>
                {isRoomRequest ? "Room Request" : "Roommate Request"}
              </Badge>
            </h4>
            <p className="text-sm text-gray-500 mt-0.5">
              for <span className="font-medium text-gray-700">{request.post?.title || "Unknown Post"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {request.status === 'pending' ? (
             type === 'incoming' ? (
               <div className="flex gap-2 w-full">
                 <button className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-bold">Decline</button>
                 <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold">Accept</button>
               </div>
             ) : (
               <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 px-3 py-1">Pending</Badge>
             )
          ) : (
            <Badge variant="secondary" className="capitalize">{request.status}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}