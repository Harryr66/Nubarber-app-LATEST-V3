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
import { Upload, X, Copy, Eye, Image as ImageIcon, Calendar, Clock, MapPin, Phone, Mail, X as CloseIcon } from "lucide-react";
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
                            <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center border overflow-hidden">
                                {logoPreview ? (
                                  <Image 
                                    src={logoPreview} 
                                    alt="Shop Logo" 
                                    width={80} 
                                    height={80} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
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
                        <div className="flex items-center p-2 rounded-md bg-muted border">
                           <p className="text-sm font-medium">{derivedUrl}<span className="text-muted-foreground">.nubarber.com</span></p>
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
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Website Preview</DialogTitle>
                          <DialogDescription>
                            This is how your public booking page will appear to customers
                          </DialogDescription>
                        </DialogHeader>
                        
                        {/* Website Preview */}
                        <div className="border rounded-lg overflow-hidden bg-white">
                          {/* Header */}
                          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center">
                                  {logoPreview ? (
                                    <Image 
                                      src={logoPreview} 
                                      alt="Shop Logo" 
                                      width={48} 
                                      height={48} 
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <ImageIcon className="h-8 w-8 text-white/80" />
                                  )}
                                </div>
                                <div>
                                  <h1 className="text-2xl font-bold">{businessName}</h1>
                                  <p className="text-blue-100">Professional Barber Services</p>
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
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                              Book Appointment Now
                            </Button>
                          </div>

                          {/* Services Section */}
                          <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Services</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="text-center p-4 border rounded-lg">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-2xl">✂️</span>
                                </div>
                                <h4 className="font-semibold text-lg mb-2">Haircut</h4>
                                <p className="text-gray-600">Professional haircuts for all styles</p>
                                <p className="text-blue-600 font-semibold mt-2">$25</p>
                              </div>
                              <div className="text-center p-4 border rounded-lg">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-2xl">🧔</span>
                                </div>
                                <h4 className="font-semibold text-lg mb-2">Beard Trim</h4>
                                <p className="text-gray-600">Expert beard grooming and styling</p>
                                <p className="text-blue-600 font-semibold mt-2">$15</p>
                              </div>
                              <div className="text-center p-4 border rounded-lg">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-2xl">💈</span>
                                </div>
                                <h4 className="font-semibold text-lg mb-2">Full Service</h4>
                                <p className="text-gray-600">Haircut, beard trim, and styling</p>
                                <p className="text-blue-600 font-semibold mt-2">$35</p>
                              </div>
                            </div>
                          </div>

                          {/* Contact & Hours */}
                          <div className="bg-gray-50 p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                    <span>123 Main Street, Anytown, USA</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-blue-600" />
                                    <span>+1 (555) 123-4567</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-blue-600" />
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
                          <div className="bg-gray-800 text-white p-6 text-center">
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
