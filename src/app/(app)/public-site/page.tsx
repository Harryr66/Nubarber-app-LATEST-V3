"use client";

import { useState, useRef, useEffect } from "react";
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
import { Upload, X, Copy, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function PublicSitePage() {
  const businessName = "Harrys Barbers";
  const derivedUrl = businessName.toLowerCase().replace(/\s+/g, '');
  
  // URL configuration - fallback to working domain if .nubarber.com is not available
  const getWorkingUrl = () => {
    // Check if we're in production and have a working domain
    if (typeof window !== 'undefined') {
      const currentDomain = window.location.hostname;
      // If we have a custom domain or are on vercel.app, use subpath
      if (currentDomain.includes('vercel.app') || currentDomain.includes('nubarber.com')) {
        return `${currentDomain}/${derivedUrl}`;
      }
    }
    // Fallback to current deployment URL
    return `download-nqpfv9azq-harrys-projects-4097042e.vercel.app/${derivedUrl}`;
  };

  const workingUrl = getWorkingUrl();
  const whiteLabelUrl = `${derivedUrl}.nubarber.com`;
  
  // Logo state management
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing logo from localStorage on page load
  useEffect(() => {
    const existingLogo = localStorage.getItem('nubarber_logo');
    if (existingLogo) {
      setLogoPreview(existingLogo);
    }
  }, []);

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
    // Clear logo from localStorage
    localStorage.removeItem('nubarber_logo');
    localStorage.removeItem('nubarber_logo_name');
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
        
        // Store logo in localStorage for the public website to use
        if (logoPreview) {
          localStorage.setItem('nubarber_logo', logoPreview);
          localStorage.setItem('nubarber_logo_name', logoFile.name);
        }
        
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
    try {
      await navigator.clipboard.writeText(workingUrl);
      alert("Working URL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy URL:", error);
      alert("Failed to copy URL. Please copy manually.");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold font-heading">Public Site</h1>
        <Button onClick={handleSaveChanges} disabled={isUploading} className="w-full sm:w-auto">
          {isUploading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader className="pb-4 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">Customize Your Booking Page</CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      This is what your clients will see when they visit your booking page.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 md:space-y-8">
                    <div className="space-y-3 md:space-y-4">
                        <Label className="text-sm md:text-base">Shop Logo</Label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-gray-200 overflow-hidden flex-shrink-0">
                                {logoPreview ? (
                                  <Image 
                                    src={logoPreview} 
                                    alt="Shop Logo" 
                                    width={80} 
                                    height={80} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">H</span>
                                  </div>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
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
                                  className="w-full sm:w-auto border-black text-black hover:bg-black hover:text-white"
                                >
                                  <Upload className="mr-2 h-4 w-4" /> 
                                  {logoFile ? "Change Logo" : "Upload Logo"}
                                </Button>
                                {logoFile && (
                                  <Button 
                                    variant="outline" 
                                    onClick={handleRemoveLogo}
                                    disabled={isUploading}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto border-red-200"
                                  >
                                    <X className="mr-2 h-4 w-4" /> Remove
                                  </Button>
                                )}
                            </div>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground leading-tight">
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
                     <div className="space-y-3 md:space-y-4">
                        <Label className="text-sm md:text-base">Your Custom URL</Label>
                        <div className="space-y-3">
                          {/* White Label URL (Future) */}
                          <div className="p-3 md:p-4 rounded-md bg-blue-50 border border-blue-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <span className="text-base md:text-lg font-mono font-semibold text-blue-900 break-all">{whiteLabelUrl}</span>
                              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full w-fit">Future</span>
                            </div>
                            <p className="text-xs md:text-sm text-blue-700 mt-1">Your white-label domain (requires DNS setup)</p>
                          </div>
                          
                          {/* Working URL (Current) */}
                          <div className="p-3 md:p-4 rounded-md bg-green-50 border border-green-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <span className="text-base md:text-lg font-mono font-semibold text-green-900 break-all">{workingUrl}</span>
                              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full w-fit">Active</span>
                            </div>
                            <p className="text-xs md:text-sm text-green-700 mt-1">Your working booking page (ready to use now)</p>
                          </div>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground leading-tight">
                            <strong>White-label URL:</strong> Available once DNS is configured for .nubarber.com domain.<br/>
                            <strong>Working URL:</strong> Use this link immediately to share with customers.
                        </p>
                    </div>
                     <div className="space-y-3 md:space-y-4">
                        <Label htmlFor="headline" className="text-sm md:text-base">Headline</Label>
                        <Input 
                          id="headline" 
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          placeholder="Enter your headline"
                          className="h-10 md:h-11 text-base"
                        />
                    </div>
                    <div className="space-y-3 md:space-y-4">
                        <Label htmlFor="description" className="text-sm md:text-base">Description</Label>
                        <Textarea 
                          id="description" 
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter your description"
                          className="min-h-[80px] md:min-h-[100px] text-base"
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-4 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">Website Preview</CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      This is how your public booking page will look to customers.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 md:space-y-8">
                    {/* Preview Header */}
                    <div className="bg-black text-white p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                {logoPreview ? (
                                    <Image 
                                        src={logoPreview} 
                                        alt="Preview Logo" 
                                        width={40} 
                                        height={40} 
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <span className="text-black text-lg font-bold">H</span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold">{businessName}</h3>
                                <p className="text-sm text-gray-300">Professional Barber Services</p>
                            </div>
                        </div>
                    </div>

                    {/* Preview Content */}
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                        <h4 className="text-xl font-bold text-black mb-3">Book Your Next Appointment</h4>
                        <p className="text-gray-600 mb-4">Professional barber services with easy online booking. Available 24/7 for your convenience.</p>
                        
                        {/* Service Preview */}
                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-black">Classic Haircut</span>
                                <span className="font-bold text-black">$35</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">A timeless haircut tailored to your preferences.</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">⏱️ 30 min</span>
                                <button className="bg-black text-white text-xs px-3 py-1 rounded">Select</button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Form */}
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                        <h4 className="font-bold text-black mb-3">Book Appointment</h4>
                        <div className="space-y-3">
                            <div className="border border-gray-300 rounded p-2">
                                <span className="text-sm text-gray-500">Choose a service...</span>
                            </div>
                            <div className="border border-gray-300 rounded p-2">
                                <span className="text-sm text-gray-500">Select date...</span>
                            </div>
                            <div className="border border-gray-300 rounded p-2">
                                <span className="text-sm text-gray-500">Choose time...</span>
                            </div>
                            <button className="w-full bg-black text-white py-2 rounded font-medium">
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-4 md:space-y-6">
            <Card>
                <CardHeader className="pb-4 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">Your Booking URL</CardTitle>
                    <CardDescription className="text-sm md:text-base">Share this link with your clients.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {/* White Label URL */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 text-xs md:text-sm text-blue-900">
                        <p><strong>White-Label URL:</strong> <span className="break-all">{whiteLabelUrl}</span></p>
                        <p className="text-xs mt-1">Future domain (requires DNS setup)</p>
                      </div>
                      
                      {/* Working URL */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 text-xs md:text-sm text-green-900">
                        <p><strong>Working URL:</strong> <span className="break-all">{workingUrl}</span></p>
                        <p className="text-xs mt-1">Ready to use now - share with customers</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 md:space-y-4">
                      <Label className="text-sm md:text-base">Copy Working URL</Label>
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                          <Input readOnly value={workingUrl} className="h-10 md:h-11 text-sm" />
                          <Button variant="ghost" size="icon" className="w-full sm:w-auto h-10 md:h-11" onClick={handleCopyUrl}>
                              <Copy className="h-4 w-4" />
                          </Button>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground text-center">
                        Copy this URL to share with your customers
                      </p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
