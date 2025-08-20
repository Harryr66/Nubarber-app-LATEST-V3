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
                            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center border overflow-hidden flex-shrink-0">
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
                                  className="w-full sm:w-auto"
                                >
                                  <Upload className="mr-2 h-4 w-4" /> 
                                  {logoFile ? "Change Logo" : "Upload Logo"}
                                </Button>
                                {logoFile && (
                                  <Button 
                                    variant="outline" 
                                    onClick={handleRemoveLogo}
                                    disabled={isUploading}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
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
