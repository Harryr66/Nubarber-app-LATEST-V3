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
    { day: "Mon", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Tue", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Wed", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Thu", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Fri", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Sat", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Sun", enabled: false, startTime: "09:00", endTime: "17:00" }
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
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Add a new staff member to your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {/* Name Field */}
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
            
            {/* Working Schedule - Compact Layout */}
            <div className="grid gap-3">
              <Label className="text-sm font-medium">Working Schedule *</Label>
              
              {/* Default Times - Horizontal Layout */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="grid gap-1">
                  <Label className="text-xs text-slate-300">Start</Label>
                  <Input
                    type="time"
                    value={defaultStartTime}
                    onChange={(e) => setDefaultStartTime(e.target.value)}
                    disabled={isLoading}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="grid gap-1">
                  <Label className="text-xs text-slate-300">End</Label>
                  <Input
                    type="time"
                    value={defaultEndTime}
                    onChange={(e) => setDefaultEndTime(e.target.value)}
                    disabled={isLoading}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={applyToAll}
                    disabled={isLoading}
                    className="h-8 w-full text-xs"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    Apply All
                  </Button>
                </div>
              </div>

              {/* Day Selection - Compact Grid */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Working Days</Label>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllDays}
                      disabled={isLoading}
                      className="h-6 px-2 text-xs"
                    >
                      All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAllDays}
                      disabled={isLoading}
                      className="h-6 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                
                {/* Days Grid - 2 rows for compact layout */}
                <div className="grid grid-cols-2 gap-2">
                  {schedule.map((day, index) => (
                    <div key={day.day} className={`flex items-center gap-2 p-2 rounded border ${day.enabled ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 bg-slate-800/30'}`}>
                      <Checkbox
                        id={`day-${index}`}
                        checked={day.enabled}
                        onCheckedChange={() => toggleDay(index)}
                        disabled={isLoading}
                        className="h-3 w-3"
                      />
                      <Label htmlFor={`day-${index}`} className="text-xs font-medium min-w-[30px]">
                        {day.day}
                      </Label>
                      
                      {day.enabled && (
                        <div className="flex items-center gap-1 ml-auto">
                          <Input
                            type="time"
                            value={day.startTime}
                            onChange={(e) => updateDayTime(index, 'startTime', e.target.value)}
                            disabled={isLoading}
                            className="w-16 h-6 text-xs"
                          />
                          <span className="text-slate-400 text-xs">-</span>
                          <Input
                            type="time"
                            value={day.endTime}
                            onChange={(e) => updateDayTime(index, 'endTime', e.target.value)}
                            disabled={isLoading}
                            className="w-16 h-6 text-xs"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Picture - Compact */}
            <div className="grid gap-2">
              <Label>Profile Picture (Optional)</Label>
              <div className="flex items-center gap-3">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={previewUrl} alt="Profile preview" />
                  <AvatarFallback className="text-sm">
                    {formData.name ? formData.name.charAt(0) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('profile-upload')?.click()}
                      disabled={isLoading}
                      className="h-8 text-xs"
                    >
                      <Upload className="mr-1 h-3 w-3" />
                      Upload
                    </Button>
                    {profileImage && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        disabled={isLoading}
                        className="h-8 px-2 text-xs"
                      >
                        <X className="h-3 w-3" />
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
                  <p className="text-xs text-slate-400">
                    {profileImage ? profileImage.name : "Click to upload"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4">
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