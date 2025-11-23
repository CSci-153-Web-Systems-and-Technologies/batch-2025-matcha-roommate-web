// app/login/page.tsx
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <LoginForm />
      </div>
    </div>
  );
}