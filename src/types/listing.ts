// src/types/listing.ts
export type Listing = {
  id: number;
  imageSrc: string;
  badge: "New" | null;
  price: string;
  title: string;
  description: string;
  location: string;
};