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

  // Form data state
  const [headline, setHeadline] = useState("Book your next appointment with us");
  const [description, setDescription] = useState("Easy and fast booking, available 24/7.");

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
