// src/app/rooms/create/page.tsx
import Navbar from "@/components/layout/Navbar";

export default function CreateRoomPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto pt-24 px-6">
        <h1 className="text-3xl font-bold text-blue-800">List Your Room</h1>
        <p className="text-gray-600 mt-2">Upload photos and details about your boarding house.</p>
        {/* We will build the actual form here later */}
        <div className="mt-8 p-12 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-400">
          [Room Listing Form Will Go Here]
        </div>
      </div>
    </>
  );
}