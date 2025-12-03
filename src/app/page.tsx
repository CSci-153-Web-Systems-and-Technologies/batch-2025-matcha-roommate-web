import Image from "next/image";
import Link from "next/link";
import { MapPin, User } from "lucide-react";

export type FeedItem = {
  post_id: string;
  type: 'room' | 'seeker';
  title: string;
  description: string;
  budget_or_price: number;
  location: string;
  images: string[] | null;
  first_name: string;
  avatar_url: string | null;
  created_at: string;
  user_id: string;
};

interface Props {
  item: FeedItem;
}

export default function ListingCard({ item }: Props) {
  // SAFETY CHECK: If item is undefined/null, do not render.
  if (!item) return null;

  // Safely handle images array (default to empty if null)
  const images = item.images || [];
  const hasImage = images.length > 0;
  
  const displayImage = hasImage 
    ? images[0] 
    : "/images/landing/looking-for-room.png"; 

  const destinationUrl = item.type === 'room' 
    ? `/rooms/${item.post_id || ''}` 
    : `/profiles/${item.user_id || ''}`;

  return (
    <Link href={destinationUrl} className="block h-full">
      <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-green-200 transition-all duration-300 flex flex-col h-full cursor-pointer">
        
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image
            src={displayImage}
            alt={item.title || "Listing"}
            width={600}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
            item.type === 'room' ? 'bg-green-600' : 'bg-blue-500'
          }`}>
            {item.type === 'room' ? 'ROOM FOR RENT' : 'LOOKING FOR ROOM'}
          </div>

          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-green-800 font-bold text-sm px-3 py-1 rounded-lg shadow-sm border border-green-100">
            ₱{item.budget_or_price?.toLocaleString()}<span className="text-xs font-normal text-gray-500">/mo</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1">
            {item.title}
          </h3>
          
          <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed flex-1">
            {item.description || "No description provided."}
          </p>
          
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{item.location}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              {item.avatar_url ? (
                 <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden relative">
                   <Image src={item.avatar_url} alt={item.first_name} fill className="object-cover" />
                 </div>
              ) : (
                 <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                   <User className="w-3 h-3" />
                 </div>
              )}
              {item.first_name}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}