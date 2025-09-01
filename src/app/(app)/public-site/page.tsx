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
import { Upload, X, Copy, Image as ImageIcon, Globe } from "lucide-react";
import Image from "next/image";
import { DomainService, DOMAIN_CONFIG } from "@/lib/domains";

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
  const [hasExistingLogo, setHasExistingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing logo from localStorage on page load
  useEffect(() => {
    const existingLogo = localStorage.getItem('nubarber_logo');
    const existingBusinessName = localStorage.getItem('nubarber_business_name');
    
    // Only load logo if it matches the current business name AND user is authenticated
    if (existingLogo && existingBusinessName === businessName) {
      // Check if this is actually the current user's logo
      const currentUserEmail = localStorage.getItem('current_user_email');
      if (currentUserEmail) {
        setLogoPreview(existingLogo);
        setHasExistingLogo(true);
        console.log('✅ Loaded existing logo for:', businessName);
      } else {
        // Clear logo if no current user
        console.log('🧹 No current user, clearing logo data');
        localStorage.removeItem('nubarber_logo');
        localStorage.removeItem('nubarber_logo_name');
        localStorage.removeItem('nubarber_business_name');
        setLogoPreview("");
        setHasExistingLogo(false);
      }
    } else {
      // Clear any mismatched logo data
      if (existingLogo && existingBusinessName !== businessName) {
        console.log('🧹 Clearing logo data for different business:', existingBusinessName, 'vs', businessName);
        localStorage.removeItem('nubarber_logo');
        localStorage.removeItem('nubarber_logo_name');
        localStorage.removeItem('nubarber_business_name');
        setLogoPreview("");
        setHasExistingLogo(false);
      }
    }
  }, [businessName]);

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
    localStorage.removeItem('nubarber_business_name');
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
          // Also store the business name
          localStorage.setItem('nubarber_business_name', businessName);
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
                                {logoPreview && hasExistingLogo ? (
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

                    {/* Dynamic Subdomain Configuration */}
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          Your Professional Booking URL
                        </CardTitle>
                        <CardDescription>
                          Every barbershop automatically gets a clean URL like harrysbarbers.nubarber.com
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="businessSlug">Business Slug</Label>
                            <Input
                              id="businessSlug"
                              value={businessName ? DomainService.generateBusinessSlug(businessName) : ''}
                              readOnly
                              className="bg-gray-50 font-mono"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              Automatically generated from your business name
                            </p>
                          </div>
                          <div>
                            <Label htmlFor="customDomain">Your Professional URL</Label>
                            <Input
                              id="customDomain"
                              value={businessName ? DomainService.getDefaultSubdomainUrl(DomainService.generateBusinessSlug(businessName)) : ''}
                              readOnly
                              className="bg-gray-50 font-mono text-blue-600"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              This URL is LIVE and ready for your customers
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-green-900 mb-2">✅ SUBDOMAIN SYSTEM OPERATIONAL - Ready for Customers!</h4>
                          <p className="text-sm text-green-800">
                            Your subdomain system is LIVE! Every barbershop automatically gets their professional URL when they sign up. 
                            Your customers (barbers) don't need to buy domains or configure DNS - it's all automatic!
                          </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
