"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Pencil, User, Sparkles, Moon, BookOpen, Cigarette, Cat, Save, X, Phone } from "lucide-react"; 
import AvatarUpload from "./avatar-upload"; 

export function ProfileIdentityForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [customOccupation, setCustomOccupation] = useState("");

  const [formData, setFormData] = useState({
    avatar_url: "",
    first_name: "",
    last_name: "",
    middle_initial: "",
    contact_number: "",
    gender: "",
    birthdate: "", 
    occupation: "",
    bio: "",
    cleanliness: "average",
    sleep_schedule: "early",
    smoking_status: "non-smoker",
    study_habits: "quiet",
    pet_status: "no-pets",
  });

  const calculateAge = (birthdate: string) => {
    if (!birthdate) return "N/A";
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        const { data: habits } = await supabase.from('profile_habits').select('*').eq('profile_id', user.id).single();

        if (profile) {
          if (profile.first_name && profile.last_name) {
            setHasProfile(true);
          } else {
            setIsEditing(true); 
          }

          setFormData((prev) => ({
            ...prev,
            avatar_url: profile.avatar_url || "",
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            middle_initial: profile.middle_initial || "",
            contact_number: profile.contact_number || "",
            gender: profile.gender || "",
            birthdate: profile.birthdate || "", 
            occupation: profile.occupation || "",
            bio: profile.bio || "",
            cleanliness: habits?.cleanliness_level || "average",
            sleep_schedule: habits?.sleep_schedule || "early",
            smoking_status: habits?.smoking_status || "non-smoker",
            study_habits: habits?.study_habit || "quiet",
            pet_status: habits?.pet_status || "no-pets",
          }));
        } else {
          // If no profile exists at all, force edit mode
          setIsEditing(true);
        }
      }
      setLoadingData(false);
    };
    fetchData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();
    if (!userId) return;

    const finalOccupation = formData.occupation === "other" ? customOccupation : formData.occupation;

    try {
      // 1. UPSERT Profile (Create if doesn't exist, Update if it does)
      // This fixes the "Foreign Key Constraint" error
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId, // Explicitly provide the ID
          avatar_url: formData.avatar_url,
          first_name: formData.first_name,
          last_name: formData.last_name,
          middle_initial: formData.middle_initial,
          contact_number: formData.contact_number,
          gender: formData.gender,
          birthdate: formData.birthdate || null,
          occupation: finalOccupation,
          bio: formData.bio,
        });

      if (profileError) throw profileError;

      // 2. Save Habits
      await supabase.from('profile_habits').delete().eq('profile_id', userId);
      const { error: habitsError } = await supabase.from('profile_habits').insert({
        profile_id: userId,
        cleanliness_level: formData.cleanliness,
        sleep_schedule: formData.sleep_schedule,
        smoking_status: formData.smoking_status,
        study_habit: formData.study_habits,
        pet_status: formData.pet_status,
      });

      if (habitsError) throw habitsError;

      setHasProfile(true);
      setIsEditing(false);
      router.refresh(); 

    } catch (error: any) {
      alert("Error saving profile: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) return <div className="p-12 text-center text-gray-500">Loading...</div>;

  if (!isEditing && hasProfile) {
    return (
      <Card className="shadow-lg border-0 overflow-hidden">
        <div className="h-32 bg-linear-to-r from-green-600 to-green-400 relative">
          <Button onClick={() => setIsEditing(true)} size="sm" className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white border-0 backdrop-blur-md">
            <Pencil className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </div>
        <CardContent className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start -mt-12 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-md relative shrink-0">
                {formData.avatar_url ? <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-700"><User className="w-12 h-12" /></div>}
            </div>
            <div className="pt-14 space-y-1">
              <h2 className="text-3xl font-bold text-gray-900 capitalize">
                {formData.first_name} {formData.middle_initial}. {formData.last_name}
              </h2>
              <div className="text-gray-500 font-medium flex flex-wrap gap-3 text-sm">
                <span className="capitalize">{formData.occupation || "Member"}</span>
                <span>•</span>
                <span>{formData.gender}</span>
                <span>•</span>
                <span>{calculateAge(formData.birthdate)} years old</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                 <div className="flex items-center gap-1"><Phone className="w-4 h-4" /> {formData.contact_number || "No contact info"}</div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2 text-xs uppercase tracking-wider text-green-700">About Me</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{formData.bio || "No bio added yet."}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider text-green-700">My Lifestyle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ViewItem icon={Sparkles} label="Cleanliness" value={formData.cleanliness} />
                <ViewItem icon={Moon} label="Sleep Schedule" value={formData.sleep_schedule} />
                <ViewItem icon={BookOpen} label="Study Environment" value={formData.study_habits} />
                <ViewItem icon={Cigarette} label="Smoking" value={formData.smoking_status} />
                <ViewItem icon={Cat} label="Pets" value={formData.pet_status} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-green-50 border-b border-green-100 p-8 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-2xl font-bold text-green-800">My Profile</CardTitle>
          <CardDescription className="text-green-700/80">Update your identity and habits.</CardDescription>
        </div>
        {hasProfile && <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}><X className="w-5 h-5" /></Button>}
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* 1. IDENTITY SECTION */}
          <section className="space-y-6">
            <div className="flex flex-col items-center justify-center mb-6">
               <AvatarUpload uid={userId} url={formData.avatar_url} onUpload={(url) => handleChange("avatar_url", url)} />
            </div>

            {/* NAME FIELDS */}
            <div className="grid md:grid-cols-12 gap-4">
              <div className="md:col-span-5 space-y-2">
                <Label>First Name</Label>
                <Input value={formData.first_name} onChange={(e) => handleChange("first_name", e.target.value)} placeholder="Juan" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>M.I.</Label>
                <Input value={formData.middle_initial} onChange={(e) => handleChange("middle_initial", e.target.value)} maxLength={2} placeholder="D." />
              </div>
              <div className="md:col-span-5 space-y-2">
                <Label>Last Name</Label>
                <Input value={formData.last_name} onChange={(e) => handleChange("last_name", e.target.value)} placeholder="Dela Cruz" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input value={formData.contact_number} onChange={(e) => handleChange("contact_number", e.target.value)} placeholder="0912 345 6789" />
              </div>
              <div className="space-y-2">
                <Label>Birthdate</Label>
                <Input type="date" value={formData.birthdate} onChange={(e) => handleChange("birthdate", e.target.value)} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(val) => handleChange("gender", val)}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Occupation</Label>
                <Select value={formData.occupation} onValueChange={(val) => handleChange("occupation", val)}>
                  <SelectTrigger><SelectValue placeholder="Select occupation" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {formData.occupation === "other" && <Input placeholder="Specify..." value={customOccupation} onChange={(e) => setCustomOccupation(e.target.value)} className="mt-2" />}
              </div>
            </div>
          </section>
          
          <Separator />
          
          {/* 2. HABITS SECTION */}
          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-3">
                <Label className="font-semibold">Smoking</Label>
                <RadioGroup value={formData.smoking_status} onValueChange={(val) => handleChange("smoking_status", val)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="non-smoker" id="ns"/><Label htmlFor="ns">Non-Smoker</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="smoker" id="s"/><Label htmlFor="s">Smoker</Label></div>
                </RadioGroup>
             </div>
             <div className="space-y-3">
                <Label className="font-semibold">Pets</Label>
                <RadioGroup value={formData.pet_status} onValueChange={(val) => handleChange("pet_status", val)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no-pets" id="np"/><Label htmlFor="np">No Pets</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="has-pets" id="hp"/><Label htmlFor="hp">Have Pets</Label></div>
                </RadioGroup>
             </div>
             <div className="space-y-3">
                <Label className="font-semibold">Cleanliness</Label>
                <RadioGroup value={formData.cleanliness} onValueChange={(val) => handleChange("cleanliness", val)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="neat" id="nt"/><Label htmlFor="nt">Neat</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="average" id="av"/><Label htmlFor="av">Average</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="messy" id="ms"/><Label htmlFor="ms">Messy</Label></div>
                </RadioGroup>
             </div>
             <div className="space-y-3">
                <Label className="font-semibold">Sleep</Label>
                <RadioGroup value={formData.sleep_schedule} onValueChange={(val) => handleChange("sleep_schedule", val)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="early" id="eb"/><Label htmlFor="eb">Early Bird</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="night" id="no"/><Label htmlFor="no">Night Owl</Label></div>
                </RadioGroup>
             </div>
             <div className="space-y-3">
                <Label className="font-semibold">Study</Label>
                <RadioGroup value={formData.study_habits} onValueChange={(val) => handleChange("study_habits", val)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="quiet" id="q"/><Label htmlFor="q">Quiet</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="music" id="m"/><Label htmlFor="m">Music</Label></div>
                </RadioGroup>
             </div>
          </div>

          <Separator />

          {/* 3. BIO SECTION */}
          <section className="space-y-4">
            <div className="space-y-2">
              <Label>About Me</Label>
              <Textarea value={formData.bio} onChange={(e) => handleChange("bio", e.target.value)} className="h-32" />
            </div>
          </section>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1 h-12 bg-green-700 hover:bg-green-800" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Profile"}
            </Button>
            {hasProfile && <Button type="button" variant="outline" className="h-12 px-8" onClick={() => setIsEditing(false)}>Cancel</Button>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ViewItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
      <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
      <div>
        <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">{label}</p>
        <p className="text-gray-900 font-semibold capitalize text-sm">{value?.replace("-", " ") || "Not set"}</p>
      </div>
    </div>
  );
}