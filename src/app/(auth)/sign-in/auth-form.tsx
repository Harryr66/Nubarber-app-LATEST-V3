
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/logo";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/auth-provider";

export default function AuthForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [staffCount, setStaffCount] = React.useState(1);
  const [locationType, setLocationType] = React.useState("physical");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleStaffCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    setStaffCount(isNaN(count) || count < 1 ? 1 : count);
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    // For demo purposes, accept any email/password combination
    // In production, this would validate against Firebase Auth
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the auth context to login
      login(email);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email-signup") as string;
    const password = formData.get("password-signup") as string;
    const shopName = formData.get("shop-name") as string;
    
    // Simple validation
    if (!email || !password || !shopName) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the auth context to login with shop name
      login(email, shopName);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError("Account creation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="sign-in" className="w-full max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="font-headline text-2xl font-bold">
            Welcome
          </CardTitle>
          <CardDescription>
            Sign in or create an account to continue
          </CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-4">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <TabsContent value="sign-in">
            <form onSubmit={handleSignIn} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              <div className="text-xs text-gray-500 text-center">
                Demo: Use any email and password to sign in
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="sign-up">
            <form onSubmit={handleSignUp} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  name="email-signup"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                  id="password-signup"
                  name="password-signup"
                  type="password"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shop-name">Shop Name</Label>
                <Input
                  id="shop-name"
                  name="shop-name"
                  placeholder="e.g. The Modern Cut"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Location Type</Label>
                <RadioGroup
                  defaultValue="physical"
                  className="flex gap-4"
                  onValueChange={setLocationType}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="physical" id="physical" />
                    <Label htmlFor="physical" className="font-normal">
                      Physical Location
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Label htmlFor="mobile" className="font-normal">
                      Mobile Barber
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {locationType === "physical" && (
                <div className="grid gap-2">
                  <Label htmlFor="business-address">Business Address</Label>
                  <Input
                    id="business-address"
                    name="business-address"
                    placeholder="123 Main St, Anytown, USA"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}
               <div className="grid gap-2">
                <Label htmlFor="staff-count">How many staff members?</Label>
                <Input
                  id="staff-count"
                  name="staff-count"
                  type="number"
                  min="1"
                  value={staffCount}
                  onChange={handleStaffCountChange}
                  required
                  disabled={isLoading}
                />
              </div>
              {staffCount > 0 && (
                <div className="grid gap-2">
                  <Label>Staff Member Names</Label>
                  {Array.from({ length: staffCount }, (_, i) => (
                    <Input
                      key={i}
                      id={`staff-name-${i}`}
                      name={`staff-name-${i}`}
                      placeholder={`Staff Member ${i + 1}`}
                      required
                      disabled={isLoading}
                    />
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="business-region">Business Region</Label>
                    <Select defaultValue="usa" disabled={isLoading}>
                        <SelectTrigger id="business-region">
                            <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="eu">Europe</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="usd" disabled={isLoading}>
                        <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="usd">USD - United States...</SelectItem>
                             <SelectItem value="gbp">GBP - British Pound</SelectItem>
                            <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                            <SelectItem value="eur">EUR - Euro</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
