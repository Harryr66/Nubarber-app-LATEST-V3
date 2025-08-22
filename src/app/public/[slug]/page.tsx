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
  const [logoUrl, setLogoUrl] = useState<string>("/images/default-avatar.png");

  // Load uploaded logo from localStorage
  useEffect(() => {
    const storedLogo = localStorage.getItem('nubarber_logo');
    if (storedLogo) {
      setLogoUrl(storedLogo);
    }
  }, []);

  // Mock business data - in production this would come from your database
  const businessData = {
    name: "Harrys Barbers",
    slug: params.slug,
    logo: logoUrl, // Use the uploaded logo
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
      } else if (capacity < 30) {
        colorClass = 'bg-red-500 text-white';
        status = 'Limited';
      } else if (capacity < 60) {
        colorClass = 'bg-orange-500 text-white';
        status = 'Moderate';
      } else if (capacity < 80) {
        colorClass = 'bg-green-400 text-black';
        status = 'Good';
      } else {
        colorClass = 'bg-green-600 text-white';
        status = 'Wide Open';
      }
      
      calendarData.push({
        date,
        capacity,
        colorClass,
        status,
        isToday: i === 0
      });
    }
    
    return calendarData;
  };

  const calendarData = generateCalendarData();

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !customerName || !customerEmail || !selectedService) {
      alert("Please fill in all fields");
      return;
    }
    
    setIsBooking(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert("Booking submitted successfully! We'll confirm your appointment soon.");
    setIsBooking(false);
    
    // Reset form
    setSelectedDate(null);
    setSelectedTime("");
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setSelectedService("");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-black text-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Image 
                  src={businessData.logo} 
                  alt={businessData.name} 
                  width={48} 
                  height={48} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{businessData.name}</h1>
                <p className="text-gray-300 text-sm">Professional Barber Services</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black text-xs font-bold">★</span>
              </div>
              <span className="text-sm">4.9 (127 reviews)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Book Your Next Appointment
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            {businessData.description}
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>Professional Service</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs">⏰</span>
              </div>
              <span>Flexible Hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs">👥</span>
              </div>
              <span>Experienced Staff</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Services & Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* Services */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">Our Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessData.services.map((service) => (
                  <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-black">{service.name}</h4>
                      <span className="text-2xl font-bold text-black">${service.price}</span>
                    </div>
                    <p className="text-gray-600 mb-3">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center">
                        <span className="mr-1">⏱️</span>
                        {service.duration}
                      </span>
                      <button 
                        onClick={() => setSelectedService(service.id)}
                        className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">Contact Information</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📍</span>
                    </div>
                    <span className="text-gray-700">{businessData.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📞</span>
                    </div>
                    <span className="text-gray-700">{businessData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✉️</span>
                    </div>
                    <span className="text-gray-700">{businessData.email}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Business Hours */}
            <section>
              <h3 className="text-2xl font-bold text-black mb-6">Business Hours</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="space-y-3">
                  {Object.entries(businessData.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-black">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Booking Form & Calendar */}
          <div className="space-y-8">
            {/* Booking Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-4">Book Appointment</h3>
              <p className="text-sm text-gray-600 mb-6">Select a service and time that works for you</p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="service" className="text-sm font-medium text-black">Select Service</Label>
                  <select
                    id="service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Choose a service...</option>
                    {businessData.services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - ${service.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="date" className="text-sm font-medium text-black">Select Date</Label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <Label htmlFor="time" className="text-sm font-medium text-black">Select Time</Label>
                  <select
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-black focus:border-transparent"
                  >
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
                    <option value="18:00">6:00 PM</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-black">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1 bg-white text-black border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-black">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="mt-1 bg-white text-black border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-black">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="mt-1 bg-white text-black border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={isBooking || !selectedDate || !selectedTime || !customerName || !customerEmail || !selectedService}
                  className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isBooking ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </div>

            {/* Availability Calendar */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-4">Availability</h3>
              <p className="text-sm text-gray-600 mb-6">Check our availability for the next 30 days</p>
              
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-xs font-medium text-gray-600 text-center py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarData.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded text-xs font-medium flex items-center justify-center cursor-pointer transition-colors ${
                      day.isToday ? 'ring-2 ring-black' : ''
                    } ${day.colorClass}`}
                    title={`${day.date.toLocaleDateString()}: ${day.status}`}
                  >
                    {day.isToday ? 'TODAY' : day.date.getDate()}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-600">Limited</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-gray-600">Moderate</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 bg-green-400 rounded"></div>
                  <span className="text-gray-600">Good</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 bg-green-600 rounded"></div>
                  <span className="text-gray-600">Wide Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">&copy; 2024 {businessData.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 