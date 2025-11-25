// src/app/profiles/create/page.tsx
import Navbar from "@/components/layout/Navbar";

export default function CreateProfilePage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto pt-24 px-6">
        <h1 className="text-3xl font-bold text-green-800">Create Your Seeker Profile</h1>
        <p className="text-gray-600 mt-2">Tell us about your habits and budget so we can find you a match.</p>
        {/* We will build the actual form here later */}
        <div className="mt-8 p-12 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-400">
          [Seeker Profile Form Will Go Here]
        </div>
      </div>
    </>
  );
}