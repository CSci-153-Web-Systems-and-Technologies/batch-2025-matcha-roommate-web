// src/data/listings.ts
import type { Listing } from "@/types/listing";

export const listings: Listing[] = [
  {
    id: 1,
    imageSrc: "/images/landing/card1.jpg",
    badge: "New",
    price: "2000",
    title: "Marco • Male",
    description: "Chill guy, loves gym and music. Looking for a clean and respectful roommate.",
    location: "Quezon City",
  },
  {
    id: 2,
    imageSrc: "/images/landing/card2.jpg",
    badge: null,
    price: "3500",
    title: "Tyler • Male",
    description: "Student | Non-smoker | Loves golf and flowers. Looking for a peaceful place near school.",
    location: "Makati City",
  },
  {
    id: 3,
    imageSrc: "/images/landing/card3.jpg",
    badge: null,
    price: "8500",
    title: "Luxury Bed Space",
    description: "High-end boarding house with balcony, own CR, 24/7 security, free Wi-Fi & utilities included.",
    location: "BGC, Taguig",
  },
];