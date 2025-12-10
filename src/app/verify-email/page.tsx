import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// FIX: Make the component async and type searchParams as a Promise
export default async function VerifyEmailPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // FIX: Await the searchParams before using them
  const searchParams = await props.searchParams;
  const email = searchParams.email as string;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
        <div className="bg-green-600 h-2 w-full" /> {/* Top Accent Bar */}
        <CardContent className="pt-12 pb-10 px-8 text-center space-y-6">
          
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-in zoom-in duration-300">
            <Mail className="w-10 h-10" />
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Check your inbox</h1>
            <p className="text-gray-600 text-balance">
              We've sent a verification link to:
            </p>
            {email && (
              <p className="font-semibold text-gray-900 text-lg">{email}</p>
            )}
            <p className="text-sm text-gray-500 pt-2">
              Please click the link in the email to activate your account. You won't be able to log in until you verify.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-6 space-y-4">
            <Link href="/login">
              <Button className="w-full bg-green-700 hover:bg-green-800 font-bold h-12 text-md">
                Return to Login
              </Button>
            </Link>
            
            <div className="text-sm text-gray-400">
              <p>Did not receive the email? Check your spam folder.</p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}