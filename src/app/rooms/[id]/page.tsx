import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DashboardShell } from "@/components/layout/DashboardShell"; 
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Check, ArrowLeft, ShieldCheck, MessageCircle } from "lucide-react";
import { RoomImageGallery } from "@/components/rooms/RoomImageGallery"; 
import { MessageButton } from "@/components/messaging/message-button"; 
import { RequestButton } from "@/components/requests/request-button";

const formatPrice = (price: number) => 
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(price);

export default async function RoomDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      room_posts (
        price, location, address, payment_scheme, capacity, available_slots, lister_type,
        amenities ( amenity )
      ),
      images ( url ),
      profiles (
        first_name, last_name, avatar_url, contact_number, is_verified
      )
    `)
    .eq('id', id)
    .single();

  if (error || !post || !post.room_posts || post.room_posts.length === 0) {
    return notFound();
  }

  const roomDetails = post.room_posts[0];
  const owner = post.profiles as any;
  const imageUrls = post.images?.map((img: any) => img.url) || [];
  const amenitiesList = roomDetails.amenities?.map((a: any) => a.amenity) || [];

  return (
    <DashboardShell>
      {/* FIXED: Removed 'max-w-7xl mx-auto', added 'w-full' */}
      <div className="w-full">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Feed
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl overflow-hidden shadow-sm bg-gray-200 h-[300px] md:h-[500px] relative">
               <RoomImageGallery images={imageUrls} title={post.title} />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
               <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                  <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm md:text-base">
                    <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                    <span>{roomDetails.location}</span>
                    {roomDetails.address && <span className="hidden md:inline text-gray-300">•</span>}
                    {roomDetails.address && <span className="hidden md:inline">{roomDetails.address}</span>}
                  </div>
                </div>
                <div className="text-left md:text-right bg-green-50 md:bg-transparent p-4 md:p-0 rounded-xl">
                  <p className="text-3xl font-bold text-green-700">{formatPrice(roomDetails.price)}</p>
                  <p className="text-sm text-gray-500 font-medium">per month ({roomDetails.payment_scheme})</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6 border-t border-gray-100 pt-6">
                <Badge variant="secondary" className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                  {roomDetails.capacity} Pax Capacity
                </Badge>
                <Badge variant="secondary" className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                  {roomDetails.available_slots} Slot{roomDetails.available_slots > 1 ? 's' : ''} Left
                </Badge>
                <Badge variant="secondary" className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200 capitalize">
                  {roomDetails.lister_type}
                </Badge>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this place</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {post.description || "No description provided."}
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              {amenitiesList.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenitiesList.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-green-700" />
                      </div>
                      <span className="text-sm md:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No amenities listed.</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Listed by</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden relative border-2 border-green-500 shrink-0">
                  {owner?.avatar_url ? (
                    <Image src={owner.avatar_url} alt={owner.first_name || "User"} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-700">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900 leading-tight">
                    {owner?.first_name} {owner?.last_name}
                  </p>
                  <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                    {owner?.is_verified ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Owner
                      </>
                    ) : "Community Member"}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <RequestButton 
                  postType="room"
                  postId={post.id}
                  receiverId={post.user_id}
                  className="w-full h-12 text-base"
                />
                <MessageButton 
                  targetUserId={post.user_id} 
                  targetName={owner?.first_name} 
                  className="w-full h-12 bg-white text-green-700 border-2 border-green-600 hover:bg-green-50 font-bold"
                />
                <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200 mt-4">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Contact Number</p>
                  <p className="text-lg font-mono text-gray-900 font-bold tracking-wide">
                    {owner?.contact_number || "Hidden"}
                  </p>
                </div>
              </div>
               <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  Safety Tip: Always view the room in person and meet in public places before paying any deposit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}