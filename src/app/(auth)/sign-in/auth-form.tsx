
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
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from 'react';

export default function AuthForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [staffCount, setStaffCount] = React.useState(1);
  const [locationType, setLocationType] = React.useState("physical");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = React.useState(false);
  const [country, setCountry] = useState('US');

  const handleStaffCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    setStaffCount(isNaN(count) || count < 1 ? 1 : count);
  };

  // Production-ready email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Production-ready password validation
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return { isValid: errors.length === 0, errors };
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    // Production validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (password.length < 1) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }
    
    try {
      // Make API call to secure authentication endpoint
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const userData = await response.json();
      
      // Use the auth context to login with user data
      login(userData.user);
      
      // Redirect to dashboard immediately
      router.push('/dashboard');
    } catch (err: any) {
      // Handle specific error cases
      if (err.message.includes('Invalid email or password')) {
        setError("Invalid email or password. Please try again.");
      } else if (err.message.includes('Account not found')) {
        setError("No account found with this email address. Please sign up first.");
      } else if (err.message.includes('locked')) {
        setError(err.message);
      } else {
        setError("Sign in failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Signup form submitted');
    setIsLoading(true);
    setError("");

    console.log('📝 Form data:', { email, password, shopName, locationType, businessAddress, staffCount, country });

    // Validate required fields
    if (!email || !password || !shopName || !locationType || !staffCount || !country) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!shopName) missingFields.push('shopName');
      if (!locationType) missingFields.push('locationType');
      if (!staffCount) missingFields.push('staffCount');
      if (!country) missingFields.push('country');
      
      console.error('❌ Missing fields:', missingFields);
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      console.error('❌ Password too short');
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    // Validate business address for physical locations
    if (locationType === 'physical' && (!businessAddress || businessAddress.trim().length === 0)) {
      console.error('❌ Business address required for physical location');
      setError("Business address is required for physical locations");
      setIsLoading(false);
      return;
    }

    if (!staffCount || staffCount < 1 || staffCount > 100) {
      console.error('❌ Invalid staff count:', staffCount);
      setError('Staff count must be between 1 and 100');
      setIsLoading(false);
      return;
    }
    
    try {
      // Use the Firebase-backed signup endpoint
      const requestBody = { 
        email, 
        password, 
        shopName, 
        locationType,
        businessAddress,
        staffCount,
        country
      };
      
      console.log('📤 Sending signup request to Firebase endpoint:', requestBody);
      console.log('🌐 Endpoint URL: /api/auth/signup');
      
      const response = await fetch('/api/auth/signup', { // Reverted endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Response received:', response);
      console.log('📊 Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Signup error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const userData = await response.json();
      console.log('✅ Signup success:', userData);
      
      // Use the auth context to login with user data
      console.log('🔐 Logging in user...');
      login(userData.user);
      
      // Redirect to dashboard immediately
      console.log('🔄 Redirecting to dashboard...');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('💥 Signup error caught:', err);
      console.error('💥 Error type:', typeof err);
      console.error('💥 Error message:', err.message);
      console.error('💥 Error stack:', err.stack);
      
      // Handle specific error cases
      if (err.message.includes('Email already exists')) {
        setError("An account with this email already exists. Please sign in instead.");
      } else if (err.message.includes('Invalid email')) {
        setError("Please enter a valid email address.");
      } else if (err.message.includes('Weak password')) {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError(`Account creation failed: ${err.message}`);
      }
    } finally {
      console.log('🏁 Signup process finished');
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="sign-in" className="w-full max-w-md mx-auto">
      <Card className="mx-4 md:mx-0">
        <CardHeader className="text-center px-4 md:px-6">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="font-heading text-xl md:text-2xl font-bold">
            Welcome to NuBarber
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Sign in to your account or create a new one to get started
          </CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-4">
            <TabsTrigger value="sign-in" className="text-sm md:text-base">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up" className="text-sm md:text-base">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-6">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="whitespace-pre-line text-xs md:text-sm">{error}</div>
            </div>
          )}
          
          <TabsContent value="sign-in">
            <form onSubmit={handleSignIn} className="grid gap-3 md:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm md:text-base">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                  className="h-10 md:h-11 text-base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm md:text-base">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password" 
                    required 
                    disabled={isLoading}
                    className="h-10 md:h-11 text-base pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 md:h-11 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full mt-2 h-10 md:h-11 text-base" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              <div className="text-xs md:text-sm text-gray-500 text-center">
                Forgot your password? Contact support for assistance
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="sign-up">
            <form onSubmit={handleSignUp} className="grid gap-3 md:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email-signup" className="text-sm md:text-base">Email Address</Label>
                <Input
                  id="email-signup"
                  name="email-signup"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-10 md:h-11 text-base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password-signup" className="text-sm md:text-base">Password</Label>
                <div className="relative">
                  <Input 
                    id="password-signup" 
                    name="password-signup"
                    type={showSignUpPassword ? "text" : "password"}
                    placeholder="Create a strong password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={isLoading}
                    className="h-10 md:h-11 text-base pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    disabled={isLoading}
                  >
                    {showSignUpPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shop-name" className="text-sm md:text-base">Shop Name</Label>
                <Input
                  id="shop-name"
                  name="shop-name"
                  placeholder="e.g. The Modern Cut"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-10 md:h-11 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm md:text-base">Location Type</Label>
                <RadioGroup
                  value={locationType}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                  onValueChange={setLocationType}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="physical" id="physical" />
                    <Label htmlFor="physical" className="font-normal text-sm md:text-base">
                      Physical Location
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Label htmlFor="mobile" className="font-normal text-sm md:text-base">
                      Mobile Barber
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {locationType === "physical" && (
                <div className="grid gap-2">
                  <Label htmlFor="business-address" className="text-sm md:text-base">Business Address</Label>
                  <Input
                    id="business-address"
                    name="business-address"
                    placeholder="123 Main St, Anytown, USA"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-10 md:h-11 text-base"
                  />
                </div>
              )}
               <div className="grid gap-2">
                <Label htmlFor="staff-count" className="text-sm md:text-base">How many staff members?</Label>
                <Input
                  id="staff-count"
                  name="staff-count"
                  type="number"
                  min="1"
                  max="50"
                  value={staffCount}
                  onChange={handleStaffCountChange}
                  required
                  disabled={isLoading}
                  className="h-10 md:h-11 text-base"
                />
              </div>
              {staffCount > 0 && (
                <div className="grid gap-2">
                  <Label className="text-sm md:text-base">Staff Member Names</Label>
                  {Array.from({ length: staffCount }, (_, i) => (
                    <Input
                      key={i}
                      id={`staff-name-${i}`}
                      name={`staff-name-${i}`}
                      placeholder={`Staff Member ${i + 1}`}
                      required
                      disabled={isLoading}
                      className="h-10 md:h-11 text-base"
                    />
                  ))}
                </div>
              )}
              <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
                 <div className="grid gap-2">
                    <Label htmlFor="business-region" className="text-sm md:text-base">Business Region</Label>
                    <Select defaultValue="usa" disabled={isLoading}>
                        <SelectTrigger id="business-region" className="h-10 md:h-11 text-base">
                            <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="eu">Europe</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="grid gap-2">
                    <Label htmlFor="currency" className="text-sm md:text-base">Currency</Label>
                    <Select defaultValue="usd" disabled={isLoading}>
                        <SelectTrigger id="currency" className="h-10 md:h-11 text-base">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="usd">USD - US Dollar</SelectItem>
                             <SelectItem value="gbp">GBP - British Pound</SelectItem>
                            <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                            <SelectItem value="eur">EUR - Euro</SelectItem>
                            <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country" className="text-sm md:text-base">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="h-10 md:h-11 text-base">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States (USD)</SelectItem>
                    <SelectItem value="UK">United Kingdom (GBP)</SelectItem>
                    <SelectItem value="CA">Canada (CAD)</SelectItem>
                    <SelectItem value="AU">Australia (AUD)</SelectItem>
                    <SelectItem value="EU">European Union (EUR)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This determines your regional database location and currency
                </p>
              </div>
              <Button type="submit" className="w-full mt-2 h-10 md:h-11 text-base" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              <div className="text-xs md:text-sm text-gray-500 text-center leading-tight">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </div>
            </form>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
