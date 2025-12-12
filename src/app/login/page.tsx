import { Suspense } from "react"; // <--- 1. Import Suspense
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* 2. Wrap LoginForm in Suspense */}
        <Suspense fallback={<div className="w-full h-96 bg-white rounded-xl shadow-xl animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}