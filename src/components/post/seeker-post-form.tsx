"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { nearVsuLocations } from "@/data/nearVsuLocations";
import { createClient } from "@/utils/supabase/client";
import { Plus, X, Loader2, Search } from "lucide-react"; 
// 1. IMPORT THE IDENTITY FORM
import { ProfileIdentityForm } from "../profiles/profile-identity-form"; 

export function SeekerPostForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");

  const [formData, setFormData] = useState({
    location_preference: "",
    budget_max: "",
    move_in_date: "",
    amenities_required: [] as string[], 
  });

  // Check if form is valid
  const isFormValid = formData.location_preference && formData.budget_max && formData.move_in_date;

  // --- HANDLERS FOR POST FORM ---
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

  // --- MAIN POST SUBMISSION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return; 
    
    setIsLoading(true);
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("Please log in to post.");
        setIsLoading(false);
        return;
    }

    try {
      // 1. Fetch the LATEST bio to use as description
      // We fetch it fresh here so if they just edited it in the IdentityForm above, we get the new version.
      const { data: freshProfile } = await supabase
        .from('profiles')
        .select('bio')
        .eq('id', user.id)
        .single();
        
      const userBio = freshProfile?.bio || "No bio provided.";

      // 2. Save Preferences
      await supabase.from('profile_preferences').delete().eq('profile_id', user.id);
      const { error: prefsError } = await supabase.from('profile_preferences').insert({
        profile_id: user.id,
        budget_max: parseFloat(formData.budget_max) || 0,
        location_preference: formData.location_preference,
        move_in_date: formData.move_in_date || null,
        amenities_required: formData.amenities_required,
      });

      if (prefsError) throw prefsError;

      // 3. Create Public Post
      await supabase.from('posts').delete().eq('user_id', user.id).eq('type', 'seeker');
      const { error: postError } = await supabase.from('posts').insert({
        user_id: user.id,
        type: 'seeker',
        title: `Looking for Room in ${formData.location_preference}`,
        description: userBio,
      });

      if (postError) throw postError;

      router.push('/dashboard'); 

    } catch (error: any) {
      alert("Error creating post: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const commonAmenities = ["Free Wi-Fi", "Own CR", "Aircon", "Study Hall", "Laundry Area", "Cooking Allowed", "No Curfew"];

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      
      {/* 1. REUSED IDENTITY FORM (Review/Edit Profile) */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
           <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">1</div>
           <h2 className="text-xl font-bold text-gray-900">Verify Identity</h2>
        </div>
        <ProfileIdentityForm />
      </section>

      {/* 2. PREFERENCES FORM (Post Details) */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">2</div>
           <h2 className="text-xl font-bold text-gray-900">Room Preferences</h2>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-blue-50 border-b border-blue-100 p-8">
            <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                <Search className="w-6 h-6" /> Post a Room Request
            </CardTitle>
            <CardDescription className="text-blue-700/80">
              Tell us what you are looking for.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="after:content-['*'] after:text-red-500">Preferred Location</Label>
                  <Select onValueChange={(val) => setFormData({...formData, location_preference: val})}>
                    <SelectTrigger><SelectValue placeholder="Select Area" /></SelectTrigger>
                    <SelectContent>
                      {nearVsuLocations.map((loc) => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="after:content-['*'] after:text-red-500">Max Budget (₱)</Label>
                  <Input type="number" onChange={(e) => setFormData({...formData, budget_max: e.target.value})} placeholder="e.g. 3000" />
                </div>

                <div className="space-y-2">
                  <Label className="after:content-['*'] after:text-red-500">Move-in Date</Label>
                  <Input type="date" onChange={(e) => setFormData({...formData, move_in_date: e.target.value})} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-semibold">Must-Have Amenities</Label>
                <div className="grid grid-cols-2 gap-3">
                  {commonAmenities.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={item} checked={formData.amenities_required.includes(item)} onCheckedChange={() => toggleAmenity(item)} />
                      <Label htmlFor={item} className="font-normal cursor-pointer">{item}</Label>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-2">
                    <Input value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} placeholder="Type other requirements..." />
                    <Button type="button" onClick={addCustomAmenity} variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.amenities_required.filter(a => !commonAmenities.includes(a)).map((amenity, index) => (
                        <div key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          {amenity}
                          <button type="button" onClick={() => removeAmenity(amenity)}><X className="w-3 h-3" /></button>
                        </div>
                    ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold bg-blue-700 hover:bg-blue-800 shadow-md disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isLoading || !isFormValid} 
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Post Request"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}