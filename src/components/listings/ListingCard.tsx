import Image from "next/image";
import { MapPin } from "lucide-react"; // Cleaner icon

interface Props {
  imageSrc: string;
  badge?: "New" | null;
  price: string;
  title: string;
  description: string;
  location: string;
}

export default function ListingCard({ imageSrc, badge, price, title, description, location }: Props) {
  return (
    // CHANGED: rounded-3xl -> rounded-xl, shadow-md -> shadow-sm (Matches Dashboard stats cards)
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-green-200 transition-all duration-300">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          width={600}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        {badge === "New" && (
          <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            NEW
          </div>
        )}

        {/* Price Tag - Modernized */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-green-800 font-bold text-sm px-4 py-1.5 rounded-full shadow-sm border border-green-100">
          ₱{price}<span className="text-xs font-normal text-gray-500">/mo</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors">{title}</h3>
        <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">{description}</p>
        
        <div className="flex items-center gap-1 mt-4 text-gray-400 text-xs font-medium">
          <MapPin className="w-3.5 h-3.5" />
          {location}
        </div>
      </div>
    </div>
  );
}