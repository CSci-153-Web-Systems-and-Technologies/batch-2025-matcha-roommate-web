// src/app/page.tsx
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Main content starts below the fixed navbar */}
      <main className="pt-20 min-h-screen bg-amber-50">
        {/* We will add the two green cards + listings here in the next steps */}
        <div className="text-center py-20">
          <p className="text-2xl text-gray-700">Landing page in progress...</p>
          <p className="text-lg text-gray-600 mt-4">Two green cards + filters + listings coming next!</p>
        </div>
      </main>
    </>
  );
}