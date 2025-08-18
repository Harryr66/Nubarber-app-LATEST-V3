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
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Upload, X, Clock } from "lucide-react";
import type { StaffMember } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DaySchedule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface AddStaffDialogProps {
  onStaffAdded: (staff: StaffMember) => void;
}

export function AddStaffDialog({ onStaffAdded }: AddStaffDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    availability: ""
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: "Monday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Tuesday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Wednesday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Thursday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Friday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Saturday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Sunday", enabled: false, startTime: "09:00", endTime: "17:00" }
  ]);

  const [defaultStartTime, setDefaultStartTime] = useState("09:00");
  const [defaultEndTime, setDefaultEndTime] = useState("17:00");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format availability string from schedule
      const enabledDays = schedule.filter(day => day.enabled);
      if (enabledDays.length === 0) {
        alert("Please select at least one working day");
        setIsLoading(false);
        return;
      }

      const availabilityString = enabledDays.map(day => 
        `${day.day}: ${day.startTime}-${day.endTime}`
      ).join(", ");

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
        availability: availabilityString,
        avatarUrl: finalAvatarUrl
      };

      // In a real app, you'd save this to Firebase here
      // For now, we'll just add it to the local state
      onStaffAdded(newStaff);

      // Reset form and close dialog
      setFormData({
        name: "",
        availability: ""
      });
      setProfileImage(null);
      setPreviewUrl("");
      setSchedule(schedule.map(day => ({ ...day, enabled: false })));
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

  const toggleDay = (dayIndex: number) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, enabled: !day.enabled } : day
    ));
  };

  const updateDayTime = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, [field]: value } : day
    ));
  };

  const applyToAll = () => {
    setSchedule(prev => prev.map(day => ({
      ...day,
      startTime: defaultStartTime,
      endTime: defaultEndTime
    })));
  };

  const selectAllDays = () => {
    setSchedule(prev => prev.map(day => ({ ...day, enabled: true })));
  };

  const clearAllDays = () => {
    setSchedule(prev => prev.map(day => ({ ...day, enabled: false })));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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
            
            <div className="grid gap-4">
              <Label>Working Schedule *</Label>
              
              {/* Default Times Section */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid gap-2">
                  <Label htmlFor="defaultStart" className="text-sm font-medium">Default Start Time</Label>
                  <Input
                    id="defaultStart"
                    type="time"
                    value={defaultStartTime}
                    onChange={(e) => setDefaultStartTime(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="defaultEnd" className="text-sm font-medium">Default End Time</Label>
                  <Input
                    id="defaultEnd"
                    type="time"
                    value={defaultEndTime}
                    onChange={(e) => setDefaultEndTime(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-span-2 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={applyToAll}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Apply to All Selected Days
                  </Button>
                </div>
              </div>

              {/* Day Selection */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Select Working Days</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllDays}
                      disabled={isLoading}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAllDays}
                      disabled={isLoading}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {schedule.map((day, index) => (
                    <div key={day.day} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${index}`}
                          checked={day.enabled}
                          onCheckedChange={() => toggleDay(index)}
                          disabled={isLoading}
                        />
                        <Label htmlFor={`day-${index}`} className="font-medium min-w-[80px]">
                          {day.day}
                        </Label>
                      </div>
                      
                      {day.enabled && (
                        <div className="flex items-center gap-2 ml-4">
                          <Input
                            type="time"
                            value={day.startTime}
                            onChange={(e) => updateDayTime(index, 'startTime', e.target.value)}
                            disabled={isLoading}
                            className="w-24"
                          />
                          <span className="text-gray-500">to</span>
                          <Input
                            type="time"
                            value={day.endTime}
                            onChange={(e) => updateDayTime(index, 'endTime', e.target.value)}
                            disabled={isLoading}
                            className="w-24"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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