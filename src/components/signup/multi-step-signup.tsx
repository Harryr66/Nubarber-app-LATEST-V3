"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, ChevronLeft, ChevronRight, Plus, X, Clock, Users, Scissors } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface Schedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const TIME_SLOTS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
];

export function MultiStepSignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Step 1: Basic Info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [country, setCountry] = useState("");

  // Step 2: Staff
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");

  // Step 3: Schedule
  const [defaultSchedule, setDefaultSchedule] = useState<Schedule[]>([
    { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '17:00' },
  ]);

  // Step 4: Services
  const [services, setServices] = useState<Service[]>([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState(30);
  const [newServicePrice, setNewServicePrice] = useState(0);
  const [newServiceDescription, setNewServiceDescription] = useState("");

  const totalSteps = 4;

  const addStaffMember = () => {
    if (newStaffName.trim()) {
      const newStaff: StaffMember = {
        id: Date.now().toString(),
        name: newStaffName,
        email: newStaffEmail,
        phone: newStaffPhone,
        specialties: []
      };
      setStaffMembers([...staffMembers, newStaff]);
      setNewStaffName("");
      setNewStaffEmail("");
      setNewStaffPhone("");
    }
  };

  const removeStaffMember = (id: string) => {
    setStaffMembers(staffMembers.filter(staff => staff.id !== id));
  };

  const addService = () => {
    if (newServiceName.trim()) {
      const newService: Service = {
        id: Date.now().toString(),
        name: newServiceName,
        duration: newServiceDuration,
        price: newServicePrice,
        description: newServiceDescription
      };
      setServices([...services, newService]);
      setNewServiceName("");
      setNewServiceDuration(30);
      setNewServicePrice(0);
      setNewServiceDescription("");
    }
  };

  const removeService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  const updateSchedule = (day: string, field: keyof Schedule, value: any) => {
    setDefaultSchedule(schedule => 
      schedule.map(s => s.day === day ? { ...s, [field]: value } : s)
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/firebase-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          shopName,
          country,
          locationType: "physical",
          businessAddress: "",
          staffCount: staffMembers.length + 1, // +1 for the owner
          // Include additional setup data
          staffMembers,
          defaultSchedule,
          services
        }),
      });

      if (response.ok) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to NuBarber! Your setup is complete.",
        });
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast({
          title: "Account creation failed",
          description: error.error || "Please try again.",
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
              <p className="text-gray-600">Let's get started with your basic information</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="shopName">Business Name</Label>
                <Input
                  id="shopName"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Your Barbershop Name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Add Your Staff</h2>
              <p className="text-gray-600">Add your team members (optional - you can skip this step)</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="staffName">Name</Label>
                  <Input
                    id="staffName"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="Staff member name"
                  />
                </div>
                <div>
                  <Label htmlFor="staffEmail">Email</Label>
                  <Input
                    id="staffEmail"
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="staff@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="staffPhone">Phone</Label>
                  <Input
                    id="staffPhone"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              
              <Button onClick={addStaffMember} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Staff Member
              </Button>
              
              {staffMembers.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Added Staff:</h3>
                  {staffMembers.map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-sm text-gray-600">{staff.email}</p>
                      </div>
                      <Button
                        onClick={() => removeStaffMember(staff.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Set Your Hours</h2>
              <p className="text-gray-600">Configure your default business hours (optional - you can skip this step)</p>
            </div>
            
            <div className="space-y-4">
              {defaultSchedule.map((day) => (
                <div key={day.day} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-24">
                    <Label className="font-medium">{day.day}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={day.isOpen}
                      onChange={(e) => updateSchedule(day.day, 'isOpen', e.target.checked)}
                      className="rounded"
                    />
                    <Label className="text-sm">Open</Label>
                  </div>
                  
                  {day.isOpen && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">From:</Label>
                        <Select 
                          value={day.openTime} 
                          onValueChange={(value) => updateSchedule(day.day, 'openTime', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">To:</Label>
                        <Select 
                          value={day.closeTime} 
                          onValueChange={(value) => updateSchedule(day.day, 'closeTime', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Add Your Services</h2>
              <p className="text-gray-600">Set up your services and pricing (optional - you can skip this step)</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceName">Service Name</Label>
                  <Input
                    id="serviceName"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="e.g., Haircut, Beard Trim"
                  />
                </div>
                <div>
                  <Label htmlFor="serviceDuration">Duration (minutes)</Label>
                  <Select 
                    value={newServiceDuration.toString()} 
                    onValueChange={(value) => setNewServiceDuration(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="servicePrice">Price ($)</Label>
                  <Input
                    id="servicePrice"
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="serviceDescription">Description</Label>
                  <Input
                    id="serviceDescription"
                    value={newServiceDescription}
                    onChange={(e) => setNewServiceDescription(e.target.value)}
                    placeholder="Brief description"
                  />
                </div>
              </div>
              
              <Button onClick={addService} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
              
              {services.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Added Services:</h3>
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-600">
                          {service.duration} min • ${service.price}
                        </p>
                        {service.description && (
                          <p className="text-sm text-gray-500">{service.description}</p>
                        )}
                      </div>
                      <Button
                        onClick={() => removeService(service.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Step {currentStep} of {totalSteps}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {DAYS_OF_WEEK.slice(0, totalSteps).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderStep()}
        
        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleSkip}
              variant="ghost"
              disabled={loading}
            >
              Skip
            </Button>
            
            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                disabled={loading || !email || !password || !shopName}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && (!email || !password || !shopName)}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
