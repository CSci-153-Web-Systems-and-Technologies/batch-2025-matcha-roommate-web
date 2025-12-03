"use client";

import { useState } from "react";
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

export function SeekerProfileForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Saving profile...");
    // Future: Add Supabase Update logic here
    setTimeout(() => {
      alert("Profile Saved!");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-0">
      <CardHeader className="bg-green-50 border-b border-green-100 p-8">
        <CardTitle className="text-2xl font-bold text-green-800">
          Seeker Profile
        </CardTitle>
        <CardDescription className="text-green-700/80 text-base">
          Tell us about yourself and what you are looking for.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* --- SECTION 1: PERSONAL DETAILS & LIFESTYLE --- */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold">1</div>
              <h3 className="text-xl font-bold text-gray-900">Personal Details & Lifestyle</h3>
            </div>
            
            {/* Basic Info Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
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
                <Input type="number" placeholder="e.g. 20" min={16} max={99} />
              </div>
            </div>

            <Separator className="my-4" />

            {/* Habits Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Cleanliness */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Cleanliness Level</Label>
                <RadioGroup defaultValue="average">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neat" id="neat" />
                    <Label htmlFor="neat" className="font-normal">Neat Freak</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="average" />
                    <Label htmlFor="average" className="font-normal">Average</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="messy" id="messy" />
                    <Label htmlFor="messy" className="font-normal">A bit messy</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Sleep Schedule */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Sleep Schedule</Label>
                <RadioGroup defaultValue="early">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="early" id="early" />
                    <Label htmlFor="early" className="font-normal">Early Bird</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="night" id="night" />
                    <Label htmlFor="night" className="font-normal">Night Owl</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Pets */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Pets</Label>
                <RadioGroup defaultValue="no-pets">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="has-pets" id="has-pets" />
                    <Label htmlFor="has-pets" className="font-normal">I have a pet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-pets" id="no-pets" />
                    <Label htmlFor="no-pets" className="font-normal">I don't have pets</Label>
                  </div>
                </RadioGroup>
              </div>

               {/* Study Habits */}
               <div className="space-y-3">
                <Label className="text-base font-semibold">Study Environment</Label>
                <RadioGroup defaultValue="quiet">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quiet" id="quiet" />
                    <Label htmlFor="quiet" className="font-normal">Silence is golden</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="music" id="music" />
                    <Label htmlFor="music" className="font-normal">Music/Noise is okay</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </section>

          <Separator />

          {/* --- SECTION 2: HOUSING PREFERENCES --- */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold">2</div>
              <h3 className="text-xl font-bold text-gray-900">Housing Preferences</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Preferred Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Where do you want to live?" />
                  </SelectTrigger>
                  <SelectContent>
                    {nearVsuLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Budget Input */}
              <div className="space-y-2">
                <Label>Maximum Monthly Budget (₱)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₱</span>
                  <Input 
                    type="number" 
                    placeholder="e.g. 3500" 
                    className="pl-7" 
                    min={0}
                    step={100}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Move-in Date</Label>
                <Input type="date" />
              </div>
            </div>

            {/* Amenities Matching */}
            <div className="space-y-3 pt-4">
              <Label className="text-base font-semibold">Amenities / Must-Haves</Label>
              <p className="text-sm text-muted-foreground mb-3">Select the items you absolutely need in a room.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Wi-Fi Required", "Own CR", "Cooking Allowed", "Aircon", "Laundry Area", "Visitors Allowed"].map((item) => (
                  <div key={item} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 transition">
                    <Checkbox id={item.toLowerCase().replace(" ", "-")} />
                    <Label htmlFor={item.toLowerCase().replace(" ", "-")} className="cursor-pointer font-normal w-full">{item}</Label>
                  </div>
                ))}
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
              <Label>Bio / Description</Label>
              <Textarea 
                placeholder="Hi! I'm a 3rd year CS student. I'm chill, easy to get along with, and I bring a rice cooker!"
                className="h-32"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                This will be visible to potential landlords and roommates.
              </p>
            </div>
          </section>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold bg-green-700 hover:bg-green-800 transition-all shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}