"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Upload, X } from "lucide-react";
import type { StaffMember } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AddStaffDialogProps {
  onStaffAdded: (staff: StaffMember) => void;
}

export function AddStaffDialog({ onStaffAdded }: AddStaffDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    availability: "",
    avatarUrl: ""
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, you'd upload the image to Firebase Storage here
      // For now, we'll use a placeholder or the preview URL
      let finalAvatarUrl = "https://placehold.co/100x100.png";
      
      if (profileImage) {
        // Simulate image upload - in production this would go to Firebase Storage
        finalAvatarUrl = previewUrl;
      }

      // Create new staff member object
      const newStaff: StaffMember = {
        id: Date.now().toString(), // Simple ID generation
        name: formData.name,
        availability: formData.availability,
        avatarUrl: finalAvatarUrl
      };

      // In a real app, you'd save this to Firebase here
      // For now, we'll just add it to the local state
      onStaffAdded(newStaff);

      // Reset form and close dialog
      setFormData({
        name: "",
        availability: "",
        avatarUrl: ""
      });
      setProfileImage(null);
      setPreviewUrl("");
      setOpen(false);
    } catch (error) {
      console.error("Error adding staff member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewUrl("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Add a new staff member to your team. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Alex Johnson"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="availability">Availability *</Label>
              <Input
                id="availability"
                value={formData.availability}
                onChange={(e) => handleInputChange("availability", e.target.value)}
                placeholder="Mon-Fri, 9am-5pm"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label>Profile Picture (Optional)</Label>
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={previewUrl} alt="Profile preview" />
                  <AvatarFallback className="text-lg">
                    {formData.name ? formData.name.charAt(0) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('profile-upload')?.click()}
                      disabled={isLoading}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                    {profileImage && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        disabled={isLoading}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    {profileImage ? profileImage.name : "Click to upload a profile picture"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Staff Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 