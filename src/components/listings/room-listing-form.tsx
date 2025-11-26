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
import { Plus, X } from "lucide-react"; // Icons for the "Add" button

export function RoomListingForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  // State for Custom Amenities
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setCustomAmenities([...customAmenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    setCustomAmenities(customAmenities.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    console.log("Listing Room...");
    setTimeout(() => {
      alert("Room Listed Successfully!");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-0">
      <CardHeader className="bg-blue-50 border-b border-blue-100 p-8">
        <CardTitle className="text-2xl font-bold text-blue-800">
          List Your Property
        </CardTitle>
        <CardDescription className="text-blue-700/80 text-base">
          Fill in the details to find the perfect tenant or roommate.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* --- SECTION 1: LISTER INFO --- */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
              Who is listing?
            </h3>
            
            <RadioGroup defaultValue="landlord" className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="landlord" id="landlord" className="peer sr-only" />
                <Label
                  htmlFor="landlord"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600 cursor-pointer"
                >
                  <span className="text-lg font-bold">Landlord / Owner</span>
                  <span className="text-sm text-muted-foreground text-center mt-1">
                    I own or manage the property.
                  </span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="tenant" id="tenant" className="peer sr-only" />
                <Label
                  htmlFor="tenant"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600 cursor-pointer"
                >
                  <span className="text-lg font-bold">Current Tenant</span>
                  <span className="text-sm text-muted-foreground text-center mt-1">
                    I'm looking for a roommate to share rent.
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </section>

          <Separator />

          {/* --- SECTION 2: PROPERTY DETAILS --- */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span>
              Property Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Listing Title</Label>
                <Input placeholder="e.g. Spacious Room for 2 near VSU Upper Campus" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Location Area</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                      {nearVsuLocations.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Specific Address / Landmark</Label>
                  <Input placeholder="e.g. Yellow Gate, 50m from 7/11 Gabas" />
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* --- SECTION 3: PRICING & SLOTS --- */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">3</span>
              Pricing & Capacity
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Payment Scheme */}
              <div className="space-y-2">
                <Label>Rent Payment Scheme</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per-head">Per Head (Each person pays)</SelectItem>
                    <SelectItem value="whole-room">Whole Room (Split among tenants)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label>Price (₱)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₱</span>
                  <Input type="number" placeholder="2500" className="pl-7" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Monthly rent.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Total Capacity (Pax)</Label>
                <Input type="number" placeholder="e.g. 4 people" min={1} />
              </div>

              <div className="space-y-2">
                <Label>Available Slots Now</Label>
                <Input type="number" placeholder="e.g. 1 slot left" min={1} />
              </div>
            </div>
          </section>

          <Separator />

          {/* --- SECTION 4: AMENITIES (Checkboxes + Dynamic) --- */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">4</span>
              Amenities & Features
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Common Filters */}
              {[
                "Free Wi-Fi", "Own CR", "Aircon", 
                "Study Hall", "Laundry Area", "Cooking Allowed", 
                "No Curfew", "Visitors Allowed", "Pets Allowed"
              ].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox id={item} />
                  <Label htmlFor={item} className="font-normal cursor-pointer">{item}</Label>
                </div>
              ))}
            </div>

            {/* Dynamic "Add Amenity" Section */}
            <div className="mt-6">
              <Label>Other Amenities (Add details like "Convenience Store", "Free Water")</Label>
              <div className="flex gap-2 mt-2">
                <Input 
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Type an amenity..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAmenity();
                    }
                  }}
                />
                <Button type="button" onClick={addAmenity} variant="outline">
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>

              {/* Display Tags */}
              {customAmenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {customAmenities.map((amenity, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                      {amenity}
                      <button 
                        type="button" 
                        onClick={() => removeAmenity(index)}
                        className="hover:text-red-600 focus:outline-none"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* --- SECTION 5: PHOTOS --- */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">5</span>
              Photos & Description
            </h3>

            <div className="space-y-2">
              <Label>Upload Photos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer">
                <p className="text-gray-500">Click to upload images (Feature coming soon)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Describe the vibe of the house, rules, or anything else..." 
                className="h-32"
              />
            </div>
          </section>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold bg-blue-700 hover:bg-blue-800 transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Posting Listing..." : "Post Listing"}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}