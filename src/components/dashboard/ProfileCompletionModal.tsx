"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, UserCheck } from "lucide-react";
import AvatarUpload from "@/components/profiles/avatar-upload"; 

export default function ProfileCompletionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    avatar_url: "",
    first_name: "",
    last_name: "",
    middle_initial: "",
    contact_number: "",
  });

  useEffect(() => {
    const checkProfile = async () => {
      const supabase = createClient();
      
      // 1. Get Current User & Metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // 2. Fetch Existing Profile Data
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // 3. Check for Missing Critical Fields
      // We consider "incomplete" if Name, Contact, or Avatar is missing.
      const isProfileIncomplete = 
        !profile?.contact_number || 
        !profile?.first_name || 
        !profile?.last_name || 
        !profile?.avatar_url;

      if (isProfileIncomplete) {
        // 4. SMART PRE-FILL
        const meta = user.user_metadata || {};
        
        setFormData({
          avatar_url: profile?.avatar_url || "", 
          first_name: profile?.first_name || meta.first_name || meta.name?.split(' ')[0] || "",
          last_name: profile?.last_name || meta.last_name || meta.name?.split(' ').slice(1).join(' ') || "",
          middle_initial: profile?.middle_initial || meta.middle_initial || "",
          contact_number: profile?.contact_number || meta.contact_number || "",
        });
        
        setIsOpen(true);
      }
      
      setLoading(false);
    };

    checkProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!userId) {
      toast.error("User ID missing. Please refresh.");
      setSaving(false);
      return;
    }

    // 1. Validate Avatar
    if (!formData.avatar_url) {
      toast.error("Profile Photo Required", { description: "Please upload a photo to continue." });
      setSaving(false);
      return;
    }

    // 2. Validate Contact
    const digitsOnlyRegex = /^\d{10}$/;
    const cleanContact = formData.contact_number.replace(/^\+63/, '').replace(/^0/, '').trim();

    if (!digitsOnlyRegex.test(cleanContact)) {
      toast.error("Invalid Number", { description: "Please enter the 10 digits of your mobile number." });
      setSaving(false);
      return;
    }

    const fullContact = `+63${cleanContact}`;
    const supabase = createClient();

    // 3. UPSERT (Fixed: Removed updated_at)
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId, 
        avatar_url: formData.avatar_url,
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_initial: formData.middle_initial,
        contact_number: fullContact,
        // REMOVED: updated_at (Your DB doesn't have this column yet)
      });

    if (error) {
      console.error("Profile Update Error:", error);
      toast.error("Update Failed", { description: error.message });
      setSaving(false);
    } else {
      toast.success("Profile Updated", { description: "You are all set!" });
      setIsOpen(false);
      // Reload to reflect changes on the dashboard immediately
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200">
        
        {/* Header */}
        <div className="bg-green-600 px-8 py-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/patterns/grid.svg')]"></div>
          <div className="relative z-10">
            <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white mb-3 shadow-sm">
               <UserCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
            <p className="text-green-50 text-sm mt-1">
              One last step to join the community.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSave} className="p-8 space-y-6">
            
            {/* AVATAR UPLOAD */}
            <div className="flex flex-col items-center justify-center pb-2 space-y-2">
              <AvatarUpload 
                uid={userId} 
                url={formData.avatar_url} 
                onUpload={(url) => setFormData({ ...formData, avatar_url: url })} 
              />
              {!formData.avatar_url && (
                <p className="text-xs text-red-500 font-medium animate-pulse">* Photo Required</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input 
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input 
                   value={formData.last_name}
                   onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                   required 
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
               {/* Middle Initial */}
               <div className="col-span-1 space-y-2">
                 <Label>M.I.</Label>
                 <Input 
                   value={formData.middle_initial}
                   maxLength={1}
                   className="text-center uppercase"
                   placeholder="D"
                   onChange={(e) => setFormData({...formData, middle_initial: e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase()})}
                 />
               </div>

               {/* Contact Number */}
               <div className="col-span-3 space-y-2">
                 <Label>Mobile Number</Label>
                 <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500 pointer-events-none select-none">
                      +63
                    </div>
                    <Input 
                      value={formData.contact_number.replace(/^\+63/, '')}
                      onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                      type="tel" 
                      className="pl-12 font-mono"
                      maxLength={10}
                      placeholder="912 345 6789"
                      required 
                    />
                 </div>
               </div>
            </div>

            <Button 
              type="submit" 
              disabled={saving} 
              className="w-full h-12 bg-green-600 hover:bg-green-700 font-bold text-lg mt-2 shadow-md transition-all hover:scale-[1.02]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save & Continue"
              )}
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
}