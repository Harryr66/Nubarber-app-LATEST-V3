"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Copy, Eye, Image as ImageIcon, Calendar, Clock, MapPin, Phone, Mail, Users } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const dynamic = "force-dynamic";

export default function PublicSitePage() {
  const businessName = "Harrys Barbers";
  const derivedUrl = businessName.toLowerCase().replace(/\s+/g, '');
  
  // Logo state management
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data state
  const [headline, setHeadline] = useState("Book your next appointment with us");
  const [description, setDescription] = useState("Easy and fast booking, available 24/7.");

  // Mock calendar data for heat map
  const generateCalendarData = () => {
    const today = new Date();
    const calendarData = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Generate random capacity data (0-100%)
      const capacity = Math.floor(Math.random() * 101);
      let colorClass = '';
      let status = '';
      
      if (capacity === 0) {
        colorClass = 'bg-red-500 text-white';
        status = 'Fully Booked';
      } else if (capacity <= 25) {
        colorClass = 'bg-orange-500 text-white';
        status = 'Limited Availability';
      } else if (capacity <= 50) {
        colorClass = 'bg-yellow-500 text-black';
        status = 'Moderate Availability';
      } else if (capacity <= 75) {
        colorClass = 'bg-green-400 text-black';
        status = 'Good Availability';
      } else {
        colorClass = 'bg-green-600 text-white';
        status = 'Wide Open';
      }
      
      calendarData.push({
        date,
        capacity,
        colorClass,
        status,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    
    return calendarData;
  };

  const calendarData = generateCalendarData();

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        alert("File size must be less than 1MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }

      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle remove logo
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (logoFile) {
      setIsUploading(true);
      try {
        // Simulate file upload - in production this would go to your storage service
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Here you would typically upload to Firebase Storage, AWS S3, etc.
        console.log("Logo uploaded:", logoFile.name);
        
        // Show success message
        alert("Logo uploaded successfully!");
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
    
    // Save other changes
    alert("Changes saved successfully!");
  };

  // Handle copy URL
  const handleCopyUrl = async () => {
    const url = `https://www.nubarber.com/${derivedUrl}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("URL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy URL:", error);
      alert("Failed to copy URL. Please copy manually.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading">Public Site</h1>
        <Button onClick={handleSaveChanges} disabled={isUploading}>
          {isUploading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Customize Your Booking Page</CardTitle>
                    <CardDescription>This is what your clients will see when they visit your booking page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-2">
                        <Label>Shop Logo</Label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center border overflow-hidden">
                                {logoPreview ? (
                                  <Image 
                                    src={logoPreview} 
                                    alt="Shop Logo" 
                                    width={80} 
                                    height={80} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="h-8 w-8 text-gray-400" />
                                )}
                            </div>
                            <div className="flex gap-2">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileSelect}
                                  className="hidden"
                                />
                                <Button 
                                  variant="outline" 
                                  onClick={handleUploadClick}
                                  disabled={isUploading}
                                >
                                  <Upload className="mr-2 h-4 w-4" /> 
                                  {logoFile ? "Change Logo" : "Upload Logo"}
                                </Button>
                                {logoFile && (
                                  <Button 
                                    variant="outline" 
                                    onClick={handleRemoveLogo}
                                    disabled={isUploading}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="mr-2 h-4 w-4" /> Remove
                                  </Button>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Upload your shop logo (max 1MB). This will be displayed prominently on your public booking page.
                            <br />
                            Recommended: Square image, 500x500 pixels or smaller for best performance.
                            {logoFile && (
                              <span className="block mt-1 text-green-600">
                                ✓ Logo selected: {logoFile.name} ({(logoFile.size / 1024).toFixed(1)}KB)
                              </span>
                            )}
                        </p>
                    </div>
                     <div className="space-y-2">
                        <Label>Custom URL</Label>
                        <div className="flex items-center p-2 rounded-md bg-gray-100 border">
                           <p className="text-sm font-medium">{derivedUrl}<span className="text-gray-500">.nubarber.com</span></p>
                        </div>
                         <p className="text-sm text-muted-foreground">
                            Your custom URL is automatically generated from your business name: {businessName}.
                        </p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input 
                          id="headline" 
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          placeholder="Enter your headline"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter your description"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Booking URL</CardTitle>
                    <CardDescription>Share this link with your clients.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                        <p><strong>Current:</strong> https://www.nubarber.com/{derivedUrl}</p>
                        <p><strong>Future:</strong> {derivedUrl}.nubarber.com (requires DNS setup)</p>
                    </div>
                    <div className="flex items-center">
                        <Input readOnly value={`https://www.nubarber.com/${derivedUrl}`} />
                        <Button variant="ghost" size="icon" className="ml-2" onClick={handleCopyUrl}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <Dialog open={showPreview} onOpenChange={setShowPreview}>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Eye className="mr-2 h-4 w-4"/> Preview Website
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Website Preview</DialogTitle>
                          <DialogDescription>
                            This is how your public booking page will appear to customers
                          </DialogDescription>
                        </DialogHeader>
                        
                        {/* Website Preview */}
                        <div className="border rounded-lg overflow-hidden bg-white">
                          {/* Header */}
                          <div className="bg-black text-white p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden">
                                  {logoPreview ? (
                                    <Image 
                                      src={logoPreview} 
                                      alt="Shop Logo" 
                                      width={48} 
                                      height={48} 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <ImageIcon className="h-8 w-8 text-white/80" />
                                  )}
                                </div>
                                <div>
                                  <h1 className="text-2xl font-bold">{businessName}</h1>
                                  <p className="text-gray-300">Professional Barber Services</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4" />
                                  <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-4 w-4" />
                                  <span>info@{derivedUrl}.com</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Hero Section */}
                          <div className="p-8 text-center bg-gray-50">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{headline}</h2>
                            <p className="text-lg text-gray-600 mb-6">{description}</p>
                            <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
                              Book Appointment Now
                            </Button>
                          </div>

                          {/* Booking Calendar Section - PROMINENT */}
                          <div className="p-8 bg-white border-b">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Book Your Appointment</h3>
                            <p className="text-center text-gray-600 mb-8">Select your preferred date and time</p>
                            
                            {/* Calendar Heat Map */}
                            <div className="max-w-4xl mx-auto">
                              <div className="grid grid-cols-7 gap-2 mb-4">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                  <div key={day} className="text-center font-semibold text-gray-700 p-2">
                                    {day}
                                  </div>
                                ))}
                              </div>
                              
                              <div className="grid grid-cols-7 gap-2">
                                {calendarData.map((day, index) => (
                                  <div key={index} className="relative">
                                    <div className={`
                                      p-3 text-center cursor-pointer hover:scale-105 transition-transform
                                      border rounded-lg ${day.colorClass}
                                    `}>
                                      <div className="text-sm font-medium">{day.dayName}</div>
                                      <div className="text-lg font-bold">{day.dayNumber}</div>
                                      <div className="text-xs opacity-80">{day.month}</div>
                                      <div className="text-xs mt-1">
                                        <Users className="h-3 w-3 inline mr-1" />
                                        {day.capacity}%
                                      </div>
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                      {day.status}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Legend */}
                              <div className="mt-6 flex justify-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                                  <span>Fully Booked</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                  <span>Limited</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                  <span>Moderate</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                                  <span>Good</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                                  <span>Wide Open</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Services Section */}
                          <div className="p-8 bg-gray-50">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Services</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="text-center p-4 border rounded-lg bg-white">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-2xl">✂️</span>
                                </div>
                                <h4 className="font-semibold text-lg mb-2">Haircut</h4>
                                <p className="text-gray-600">Professional haircuts for all styles</p>
                                <p className="text-black font-semibold mt-2">$25</p>
                              </div>
                              <div className="text-center p-4 border rounded-lg bg-white">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-2xl">🧔</span>
                                </div>
                                <h4 className="font-semibold text-lg mb-2">Beard Trim</h4>
                                <p className="text-gray-600">Expert beard grooming and styling</p>
                                <p className="text-black font-semibold mt-2">$15</p>
                              </div>
                              <div className="text-center p-4 border rounded-lg bg-white">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-2xl">💈</span>
                                </div>
                                <h4 className="font-semibold text-lg mb-2">Full Service</h4>
                                <p className="text-gray-600">Haircut, beard trim, and styling</p>
                                <p className="text-black font-semibold mt-2">$35</p>
                              </div>
                            </div>
                          </div>

                          {/* Contact & Hours */}
                          <div className="p-8 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-black" />
                                    <span>123 Main Street, Anytown, USA</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-black" />
                                    <span>+1 (555) 123-4567</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-black" />
                                    <span>info@{derivedUrl}.com</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Monday - Friday</span>
                                    <span>9:00 AM - 7:00 PM</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Saturday</span>
                                    <span>9:00 AM - 5:00 PM</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Sunday</span>
                                    <span>Closed</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="bg-black text-white p-6 text-center">
                            <p>&copy; 2024 {businessName}. All rights reserved.</p>
                            <p className="text-gray-400 text-sm mt-2">Powered by NuBarber</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                     <p className="text-xs text-muted-foreground text-center">
                        Click "Preview Website" to see how your booking page will appear to customers
                     </p>
                </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}
