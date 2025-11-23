// src/components/ListingCard.tsx
import Image from "next/image";

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
    <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={imageSrc}
          alt={title}
          width={600}
          height={400}
          className="w-full h-56 object-cover"
        />

        {/* Green "New" badge — top-left */}
        {badge === "New" && (
          <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow">
            New
          </div>
        )}

        {/* Orange price pill — centered at bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white font-bold text-lg px-6 py-3 rounded-full shadow-lg">
          ₱{price}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
        <p className="text-gray-500 text-xs mt-3">{location}</p>
      </div>
    </div>
  );
}