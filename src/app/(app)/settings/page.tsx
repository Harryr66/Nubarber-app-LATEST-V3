"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Lightbulb, Link, Sun, Moon, Monitor, Globe, DollarSign } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, Suspense, useEffect } from "react";
import { StripeSettings } from "@/components/stripe-settings";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDepositSettings } from "@/hooks/use-deposit-settings";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const { setTheme } = useTheme();
  const [depositType, setDepositType] = useState('percentage');
  const [depositAmount, setDepositAmount] = useState(25);
  const [refundPolicy, setRefundPolicy] = useState('24h');
  const [customerMessage, setCustomerMessage] = useState('A deposit is required to secure your booking');
  
  // Mock business ID - in production this would come from user context
  const businessId = "demo-business";
  const { 
    depositSettings, 
    loading, 
    error, 
    saveDepositSettings 
  } = useDepositSettings(businessId);

  const handleSaveDepositSettings = async () => {
    const settings = {
      enabled: true,
      type: depositType as 'percentage' | 'fixed',
      amount: depositAmount,
      refundPolicy: refundPolicy as '24h' | '48h' | '72h' | 'no-refund',
      customerMessage,
    };

    const result = await saveDepositSettings(settings);
    if (result.success) {
      // Show success message
      console.log('Deposit settings saved successfully');
    } else {
      // Show error message
      console.error('Failed to save deposit settings:', result.error);
    }
  };

  // Load existing settings when they're available
  useEffect(() => {
    if (depositSettings) {
      setDepositType(depositSettings.type);
      setDepositAmount(depositSettings.amount);
      setRefundPolicy(depositSettings.refundPolicy);
      setCustomerMessage(depositSettings.customerMessage);
    }
  }, [depositSettings]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="theme">Theme</Label>
                <Select onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stripe" className="space-y-6">
          <StripeSettings />
        </TabsContent>

        <TabsContent value="deposits" className="space-y-6">
          {/* Deposit Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Deposit & Payment Settings
              </CardTitle>
              <CardDescription>
                Configure deposit requirements and Stripe payment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Deposit Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Require Deposits</Label>
                  <p className="text-sm text-gray-500">
                    Collect deposits to secure bookings and reduce no-shows
                  </p>
                </div>
                <Switch 
                  id="deposit-toggle" 
                  checked={true} // This will be updated by the hook
                  onCheckedChange={(checked) => {
                    // This will be updated by the hook
                  }}
                />
              </div>

              {/* Deposit Configuration */}
              {true && ( // This will be updated by the hook
                <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deposit-type">Deposit Type</Label>
                      <Select onValueChange={setDepositType} value={depositType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select deposit type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage of Service</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-1">
                        Choose how deposit amounts are calculated
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="deposit-amount">Deposit Amount</Label>
                      <div className="relative">
                        <Input
                          id="deposit-amount"
                          type="number"
                          placeholder="25"
                          className="pr-8"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(Number(e.target.value))}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500 text-sm">
                            {depositType === 'percentage' ? '%' : '$'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {depositType === 'percentage' 
                          ? 'Percentage of total service cost'
                          : 'Fixed dollar amount per booking'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deposit-refund-policy">Refund Policy</Label>
                      <Select onValueChange={setRefundPolicy} value={refundPolicy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select refund policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24 hours before appointment</SelectItem>
                          <SelectItem value="48h">48 hours before appointment</SelectItem>
                          <SelectItem value="72h">72 hours before appointment</SelectItem>
                          <SelectItem value="no-refund">No refunds</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-1">
                        When deposits become non-refundable
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="deposit-message">Customer Message</Label>
                      <Input
                        id="deposit-message"
                        placeholder="A deposit is required to secure your booking"
                        value={customerMessage}
                        onChange={(e) => setCustomerMessage(e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Message shown to customers about deposits
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stripe Integration Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Stripe Integration</h4>
                </div>
                <p className="text-sm text-blue-800">
                  Deposits are automatically processed through Stripe for secure payment handling. 
                  Customers will be charged the deposit amount when they confirm their booking.
                </p>
              </div>

              <Button 
                className="w-full" 
                onClick={handleSaveDepositSettings}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Deposit Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
