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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { nearVsuLocations } from "@/data/nearVsuLocations";
import { createClient } from "@/utils/supabase/client";
import { Plus, X } from "lucide-react"; 

export function SeekerProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  const [customOccupation, setCustomOccupation] = useState("");
  const [newAmenity, setNewAmenity] = useState("");

  const [formData, setFormData] = useState({
    // --- PROFILE DATA (Who I am) ---
    gender: "",
    age: "",
    occupation: "",
    cleanliness: "average",
    sleep_schedule: "early",
    smoking_status: "non-smoker",
    study_habits: "quiet",
    pet_status: "no-pets",
    bio: "",
    
    // --- SEEKER POST DATA (What I want) ---
    location_preference: "",
    budget_max: "",
    move_in_date: "",
    // Removed guests_preference
    amenities_required: [] as string[], 
  });

  // 1. FETCH PROFILE DATA
  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFormData((prev) => ({
            ...prev,
            gender: profile.gender || "",
            age: profile.age?.toString() || "",
            occupation: profile.occupation || "",
            cleanliness: profile.cleanliness || "average",
            sleep_schedule: profile.sleep_schedule || "early",
            smoking_status: profile.smoking_status || "non-smoker",
            study_habits: profile.study_habits || "quiet",
            pet_status: profile.pet_status || "no-pets",
            bio: profile.bio || "",
          }));
        }
      }
      setLoadingData(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const current = prev.amenities_required;
      return current.includes(amenity)
        ? { ...prev, amenities_required: current.filter((a) => a !== amenity) }
        : { ...prev, amenities_required: [...current, amenity] };
    });
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities_required: [...prev.amenities_required, newAmenity.trim()]
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenityToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      amenities_required: prev.amenities_required.filter(a => a !== amenityToRemove)
    }));
  };

  // 3. SUBMIT LOGIC
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const finalOccupation = formData.occupation === "other" ? customOccupation : formData.occupation;

    // A. Update PROFILE (Identity)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        gender: formData.gender,
        age: parseInt(formData.age) || null,
        occupation: finalOccupation,
        cleanliness: formData.cleanliness,
        sleep_schedule: formData.sleep_schedule,
        smoking_status: formData.smoking_status,
        study_habits: formData.study_habits,
        pet_status: formData.pet_status,
        bio: formData.bio,
      })
      .eq('id', user.id);

    if (profileError) {
      alert("Error updating profile: " + profileError.message);
      setIsLoading(false);
      return;
    }

    // B. Create SEEKER POST (Requirements)
    const { error: postError } = await supabase
      .from('seeker_posts')
      .insert({
        user_id: user.id,
        location_preference: formData.location_preference,
        budget_max: parseFloat(formData.budget_max) || 0,
        move_in_date: formData.move_in_date || null,
        amenities_required: formData.amenities_required,
      });

    if (postError) {
      alert("Error creating post: " + postError.message);
    } else {
      router.push('/dashboard'); 
    }
    
    setIsLoading(false);
  };

  if (loadingData) return <div className="p-8 text-center text-gray-500">Loading your profile...</div>;

  const commonAmenities = [
    "Free Wi-Fi", "Own CR", "Aircon", "Study Hall", 
    "Laundry Area", "Cooking Allowed", "No Curfew", 
    "Visitors Allowed", "Pets Allowed", "Parking Space"
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-0">
      <CardHeader className="bg-green-50 border-b border-green-100 p-8">
        <CardTitle className="text-2xl font-bold text-green-800">Seeker Profile</CardTitle>
        <CardDescription className="text-green-700/80 text-base">
          Tell us about yourself and what you are looking for.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* --- SECTION 1: PERSONAL DETAILS (Identity) --- */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold">1</div>
              <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
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
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" value={formData.age} onChange={(e) => handleChange("age", e.target.value)} min={16} max={99} />
              </div>

              <div className="space-y-2">
                <Label>Occupation</Label>
                <Select value={formData.occupation} onValueChange={(val) => handleChange("occupation", val)}>
                  <SelectTrigger><SelectValue placeholder="Select occupation" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="other">Custom / Other</SelectItem>
                  </SelectContent>
                </Select>
                {formData.occupation === "other" && (
                  <Input 
                    placeholder="Please specify..." 
                    value={customOccupation} 
                    onChange={(e) => setCustomOccupation(e.target.value)} 
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* --- HABITS (Saved to Profile) --- */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Smoking Status</Label>
                <RadioGroup value={formData.smoking_status} onValueChange={(val) => handleChange("smoking_status", val)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="non-smoker" id="no-smoke"/><Label htmlFor="no-smoke">Non-Smoker</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="smoker" id="smoke"/><Label htmlFor="smoke">Smoker</Label></div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Do you have a pet?</Label>
                <RadioGroup value={formData.pet_status} onValueChange={(val) => handleChange("pet_status", val)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no-pets" id="no-pets"/><Label htmlFor="no-pets">No pets</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="has-pets" id="has-pets"/><Label htmlFor="has-pets">I have a pet</Label></div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Cleanliness</Label>
                <RadioGroup value={formData.cleanliness} onValueChange={(val) => handleChange("cleanliness", val)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="neat" id="neat"/><Label htmlFor="neat">Neat Freak</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="average" id="avg-clean"/><Label htmlFor="avg-clean">Average</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="messy" id="messy"/><Label htmlFor="messy">Relaxed / Messy</Label></div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Sleep Schedule</Label>
                <RadioGroup value={formData.sleep_schedule} onValueChange={(val) => handleChange("sleep_schedule", val)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="early" id="early"/><Label htmlFor="early">Early Bird</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="night" id="night"/><Label htmlFor="night">Night Owl</Label></div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Study Environment</Label>
                <RadioGroup value={formData.study_habits} onValueChange={(val) => handleChange("study_habits", val)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="quiet" id="quiet"/><Label htmlFor="quiet">Silence is golden</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="music" id="music"/><Label htmlFor="music">Music/Noise is okay</Label></div>
                </RadioGroup>
              </div>
            </div>
          </section>

          <Separator />

          {/* --- SECTION 2: HOUSING PREFERENCES (Saved to Seeker Post) --- */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold">2</div>
              <h3 className="text-xl font-bold text-gray-900">Housing Preferences</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Preferred Location</Label>
                <Select value={formData.location_preference} onValueChange={(val) => handleChange("location_preference", val)}>
                  <SelectTrigger><SelectValue placeholder="Where do you want to live?" /></SelectTrigger>
                  <SelectContent>
                    {nearVsuLocations.map((loc) => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Budget (₱)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₱</span>
                  <Input type="number" value={formData.budget_max} onChange={(e) => handleChange("budget_max", e.target.value)} className="pl-7" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Move-in Date</Label>
                <Input type="date" value={formData.move_in_date} onChange={(e) => handleChange("move_in_date", e.target.value)} />
              </div>
            </div>

            <Separator className="my-4" />

            {/* AMENITIES CHECKLIST */}
            <div className="space-y-3 pt-4">
              <Label className="text-base font-semibold">Amenities / Must-Haves</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {commonAmenities.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox 
                      id={item} 
                      checked={formData.amenities_required.includes(item)}
                      onCheckedChange={() => toggleAmenity(item)}
                    />
                    <Label htmlFor={item} className="cursor-pointer font-normal">{item}</Label>
                  </div>
                ))}
              </div>

              {/* CUSTOM AMENITIES INPUT */}
              <div className="mt-4">
                <Label className="text-sm text-muted-foreground">Other Requirements</Label>
                <div className="flex gap-2 mt-2">
                  <Input 
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Type a custom requirement..."
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomAmenity(); }}}
                  />
                  <Button type="button" onClick={addCustomAmenity} variant="outline" size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.amenities_required
                    .filter(a => !commonAmenities.includes(a))
                    .map((amenity, index) => (
                      <div key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                        {amenity}
                        <button type="button" onClick={() => removeAmenity(amenity)} className="hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>

          <Separator />

           {/* --- SECTION 3: BIO --- */}
           <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold">3</div>
              <h3 className="text-xl font-bold text-gray-900">About Me</h3>
            </div>
            
            <div className="space-y-2">
              <Textarea 
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Hi! I'm a 3rd year CS student..."
                className="h-32"
              />
            </div>
          </section>

          <Button type="submit" className="w-full h-12 text-lg font-bold bg-green-700 hover:bg-green-800 transition-all shadow-lg" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}