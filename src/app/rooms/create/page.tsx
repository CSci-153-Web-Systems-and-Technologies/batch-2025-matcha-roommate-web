import { RoomListingForm } from "@/components/listings/room-listing-form";
import Navbar from "@/components/layout/Navbar";

export default function CreateRoomPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <RoomListingForm />
      </div>
    </>
  );
}