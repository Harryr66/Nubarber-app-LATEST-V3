"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Phone, Mail, Star } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

interface StaffMember {
  id: string;
  name: string;
  specialty: string;
  availability: string;
  avatarUrl: string;
}

export default function ShopPage({ params }: { params: { shop: string } }) {
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Convert shop slug to display name (e.g., "harrysbarbers" -> "Harrys Barbers")
  const getDisplayName = (slug: string) => {
    return slug
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  const shopName = getDisplayName(params.shop);

  useEffect(() => {
    // Fetch services and staff data
    Promise.all([
      fetch("/api/data?type=services").then(res => res.json()),
      fetch("/api/data?type=staff").then(res => res.json())
    ]).then(([servicesData, staffData]) => {
      setServices(servicesData);
      setStaff(staffData);
      setIsLoading(false);
    }).catch(error => {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading {shopName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {shopName.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{shopName}</h1>
                <p className="text-gray-600">Professional Barber Services</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-gray-700 font-medium">4.9</span>
                <span className="text-gray-500">(127 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Services */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                Book Your Next Appointment
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Professional barber services with easy online booking. 
                Available 24/7 for your convenience.
              </p>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Our Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{service.name}</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${service.price}
                        </span>
                      </CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration} min
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {service.category}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Staff */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Our Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staff.map((member) => (
                  <Card key={member.id} className="text-center">
                    <CardContent className="pt-6">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg">{member.name}</h4>
                      <p className="text-gray-600 text-sm">{member.specialty}</p>
                      <p className="text-gray-500 text-xs mt-2">{member.availability}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
                <CardDescription>
                  Select a service and time that works for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Service</label>
                  <select className="w-full p-3 border border-gray-300 rounded-md">
                    <option value="">Choose a service...</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - ${service.price}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border border-gray-300 rounded-md"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Time</label>
                  <select className="w-full p-3 border border-gray-300 rounded-md">
                    <option value="">Choose a time...</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>

                <Button className="w-full" size="lg">
                  Book Appointment
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">123 Main Street, Anytown, USA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">info@{shopName.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 