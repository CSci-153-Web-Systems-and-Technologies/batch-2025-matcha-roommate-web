import { SeekerPostForm } from "@/components/post/seeker-post-form";
import Navbar from "@/components/layout/Navbar";

export default function CreateSeekerPostPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <SeekerPostForm />
      </div>
    </>
  );
}