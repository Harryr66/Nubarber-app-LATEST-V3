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
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import type { StaffMember } from "@/lib/types";

interface AddStaffDialogProps {
  onStaffAdded: (staff: StaffMember) => void;
}

export function AddStaffDialog({ onStaffAdded }: AddStaffDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    availability: "",
    avatarUrl: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create new staff member object
      const newStaff: StaffMember = {
        id: Date.now().toString(), // Simple ID generation
        name: formData.name,
        specialty: formData.specialty,
        availability: formData.availability,
        avatarUrl: formData.avatarUrl || "https://placehold.co/100x100.png"
      };

      // In a real app, you'd save this to Firebase here
      // For now, we'll just add it to the local state
      onStaffAdded(newStaff);

      // Reset form and close dialog
      setFormData({
        name: "",
        specialty: "",
        availability: "",
        avatarUrl: ""
      });
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
              <Label htmlFor="specialty">Specialty *</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => handleInputChange("specialty", e.target.value)}
                placeholder="Fades & Classic Cuts"
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
              <Label htmlFor="avatarUrl">Avatar URL (Optional)</Label>
              <Input
                id="avatarUrl"
                value={formData.avatarUrl}
                onChange={(e) => handleInputChange("avatarUrl", e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use a placeholder image
              </p>
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