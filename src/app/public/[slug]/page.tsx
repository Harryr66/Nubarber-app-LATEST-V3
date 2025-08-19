"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Phone, Mail, Users, CheckCircle, Star, ArrowRight } from "lucide-react";
import Image from "next/image";

interface PublicPageProps {
  params: {
    slug: string;
  };
}

export default function PublicPage({ params }: PublicPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // Mock business data - in production this would come from your database
  const businessData = {
    name: "Harrys Barbers",
    slug: params.slug,
    logo: "/images/default-avatar.png", // Default logo
    description: "Professional barber services with attention to detail and style",
    address: "123 Main Street, Anytown, USA",
    phone: "+1 (555) 123-4567",
    email: `info@${params.slug}.com`,
    hours: {
      "Monday - Friday": "9:00 AM - 7:00 PM",
      "Saturday": "9:00 AM - 5:00 PM",
      "Sunday": "Closed"
    },
    services: [
      {
        id: "haircut",
        name: "Classic Haircut",
        description: "Professional haircut with consultation and styling",
        duration: "30 min",
        price: 25
      },
      {
        id: "beard-trim",
        name: "Beard Trim & Style",
        description: "Expert beard grooming and styling",
        duration: "20 min",
        price: 15
      },
      {
        id: "full-service",
        name: "Full Service",
        description: "Haircut, beard trim, and complete styling",
        duration: "45 min",
        price: 35
      },
      {
        id: "kids-cut",
        name: "Kids Haircut",
        description: "Gentle haircuts for children 12 and under",
        duration: "25 min",
        price: 20
      }
    ],
    reviews: [
      { name: "Mike Johnson", rating: 5, comment: "Best barber in town! Always does an amazing job." },
      { name: "David Smith", rating: 5, comment: "Professional service and great atmosphere. Highly recommend!" },
      { name: "Chris Wilson", rating: 5, comment: "Clean cuts every time. Been coming here for years." }
    ]
  };

  // Generate calendar data for the next 30 days
  const generateCalendarData = () => {
    const today = new Date();
    const calendarData = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Generate realistic availability (weekends less available, weekdays more available)
      const dayOfWeek = date.getDay();
      let baseCapacity = 80; // Base availability
      
      if (dayOfWeek === 0) baseCapacity = 0; // Sunday closed
      else if (dayOfWeek === 6) baseCapacity = 40; // Saturday limited
      else if (dayOfWeek === 5) baseCapacity = 60; // Friday moderate
      
      // Add some randomness
      const capacity = Math.max(0, Math.min(100, baseCapacity + (Math.random() - 0.5) * 20));
      
      let colorClass = '';
      let status = '';
      
      if (capacity === 0) {
        colorClass = 'bg-gray-300 text-gray-600';
        status = 'Closed';
      } else if (capacity <= 25) {
        colorClass = 'bg-red-100 text-red-800 border-red-200';
        status = 'Limited';
      } else if (capacity <= 50) {
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        status = 'Moderate';
      } else if (capacity <= 75) {
        colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
        status = 'Good';
      } else {
        colorClass = 'bg-green-100 text-green-800 border-green-200';
        status = 'Wide Open';
      }
      
      calendarData.push({
        date,
        capacity,
        colorClass,
        status,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: i === 0,
        isPast: i < 0
      });
    }
    
    return calendarData;
  };

  const calendarData = generateCalendarData();

  // Available time slots
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM"
  ];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !customerName || !customerEmail || !selectedService) {
      alert("Please fill in all required fields");
      return;
    }

    setIsBooking(true);
    
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Booking successful! We'll send you a confirmation email shortly.");
      
      // Reset form
      setSelectedDate(null);
      setSelectedTime("");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setSelectedService("");
    } catch (error) {
      alert("Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden">
                <Image 
                  src={businessData.logo} 
                  alt={`${businessData.name} Logo`}
                  width={48} 
                  height={48} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{businessData.name}</h1>
                <p className="text-gray-300 text-sm">Professional Barber Services</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{businessData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{businessData.address}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Book Your Perfect Cut
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {businessData.description}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>4.9/5</span>
            </div>
            <span>•</span>
            <span>100+ Happy Customers</span>
            <span>•</span>
            <span>Professional Service</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Your Appointment</h3>
              
              {/* Service Selection */}
              <div className="mb-8">
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">Select Service</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businessData.services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedService === service.id
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{service.name}</h4>
                        <span className="text-lg font-bold">${service.price}</span>
                      </div>
                      <p className="text-sm opacity-80 mb-2">{service.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{service.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-8">
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">Select Date</Label>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-gray-700 p-2 text-sm">
                      {day}
                    </div>
                  ))}
                  
                  {calendarData.map((day, index) => (
                    <div key={index} className="relative">
                      <button
                        onClick={() => handleDateSelect(day.date)}
                        disabled={day.isPast || day.capacity === 0}
                        className={`
                          w-full p-3 text-center rounded-lg border-2 transition-all
                          ${day.isPast || day.capacity === 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : day.colorClass
                          }
                          ${selectedDate && selectedDate.toDateString() === day.date.toDateString()
                            ? 'ring-2 ring-black ring-offset-2'
                            : ''
                          }
                          ${!day.isPast && day.capacity > 0 ? 'hover:scale-105' : ''}
                        `}
                      >
                        <div className="text-xs font-medium">{day.dayName}</div>
                        <div className="text-lg font-bold">{day.dayNumber}</div>
                        {day.isToday && (
                          <div className="text-xs text-blue-600 font-semibold">TODAY</div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="mt-4 flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                    <span>Wide Open</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                    <span>Good</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                    <span>Limited</span>
                  </div>
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="mb-8">
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">Select Time</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 text-center rounded-lg border-2 transition-all ${
                          selectedTime === time
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Information */}
              <div className="mb-8">
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">Your Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-xs text-gray-600">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs text-gray-600">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs text-gray-600">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Booking Button */}
              <Button
                onClick={handleBooking}
                disabled={isBooking || !selectedDate || !selectedTime || !customerName || !customerEmail || !selectedService}
                className="w-full bg-black hover:bg-gray-800 text-white py-4 text-lg font-semibold"
              >
                {isBooking ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Book Appointment</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Services Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Services</h4>
              <div className="space-y-3">
                {businessData.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.duration}</p>
                    </div>
                    <span className="font-bold text-gray-900">${service.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h4>
              <div className="space-y-2">
                {Object.entries(businessData.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-600">{day}</span>
                    <span className="font-medium text-gray-900">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h4>
              <div className="space-y-4">
                {businessData.reviews.map((review, index) => (
                  <div key={index} className="border-l-4 border-black pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">"{review.comment}"</p>
                    <p className="text-xs text-gray-500">- {review.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">{businessData.name}</h5>
              <p className="text-gray-300 text-sm">{businessData.description}</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact</h5>
              <div className="space-y-2 text-sm text-gray-300">
                <p>{businessData.address}</p>
                <p>{businessData.phone}</p>
                <p>{businessData.email}</p>
              </div>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Hours</h5>
              <div className="space-y-1 text-sm text-gray-300">
                {Object.entries(businessData.hours).map(([day, hours]) => (
                  <p key={day}>{day}: {hours}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 {businessData.name}. All rights reserved.</p>
            <p className="mt-1">Powered by NuBarber</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 