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
    
    // Simulate API call
    console.log("Saving profile...");
    setTimeout(() => {
      alert("Profile Saved! (This is a demo)");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl border-0">
      <CardHeader className="bg-green-50 border-b border-green-100 p-8">
        <CardTitle className="text-2xl font-bold text-green-800">
          Build Your Seeker Profile
        </CardTitle>
        <CardDescription className="text-green-700/80 text-base">
          Help us find you the perfect room and roommate near VSU.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* --- SECTION 1: PERSONAL DETAILS --- */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">1</span>
              Personal Details
            </h3>
            
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
                <p className="text-[0.8rem] text-muted-foreground">Used for gender-specific boarding houses.</p>
              </div>

              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" placeholder="e.g. 20" min={16} max={99} />
              </div>
            </div>
          </section>

          <Separator />

          {/* --- SECTION 2: HOUSING PREFERENCES --- */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">2</span>
              Housing Preferences
            </h3>

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
                <p className="text-[0.8rem] text-muted-foreground">
                  The most you are willing to pay per month.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Move-in Date</Label>
                <Input type="date" />
              </div>
            </div>

            {/* --- NEW: AMENITIES MATCHING --- */}
            <div className="space-y-3 pt-2">
              <Label className="text-base font-semibold">Amenities / Must-Haves</Label>
              <p className="text-sm text-muted-foreground mb-3">Select the items you absolutely need.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 transition">
                  <Checkbox id="wifi" />
                  <Label htmlFor="wifi" className="cursor-pointer font-normal">Wi-Fi / Internet Required</Label>
                </div>

                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 transition">
                  <Checkbox id="own-cr" />
                  <Label htmlFor="own-cr" className="cursor-pointer font-normal">Own CR (Private Bathroom)</Label>
                </div>

                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 transition">
                  <Checkbox id="cooking" />
                  <Label htmlFor="cooking" className="cursor-pointer font-normal">Cooking Allowed</Label>
                </div>

                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 transition">
                  <Checkbox id="aircon" />
                  <Label htmlFor="aircon" className="cursor-pointer font-normal">Aircon Required</Label>
                </div>

                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 transition">
                  <Checkbox id="laundry" />
                  <Label htmlFor="laundry" className="cursor-pointer font-normal">Laundry Area</Label>
                </div>

                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 transition">
                  <Checkbox id="visitors" />
                  <Label htmlFor="visitors" className="cursor-pointer font-normal">Visitors Allowed</Label>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* --- SECTION 3: LIFESTYLE & HABITS --- */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">3</span>
              Lifestyle & Habits
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Cleanliness */}
              <div className="space-y-3">
                <Label>Cleanliness Level</Label>
                <RadioGroup defaultValue="average">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neat" id="neat" />
                    <Label htmlFor="neat">Neat Freak (Very Clean)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="average" />
                    <Label htmlFor="average">Average</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="messy" id="messy" />
                    <Label htmlFor="messy">A bit messy</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Sleep Schedule */}
              <div className="space-y-3">
                <Label>Sleep Schedule</Label>
                <RadioGroup defaultValue="early">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="early" id="early" />
                    <Label htmlFor="early">Early Bird (Morning Classes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="night" id="night" />
                    <Label htmlFor="night">Night Owl (Up Late)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* PETS */}
              <div className="space-y-3">
                <Label>Pets</Label>
                <RadioGroup defaultValue="no-pets">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="has-pets" id="has-pets" />
                    <Label htmlFor="has-pets">I have a pet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-pets" id="no-pets" />
                    <Label htmlFor="no-pets">I don't have pets</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="love-pets" id="love-pets" />
                    <Label htmlFor="love-pets">No pets, but I love animals</Label>
                  </div>
                </RadioGroup>
              </div>

               {/* Study Habits */}
               <div className="space-y-3">
                <Label>Study Environment</Label>
                <RadioGroup defaultValue="quiet">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quiet" id="quiet" />
                    <Label htmlFor="quiet">Silence is golden</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="music" id="music" />
                    <Label htmlFor="music">Music/Noise is okay</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </section>

          <Separator />

           {/* --- SECTION 4: BIO --- */}
           <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">4</span>
              About Me
            </h3>
            <div className="space-y-2">
              <Label>Bio / Description</Label>
              <Textarea 
                placeholder="Hi! I'm a 3rd year CS student. I'm chill, easy to get along with, and I bring a rice cooker!"
                className="h-32"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Share your hobbies, course, or anything else potential roommates should know.
              </p>
            </div>
          </section>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold bg-green-700 hover:bg-green-800 transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Saving Profile..." : "Complete Profile"}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}