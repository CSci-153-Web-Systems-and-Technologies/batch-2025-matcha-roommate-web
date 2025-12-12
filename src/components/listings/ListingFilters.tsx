"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ListingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper to update URL params
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  const currentType = searchParams.get("type") || "all";
  const currentSort = searchParams.get("sort") || "newest";

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:items-center">
      
      {/* 1. TYPE FILTER (Tabs style) */}
      <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
        {["all", "room", "seeker"].map((type) => (
          <button
            key={type}
            onClick={() => updateFilter("type", type === "all" ? null : type)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              currentType === type
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}s
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-200 hidden sm:block" />

      {/* 2. SORT DROPDOWN (Replaces Location & Max Price) */}
      <Select
        value={currentSort}
        onValueChange={(val) => updateFilter("sort", val === "newest" ? null : val)}
      >
        <SelectTrigger className="w-[200px] h-9 bg-white">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>

      {/* CLEAR FILTERS (Only show if filters are active) */}
      {(currentType !== "all" || currentSort !== "newest") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-auto sm:ml-0"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}