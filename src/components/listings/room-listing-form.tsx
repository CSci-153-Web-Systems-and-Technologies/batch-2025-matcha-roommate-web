"use client";

import { useState } from "react";
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
import { Plus, X, UploadCloud, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function RoomListingForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    lister_type: "landlord",
    title: "",
    location: "",
    address: "",
    payment_scheme: "per-head",
    price: "",
    capacity: "",
    available_slots: "",
    description: "",
    amenities: [] as string[],
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const current = prev.amenities;
      return current.includes(amenity)
        ? { ...prev, amenities: current.filter((a) => a !== amenity) }
        : { ...prev, amenities: [...current, amenity] };
    });
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim()) {
      setCustomAmenities([...customAmenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeCustomAmenity = (index: number) => {
    setCustomAmenities(customAmenities.filter((_, i) => i !== index));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (selectedImages.length + files.length > 5) {
        alert("You can only upload up to 5 images.");
        return;
      }
      const MAX_SIZE = 5 * 1024 * 1024; 
      const oversizedFiles = files.filter((file) => file.size > MAX_SIZE);
      if (oversizedFiles.length > 0) {
        alert(`Some files are too large! (${oversizedFiles.length} files skipped)`);
        return;
      }
      setSelectedImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // --- UPDATED SUBMIT LOGIC FOR NEW SCHEMA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const supabase = createClient();
    
    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to post a room.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Insert into MASTER 'posts' table first
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          type: 'room', // Identify this as a room post
          title: formData.title,
          description: formData.description,
        })
        .select()
        .single();

      if (postError) throw new Error("Failed to create post: " + postError.message);
      
      const postId = postData.id;

      // 3. Insert into 'room_posts' (Details)
      const { error: roomError } = await supabase
        .from('room_posts')
        .insert({
          post_id: postId, // Link to the master post
          lister_type: formData.lister_type,
          price: parseFloat(formData.price) || 0,
          location: formData.location,
          address: formData.address,
          payment_scheme: formData.payment_scheme,
          capacity: parseInt(formData.capacity) || 1,
          available_slots: parseInt(formData.available_slots) || 1,
        });

      if (roomError) throw new Error("Failed to save room details: " + roomError.message);

      // 4. Insert Amenities (One by one or bulk)
      const finalAmenities = [...formData.amenities, ...customAmenities];
      if (finalAmenities.length > 0) {
        // First get the room_post_id (it might be different from post_id if you used gen_random_uuid for room_posts primary key)
        // Actually, let's fetch the room_post ID we just created.
        const { data: roomPost } = await supabase.from('room_posts').select('id').eq('post_id', postId).single();
        
        if (roomPost) {
           const amenityInserts = finalAmenities.map(am => ({
             room_post_id: roomPost.id,
             amenity: am
           }));
           
           const { error: amError } = await supabase.from('amenities').insert(amenityInserts);
           if (amError) console.error("Amenity error:", amError);
        }
      }

      // 5. Upload & Insert Images
      if (selectedImages.length > 0) {
        const imageInserts = [];

        for (const file of selectedImages) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${postId}/${Date.now()}-${Math.random()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('room-images')
            .upload(fileName, file);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('room-images')
              .getPublicUrl(fileName);
            
            imageInserts.push({
              post_id: postId,
              url: publicUrl
            });
          }
        }

        if (imageInserts.length > 0) {
          await supabase.from('images').insert(imageInserts);
        }
      }

      // Success!
      router.push("/dashboard");

    } catch (err: any) {
      console.error("Error posting room:", err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const commonAmenities = [
    "Free Wi-Fi", "Own CR", "Aircon", 
    "Study Hall", "Laundry Area", "Cooking Allowed", 
    "No Curfew", "Visitors Allowed", "Pets Allowed", "Parking Space"
  ];

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
            
            <RadioGroup 
              value={formData.lister_type} 
              onValueChange={(val) => handleChange("lister_type", val)}
              className="grid grid-cols-2 gap-4"
            >
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
                <Input 
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g. Spacious Room for 2 near VSU Upper Campus" 
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Location Area</Label>
                  <Select value={formData.location} onValueChange={(val) => handleChange("location", val)}>
                    <SelectTrigger><SelectValue placeholder="Select Area" /></SelectTrigger>
                    <SelectContent>
                      {nearVsuLocations.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Specific Address / Landmark</Label>
                  <Input 
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="e.g. Yellow Gate, 50m from 7/11 Gabas" 
                  />
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
              <div className="space-y-2">
                <Label>Rent Payment Scheme</Label>
                <Select value={formData.payment_scheme} onValueChange={(val) => handleChange("payment_scheme", val)}>
                  <SelectTrigger><SelectValue placeholder="Select Scheme" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per-head">Per Head (Each person pays)</SelectItem>
                    <SelectItem value="whole-room">Whole Room (Split among tenants)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price (₱)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₱</span>
                  <Input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="2500" 
                    className="pl-7" 
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Monthly rent.</p>
              </div>

              <div className="space-y-2">
                <Label>Total Capacity (Pax)</Label>
                <Input type="number" value={formData.capacity} onChange={(e) => handleChange("capacity", e.target.value)} placeholder="e.g. 4 people" min={1} />
              </div>

              <div className="space-y-2">
                <Label>Available Slots Now</Label>
                <Input type="number" value={formData.available_slots} onChange={(e) => handleChange("available_slots", e.target.value)} placeholder="e.g. 1 slot left" min={1} />
              </div>
            </div>
          </section>

          <Separator />

          {/* --- SECTION 4: AMENITIES --- */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">4</span>
              Amenities & Features
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {commonAmenities.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox 
                    id={item} 
                    checked={formData.amenities.includes(item)}
                    onCheckedChange={() => toggleAmenity(item)}
                  />
                  <Label htmlFor={item} className="font-normal cursor-pointer">{item}</Label>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Label>Other Amenities</Label>
              <div className="flex gap-2 mt-2">
                <Input 
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Type an amenity (e.g. 'Gym', 'Solar Power')"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomAmenity(); }}}
                />
                <Button type="button" onClick={addCustomAmenity} variant="outline">
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {customAmenities.map((amenity, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                    {amenity}
                    <button type="button" onClick={() => removeCustomAmenity(index)} className="hover:text-red-600 focus:outline-none">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Separator />

          {/* --- SECTION 5: PHOTOS --- */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">5</span>
              Photos & Description
            </h3>

            <div className="space-y-4">
              <Label>Upload Photos (Max 5)</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <UploadCloud className="w-8 h-8 text-gray-400" />
                    <span>Click to upload images</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the vibe of the house, rules, or anything else..." 
                className="h-32"
              />
            </div>
          </section>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold bg-blue-700 hover:bg-blue-800 transition-all shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading & Posting...
              </>
            ) : (
              "Post Listing"
            )}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}