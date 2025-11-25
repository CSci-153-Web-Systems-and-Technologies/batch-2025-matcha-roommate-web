import { RegisterForm } from "@/components/auth/register-form";
import Navbar from "@/components/layout/Navbar";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-b from-green-50 to-white flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-5xl">
          <RegisterForm />
        </div>
      </div>
    </>
  );
}