"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { MultiStepSignup } from "@/components/signup/multi-step-signup";

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        toast({
          title: "Signed in successfully!",
          description: "Welcome back!",
        });
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast({
          title: "Sign in failed",
          description: error.error || "Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResetEmailSent(true);
        toast({
          title: "Reset link sent!",
          description: "Check your email for password reset instructions.",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to send reset link.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForgotPasswordMode(false);
    setResetEmailSent(false);
    setEmail("");
    setPassword("");
  };

  if (forgotPasswordMode) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {resetEmailSent
              ? "Check your email for reset instructions"
              : "Enter your email to receive a reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetEmailSent ? (
            <div className="text-center space-y-4">
              <div className="text-green-600">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Button onClick={resetForm} variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={isSignUp ? "signup" : "signin"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger
            value="signin"
            onClick={() => setIsSignUp(false)}
            className={!isSignUp ? "bg-primary text-primary-foreground" : ""}
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            onClick={() => setIsSignUp(true)}
            className={isSignUp ? "bg-primary text-primary-foreground" : ""}
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Sign in to your barbershop account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setForgotPasswordMode(true)}
                  className="w-full p-0"
                >
                  Forgot your password?
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <MultiStepSignup />
        </TabsContent>
      </Tabs>
    </div>
  );
}
