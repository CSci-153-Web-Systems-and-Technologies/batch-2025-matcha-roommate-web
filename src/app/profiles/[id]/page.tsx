import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// 1. IMPORT THE SHELL
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, MapPin, Calendar, Banknote, ShieldCheck, 
  ArrowLeft, Cigarette, Cat, Moon, BookOpen, Sparkles
} from "lucide-react";
import { MessageButton } from "@/components/messaging/message-button";
import { RequestButton } from "@/components/requests/request-button";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      profile_habits (
        cleanliness_level,
        sleep_schedule,
        pet_status,
        smoking_status,
        study_habit
      ),
      profile_preferences (
        budget_max,
        location_preference,
        move_in_date,
        amenities_required
      )
    `)
    .eq('id', id)
    .single();

  if (error || !profile) {
    return notFound();
  }

  const { data: seekerPost } = await supabase
    .from('posts')
    .select('id')
    .eq('user_id', id)
    .eq('type', 'seeker')
    .single();

  const habits = profile.profile_habits?.[0] || null;
  const preferences = profile.profile_preferences?.[0] || null;

  return (
    // 2. WRAP IN DASHBOARD SHELL
    <DashboardShell>
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Feed
          </Link>
        </div>

        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-32 bg-linear-to-r from-green-600 to-green-400"></div>
          
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start -mt-12">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-md relative shrink-0">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt={profile.first_name || "User"} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-700">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>

              <div className="flex-1 pt-2 md:pt-14">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                      {profile.first_name} {profile.last_name}
                      {profile.is_verified && (
                        <ShieldCheck className="w-6 h-6 text-blue-500" aria-label="Verified User" />
                      )}
                    </h1>
                    <p className="text-green-700 font-medium text-lg capitalize mt-1">
                      {profile.occupation || "Student"} • {profile.gender || "Gender hidden"}
                    </p>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                    {seekerPost && (
                      <RequestButton 
                        postType="seeker"
                        postId={seekerPost.id}
                        receiverId={profile.id}
                        className="flex-1 md:flex-none h-10"
                      />
                    )}
                    <MessageButton 
                      targetUserId={profile.id} 
                      targetName={profile.first_name}
                      className="flex-1 md:flex-none h-10 bg-white text-green-700 border-2 border-green-600 hover:bg-green-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                {profile.bio || "This user hasn't written a bio yet."}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Lifestyle & Habits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HabitItem icon={Sparkles} label="Cleanliness" value={habits?.cleanliness_level} color="text-blue-600 bg-blue-50" />
                <HabitItem icon={Moon} label="Sleep Schedule" value={habits?.sleep_schedule} color="text-indigo-600 bg-indigo-50" />
                <HabitItem icon={BookOpen} label="Study Environment" value={habits?.study_habit} color="text-amber-600 bg-amber-50" />
                <HabitItem icon={Cigarette} label="Smoking" value={habits?.smoking_status} color={habits?.smoking_status === 'smoker' ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"} />
                <HabitItem icon={Cat} label="Pets" value={habits?.pet_status} color="text-orange-600 bg-orange-50" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {preferences ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Active Seeker Post</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Looking in area</p>
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                      <MapPin className="w-5 h-5 text-green-600" />
                      {preferences.location_preference}
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Max Budget</p>
                      <div className="flex items-center gap-2 text-gray-900 font-bold">
                        <Banknote className="w-4 h-4 text-green-600" />
                        ₱{preferences.budget_max?.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Move-in</p>
                      <div className="flex items-center gap-2 text-gray-900 font-bold">
                        <Calendar className="w-4 h-4 text-green-600" />
                        {preferences.move_in_date || "ASAP"}
                      </div>
                    </div>
                  </div>
                  {preferences.amenities_required && preferences.amenities_required.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-gray-500 text-sm mb-3">Must-haves</p>
                        <div className="flex flex-wrap gap-2">
                          {preferences.amenities_required.map((am: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                              {am}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 text-center text-gray-500">
                <p>This user is not currently looking for a room.</p>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Contact Details</h3>
              {profile.contact_number ? (
                <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Phone Number</p>
                  <p className="text-lg font-mono text-gray-900 font-bold tracking-wide">
                    {profile.contact_number}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic text-center">No contact number provided.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function HabitItem({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-gray-900 font-semibold capitalize">
          {value ? value.replace("-", " ") : "Not specified"}
        </p>
      </div>
    </div>
  );
}