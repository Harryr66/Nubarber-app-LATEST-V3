"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Lightbulb, Link, Sun, Moon, Monitor, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, Suspense } from "react";
import { StripeSettings } from "@/components/stripe-settings";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const { setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Settings</h1>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-blue-900">Integration Setup Guide</CardTitle>
          </div>
          <CardDescription className="text-blue-800">
            Set up your business integrations to accept payments and manage your online presence. Each integration has step-by-step instructions below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-900">Stripe:</span>
              <span className="text-blue-800">Accept online payments for bookings</span>
            </div>
             <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-900">Google My Business:</span>
                <span className="text-blue-800">Sync business information and manage reviews</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="shop-details" className="w-full">
        <TabsList>
          <TabsTrigger value="shop-details">Shop Details</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="google-my-business">Google My Business</TabsTrigger>
        </TabsList>
        <TabsContent value="shop-details">
          <Card>
            <CardHeader>
              <CardTitle>Shop Details</CardTitle>
              <CardDescription>
                Update your barbershop's information here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input id="shopName" defaultValue="Harrys Barbers" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="Mobile" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="py-6" onClick={() => setTheme('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button variant="outline" className="py-6" onClick={() => setTheme('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button variant="outline" className="py-6" onClick={() => setTheme('system')}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
             <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="stripe">
          <Suspense fallback={<div>Loading Stripe settings...</div>}>
            <StripeSettings />
          </Suspense>
        </TabsContent>
        <TabsContent value="google-my-business">
           <Card>
            <CardHeader>
              <CardTitle>Google My Business</CardTitle>
              <CardDescription>
                Sync your business info and manage reviews.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Globe className="h-6 w-6 text-blue-600" />
                            <CardTitle className="text-blue-900">Set Up Google My Business</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-blue-800">
                       <p><strong>Step 1:</strong> Click "Connect with Google" below</p>
                       <p><strong>Step 2:</strong> Sign in with your Google account</p>
                       <p><strong>Step 3:</strong> Grant permission to manage your business</p>
                       <p><strong>Step 4:</strong> Sync your business information!</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>What You'll Get</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <ul className="list-disc list-inside space-y-1">
                            <li>Automatic business info sync</li>
                            <li>Review management</li>
                            <li>Business hours updates</li>
                            <li>Location and contact sync</li>
                        </ul>
                    </CardContent>
                </Card>
            </CardContent>
             <CardFooter className="flex-col items-start gap-4">
                <p className="text-sm text-muted-foreground">Connect your Google My Business profile to keep your online presence up-to-date automatically. This helps customers find accurate information about your business.</p>
              <Button>Connect with Google</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
