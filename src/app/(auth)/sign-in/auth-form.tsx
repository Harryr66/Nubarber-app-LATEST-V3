
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

export default function AuthForm() {
  const router = useRouter();
  const [staffCount, setStaffCount] = React.useState(1);
  const [locationType, setLocationType] = React.useState("physical");

  const handleStaffCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    setStaffCount(isNaN(count) || count < 1 ? 1 : count);
  };
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission, validation, and API calls here.
    // For this prototype, we'll just redirect to the dashboard.
    router.push('/dashboard');
  };

  const preventDefault = (e: React.FormEvent) => e.preventDefault();

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
          <TabsContent value="sign-in">
            <form onSubmit={preventDefault} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full mt-2">
                Sign In
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="sign-up">
            <form onSubmit={handleSignUp} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input id="password-signup" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shop-name">Shop Name</Label>
                <Input
                  id="shop-name"
                  placeholder="e.g. The Modern Cut"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Location Type</Label>
                <RadioGroup
                  defaultValue="physical"
                  className="flex gap-4"
                  onValueChange={setLocationType}
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
                    placeholder="123 Main St, Anytown, USA"
                    required
                  />
                </div>
              )}
               <div className="grid gap-2">
                <Label htmlFor="staff-count">How many staff members?</Label>
                <Input
                  id="staff-count"
                  type="number"
                  min="1"
                  value={staffCount}
                  onChange={handleStaffCountChange}
                  required
                />
              </div>
              {staffCount > 0 && (
                <div className="grid gap-2">
                  <Label>Staff Member Names</Label>
                  {Array.from({ length: staffCount }, (_, i) => (
                    <Input
                      key={i}
                      id={`staff-name-${i}`}
                      placeholder={`Staff Member ${i + 1}`}
                      required
                    />
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="business-region">Business Region</Label>
                    <Select defaultValue="usa">
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
                    <Select defaultValue="usd">
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
              <Button type="submit" className="w-full mt-2">
                Create Account
              </Button>
            </form>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
