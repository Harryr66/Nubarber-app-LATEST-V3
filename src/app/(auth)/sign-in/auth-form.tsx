
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

export default function AuthForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [staffCount, setStaffCount] = React.useState(1);
  const [locationType, setLocationType] = React.useState("physical");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = React.useState(false);

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
      // In production, this would make an API call to your backend
      // For now, we'll simulate a secure authentication process
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const userData = await response.json();
      
      // Use the auth context to login
      login(email, userData.shopName);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      // Handle specific error cases
      if (err.message.includes('Invalid credentials')) {
        setError("Invalid email or password. Please try again.");
      } else if (err.message.includes('Account not found')) {
        setError("No account found with this email address. Please sign up first.");
      } else if (err.message.includes('Account locked')) {
        setError("Account has been temporarily locked due to multiple failed attempts. Please try again later.");
      } else {
        setError("Sign in failed. Please check your credentials and try again.");
      }
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
    const businessAddress = formData.get("business-address") as string;
    
    // Production validation
    if (!email || !password || !shopName) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(`Password requirements not met:\n${passwordValidation.errors.join('\n')}`);
      setIsLoading(false);
      return;
    }

    if (shopName.trim().length < 2) {
      setError("Shop name must be at least 2 characters long");
      setIsLoading(false);
      return;
    }

    if (locationType === "physical" && !businessAddress?.trim()) {
      setError("Business address is required for physical locations");
      setIsLoading(false);
      return;
    }
    
    try {
      // In production, this would make an API call to your backend
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          shopName, 
          locationType,
          businessAddress,
          staffCount 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Account creation failed');
      }

      const userData = await response.json();
      
      // Use the auth context to login with shop name
      login(email, shopName);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      // Handle specific error cases
      if (err.message.includes('Email already exists')) {
        setError("An account with this email already exists. Please sign in instead.");
      } else if (err.message.includes('Invalid email')) {
        setError("Please enter a valid email address.");
      } else if (err.message.includes('Weak password')) {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError("Account creation failed. Please try again.");
      }
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
            Welcome to NuBarber
          </CardTitle>
          <CardDescription>
            Sign in to your account or create a new one to get started
          </CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-4">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="whitespace-pre-line">{error}</div>
            </div>
          )}
          
          <TabsContent value="sign-in">
            <form onSubmit={handleSignIn} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password" 
                    required 
                    disabled={isLoading}
                    className="h-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent"
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
              <Button type="submit" className="w-full mt-2 h-10" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              <div className="text-xs text-gray-500 text-center">
                Forgot your password? Contact support for assistance
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="sign-up">
            <form onSubmit={handleSignUp} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email-signup">Email Address</Label>
                <Input
                  id="email-signup"
                  name="email-signup"
                  type="email"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password-signup">Password</Label>
                <div className="relative">
                  <Input
                    id="password-signup"
                    name="password-signup"
                    type={showSignUpPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    disabled={isLoading}
                    className="h-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent"
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
                <div className="text-xs text-gray-500">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shop-name">Shop Name</Label>
                <Input
                  id="shop-name"
                  name="shop-name"
                  placeholder="e.g. The Modern Cut"
                  required
                  disabled={isLoading}
                  className="h-10"
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
                    className="h-10"
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
                  max="50"
                  value={staffCount}
                  onChange={handleStaffCountChange}
                  required
                  disabled={isLoading}
                  className="h-10"
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
                      className="h-10"
                    />
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="business-region">Business Region</Label>
                    <Select defaultValue="usa" disabled={isLoading}>
                        <SelectTrigger id="business-region" className="h-10">
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
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="usd" disabled={isLoading}>
                        <SelectTrigger id="currency" className="h-10">
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
              <Button type="submit" className="w-full mt-2 h-10" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              <div className="text-xs text-gray-500 text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </div>
            </form>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
