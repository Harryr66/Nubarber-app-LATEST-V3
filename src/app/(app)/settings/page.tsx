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
import { CreditCard, Lightbulb, Link, Sun, Moon, Monitor, Rocket, CheckCircle2, Globe, AlertCircle, ExternalLink, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useStripeConnect } from "@/hooks/use-stripe-connect";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const { setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("US");
  
  const {
    connectionStatus,
    isConnecting,
    error,
    success,
    connectStripe,
    disconnectStripe,
    refreshStatus,
  } = useStripeConnect();

  const handleConnectStripe = async () => {
    if (!email.trim()) {
      return;
    }
    await connectStripe(email.trim(), country);
  };

  const handleDisconnectStripe = async () => {
    await disconnectStripe();
  };

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
              <span className="text-blue-800">
                {connectionStatus.isConnected ? "Connected ✓" : "Accept online payments for bookings"}
              </span>
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
          <Card>
            <CardHeader>
              <CardTitle>Stripe Connection</CardTitle>
              <CardDescription>
                Manage your Stripe integration for secure payments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Messages */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>{error}</div>
                </div>
              )}
              
              {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>{success}</div>
                </div>
              )}

              {/* Connection Status */}
              {connectionStatus.isConnected && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <CardTitle className="text-green-900">Stripe Connected Successfully!</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-green-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold">Account ID:</span>
                        <span className="ml-2 font-mono text-xs">{connectionStatus.accountId}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Country:</span>
                        <span className="ml-2">{connectionStatus.country}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Currency:</span>
                        <span className="ml-2">{connectionStatus.defaultCurrency?.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Business Type:</span>
                        <span className="ml-2 capitalize">{connectionStatus.businessType}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`h-4 w-4 ${connectionStatus.chargesEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                        <span>Charges Enabled: {connectionStatus.chargesEnabled ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`h-4 w-4 ${connectionStatus.payoutsEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                        <span>Payouts Enabled: {connectionStatus.payoutsEnabled ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`h-4 w-4 ${connectionStatus.detailsSubmitted ? 'text-green-600' : 'text-gray-400'}`} />
                        <span>Details Submitted: {connectionStatus.detailsSubmitted ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      onClick={handleDisconnectStripe}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Disconnect Stripe
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Setup Instructions */}
              {!connectionStatus.isConnected && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Rocket className="h-6 w-6 text-blue-600" />
                      <CardTitle className="text-blue-900">Set Up Stripe Payments</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-blue-800">
                    <div className="space-y-2">
                      <p><strong>Step 1:</strong> Enter your business email below</p>
                      <p><strong>Step 2:</strong> Click "Connect with Stripe"</p>
                      <p><strong>Step 3:</strong> Complete Stripe's onboarding process</p>
                      <p><strong>Step 4:</strong> Verify your business information</p>
                      <p><strong>Step 5:</strong> Start accepting online payments!</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="stripe-email" className="text-blue-900">Business Email</Label>
                        <Input
                          id="stripe-email"
                          type="email"
                          placeholder="your@business.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="stripe-country" className="text-blue-900">Country</Label>
                        <select
                          id="stripe-country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md bg-white"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Benefits Card */}
              <Card>
                <CardHeader>
                  <CardTitle>What You'll Get</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Secure credit card processing</li>
                    <li>Automatic payment collection</li>
                    <li>Professional checkout experience</li>
                    <li>24/7 payment acceptance</li>
                    <li>PCI compliance handled by Stripe</li>
                    <li>Fraud protection and dispute management</li>
                    <li>Detailed transaction reporting</li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <p className="text-sm text-muted-foreground">
                {connectionStatus.isConnected 
                  ? "Your Stripe account is connected and ready to accept payments. You can manage your account settings directly in the Stripe dashboard."
                  : "Connect your Stripe account to start accepting online payments for bookings. Stripe handles all the security and compliance for you."
                }
              </p>
              
              {!connectionStatus.isConnected && (
                <Button 
                  onClick={handleConnectStripe}
                  disabled={isConnecting || !email.trim()}
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Connect with Stripe
                    </>
                  )}
                </Button>
              )}
              
              {connectionStatus.isConnected && (
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Stripe Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={refreshStatus}
                    className="flex-1"
                  >
                    Refresh Status
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
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
