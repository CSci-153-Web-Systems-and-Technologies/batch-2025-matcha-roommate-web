import { SeekerProfileForm } from "@/components/profiles/seeker-profile-form";
import Navbar from "@/components/layout/Navbar";

export default function CreateProfilePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <SeekerProfileForm />
      </div>
    </>
  );
}