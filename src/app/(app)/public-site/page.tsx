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
  const businessSlug = DomainService.generateBusinessSlug(businessName);
  const professionalUrl = DomainService.getDefaultSubdomainUrl(businessSlug);
  
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
        console.log('�� Clearing logo data for different business:', existingBusinessName, 'vs', businessName);
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
      
      // Create preview
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

  // Handle logo removal
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setHasExistingLogo(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Clear from localStorage
    localStorage.removeItem('nubarber_logo');
    localStorage.removeItem('nubarber_logo_name');
    localStorage.removeItem('nubarber_business_name');
  };

  // Handle logo upload
  const handleLogoUpload = async () => {
    if (!logoFile) return;
    
    setIsUploading(true);
    try {
      // Convert to base64 for localStorage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        localStorage.setItem('nubarber_logo', base64);
        localStorage.setItem('nubarber_logo_name', logoFile.name);
        localStorage.setItem('nubarber_business_name', businessName);
        setHasExistingLogo(true);
        setIsUploading(false);
        alert('Logo uploaded successfully!');
      };
      reader.readAsDataURL(logoFile);
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Public Site Configuration</h1>
          <p className="text-muted-foreground">
            Customize your public booking page and manage your professional URL
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Website Settings</CardTitle>
            <CardDescription>
              Configure your public booking page appearance and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload Section */}
            <div className="space-y-3 md:space-y-4">
              <Label className="text-sm md:text-base font-semibold">🏪 Shop Logo</Label>
              <div className="flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-lg">
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200">
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

            {/* Professional URL Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Your Professional Booking URL
                </CardTitle>
                <CardDescription>
                  Your customers can book appointments at this clean, professional URL
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessSlug">Business Slug</Label>
                    <Input
                      id="businessSlug"
                      value={businessSlug}
                      readOnly
                      className="bg-gray-50 font-mono"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Automatically generated from your business name
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="professionalUrl">Your Professional URL</Label>
                    <Input
                      id="professionalUrl"
                      value={professionalUrl}
                      readOnly
                      className="bg-gray-50 font-mono text-blue-600"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This URL is live and ready for your customers
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="font-medium text-green-800">✅ Your Website is Live!</p>
                    <p className="text-sm text-green-600 break-all font-mono">
                      {professionalUrl}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(professionalUrl);
                      alert('Professional URL copied to clipboard!');
                    }}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={professionalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Visit Your Website
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(professionalUrl);
                      alert('Professional URL copied to clipboard!');
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    <Copy className="h-4 w-4" />
                    Copy URL
                  </button>
                </div>
              </CardContent>
            </Card>

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
    </div>
  );
}
