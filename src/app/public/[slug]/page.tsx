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
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [businessName, setBusinessName] = useState("Harrys Barbers");

  // Load uploaded logo and business name from localStorage
  useEffect(() => {
    const storedLogo = localStorage.getItem('nubarber_logo');
    const storedBusinessName = localStorage.getItem('nubarber_business_name');
    
    if (storedLogo) {
      setLogoUrl(storedLogo);
    }
    
    if (storedBusinessName) {
      setBusinessName(storedBusinessName);
    }
  }, []);

  // Mock business data - in production this would come from your database
  const businessData = {
    name: businessName,
    slug: params.slug,
    logo: logoUrl,
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

  // Generate calendar data for the next 30 days with realistic barber availability
  const generateCalendarData = () => {
    const today = new Date();
    const calendarData = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Get day of week (0 = Sunday, 6 = Saturday)
      const dayOfWeek = date.getDay();
      
      // Base availability patterns for barbershops
      let baseCapacity = 0;
      let isClosed = false;
      
      if (dayOfWeek === 0) { // Sunday
        baseCapacity = 0;
        isClosed = true;
      } else if (dayOfWeek === 6) { // Saturday
        baseCapacity = 45;
      } else if (dayOfWeek === 5) { // Friday
        baseCapacity = 75;
      } else { // Weekdays
        baseCapacity = 85;
      }
      
      // Add some variation based on day of month
      const dayOfMonth = date.getDate();
      let timeVariation = 0;
      if (dayOfMonth <= 5) { // Beginning of month
        timeVariation = 15;
      } else if (dayOfMonth <= 20) { // Middle of month
        timeVariation = 0;
      } else { // End of month
        timeVariation = -10;
      }
      
      // Add random variation for realism
      const randomVariation = (Math.random() - 0.5) * 20;
      let capacity = Math.max(0, Math.min(100, baseCapacity + timeVariation + randomVariation));
      
      if (isClosed) {
        capacity = 0;
      }
      
      // Determine color and status based on capacity
      let colorClass = '';
      let status = '';
      
      if (capacity === 0) {
        colorClass = 'bg-gray-300 text-gray-600';
        status = 'Closed';
      } else if (capacity < 20) {
        colorClass = 'bg-red-600 text-white shadow-lg';
        status = 'Very Limited';
      } else if (capacity < 40) {
        colorClass = 'bg-red-500 text-white shadow-md';
        status = 'Limited';
      } else if (capacity < 60) {
        colorClass = 'bg-orange-500 text-white shadow-md';
        status = 'Moderate';
      } else if (capacity < 80) {
        colorClass = 'bg-green-400 text-black shadow-sm';
        status = 'Good';
      } else {
        colorClass = 'bg-green-500 text-white shadow-sm';
        status = 'Wide Open';
      }
      
      calendarData.push({
        date,
        capacity: Math.round(capacity),
        colorClass,
        status,
        isToday: i === 0,
        isClosed
      });
    }
    
    return calendarData;
  };

  const calendarData = generateCalendarData();

  // Get next available time slots
  const getNextAvailableSlots = () => {
    const slots = [];
    const now = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      
      if (date.getDay() !== 0) { // Not Sunday
        const dayData = calendarData.find(day => 
          day.date.toDateString() === date.toDateString()
        );
        
        if (dayData && dayData.capacity > 0) {
          slots.push({
            date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
            capacity: dayData.capacity,
            status: dayData.status
          });
        }
      }
    }
    
    return slots.slice(0, 3); // Return top 3 available slots
  };

  const nextAvailableSlots = getNextAvailableSlots();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerEmail) {
      alert("Please fill in all required fields");
      return;
    }
    
    setIsBooking(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false);
      alert("Booking submitted successfully! We'll confirm your appointment shortly.");
      
      // Reset form
      setSelectedService("");
      setSelectedDate(null);
      setSelectedTime("");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={`${businessName} Logo`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-black text-2xl font-bold">H</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{businessName}</h1>
                <p className="text-gray-300">Professional Barber Services</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold">4.9 (127 reviews)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">Book Your Next Appointment</h2>
          <p className="text-lg text-gray-600">Professional barber services with easy online booking. Available 24/7 for your convenience.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Services */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-black mb-6">Our Services</h3>
              <div className="space-y-4">
                {businessData.services.map((service) => (
                  <div key={service.id} className="bg-black text-white p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{service.name}</h4>
                      <span className="text-2xl font-bold">${service.price}</span>
                    </div>
                    <p className="text-gray-300 mb-2">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{service.duration}</span>
                      <span className="bg-white text-black px-2 py-1 rounded text-xs font-semibold">
                        {service.name.includes('Hair') ? 'Hair' : 
                         service.name.includes('Beard') ? 'Beard' : 
                         service.name.includes('Shave') ? 'Shave' : 'Style'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="space-y-6">
            {/* Heat Map Calendar */}
            <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-black mb-4">Availability Calendar</h3>
              <p className="text-gray-600 mb-4">Select a date to see available times</p>
              
              {/* Heat Map Calendar */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {calendarData.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg text-xs font-medium flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 ${
                      day.isToday ? 'ring-2 ring-black ring-offset-2' : ''
                    } ${day.colorClass}`}
                    title={`${day.date.toLocaleDateString()}: ${day.status} - ${day.capacity}% available`}
                    onClick={() => handleDateSelect(day.date)}
                  >
                    <div className="text-xs font-bold mb-1">
                      {day.isToday ? 'TODAY' : day.date.getDate()}
                    </div>
                    <div className="text-xs opacity-80">
                      {day.capacity}%
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Premium Legend */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-xs text-black">Wide Open</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span className="text-xs text-black">Good</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-xs text-black">Moderate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-xs text-black">Limited</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span className="text-xs text-black">Closed</span>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm text-black">
                  <strong>Next Available:</strong> {nextAvailableSlots[0]?.date} ({nextAvailableSlots[0]?.status})
                </p>
              </div>
            </div>

            {/* Next Available Slots */}
            <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-black mb-4">Next Available Slots</h3>
              <div className="space-y-3">
                {nextAvailableSlots.map((slot, index) => (
                  <div key={index} className="bg-black text-white p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{slot.date}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        slot.capacity < 20 ? 'bg-red-600' :
                        slot.capacity < 40 ? 'bg-red-500' :
                        slot.capacity < 60 ? 'bg-orange-500' :
                        slot.capacity < 80 ? 'bg-green-400' : 'bg-green-500'
                      }`}>
                        {slot.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-black mb-4">Book Appointment</h3>
              <p className="text-gray-600 mb-6">Select a service and time that works for you.</p>
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <Label htmlFor="service" className="text-black font-semibold">Select Service</Label>
                  <select
                    id="service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                    required
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
                  <Label htmlFor="date" className="text-black font-semibold">Select Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                    className="w-full p-3 border-2 border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  {selectedDate && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="time" className="text-black font-semibold">Select Time</Label>
                  <select
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                    required
                    disabled={!selectedDate}
                  >
                    <option value="">Choose a time...</option>
                    {selectedDate && (
                      <>
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
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <Label htmlFor="name" className="text-black font-semibold">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-black font-semibold">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-black font-semibold">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isBooking}
                  className="w-full bg-black text-white hover:bg-gray-800 py-3 text-lg font-semibold border-2 border-black rounded-lg transition-colors duration-200"
                >
                  {isBooking ? "Booking..." : "Book Appointment"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-white border-2 border-black rounded-lg p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-black mb-4">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-black" />
              <span className="text-black">{businessData.address}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-black" />
              <span className="text-black">{businessData.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-black" />
              <span className="text-black">{businessData.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-black" />
              <span className="text-black">Mon-Fri: 9AM-7PM, Sat: 9AM-5PM</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 