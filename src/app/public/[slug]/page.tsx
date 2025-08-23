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
  const [selectedBarber, setSelectedBarber] = useState("");

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
    barbers: [
      { id: "barber1", name: "Mike Johnson", specialties: ["Haircuts", "Beard Trims"] },
      { id: "barber2", name: "David Smith", specialties: ["Full Service", "Styling"] },
      { id: "barber3", name: "Chris Wilson", specialties: ["Kids Cuts", "Haircuts"] }
    ],
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

  // Get available time slots for selected date
  const getAvailableTimeSlots = (date: Date) => {
    if (!date || date.getDay() === 0) return []; // Sunday closed
    
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 19; // 7 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      // Add some random availability for realism
      if (Math.random() > 0.3) { // 70% chance of availability
        slots.push({
          time: `${hour}:00`,
          displayTime: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
          available: true
        });
      }
    }
    
    return slots;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerEmail || !selectedBarber) {
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
      setSelectedBarber("");
    }, 2000);
  };

  const availableTimeSlots = selectedDate ? getAvailableTimeSlots(selectedDate) : [];

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
                  <div key={service.id} className="bg-white border-2 border-black text-black p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{service.name}</h4>
                      <span className="text-2xl font-bold">${service.price}</span>
                    </div>
                    <p className="text-gray-600 mb-2">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{service.duration}</span>
                      <span className="bg-black text-white px-2 py-1 rounded text-xs font-semibold">
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
                    <div className="text-xs font-bold">
                      {day.date.getDate()}
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
            </div>

            {/* Available Time Slots - Shows when date is selected */}
            {selectedDate && availableTimeSlots.length > 0 && (
              <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold text-black mb-4">
                  Available Times for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedTime === slot.time
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 bg-white text-black hover:border-black'
                      }`}
                    >
                      {slot.displayTime}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                  <Label htmlFor="time" className="text-black font-semibold">Selected Time</Label>
                  <Input
                    id="time"
                    type="text"
                    value={selectedTime ? availableTimeSlots.find(slot => slot.time === selectedTime)?.displayTime || selectedTime : ''}
                    readOnly
                    className="w-full p-3 border-2 border-black rounded-lg bg-gray-50 text-black"
                    placeholder="Select a time from the calendar above"
                  />
                  {!selectedTime && (
                    <p className="text-sm text-gray-500 mt-1">
                      Please select a date and time from the calendar above
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="barber" className="text-black font-semibold">Select Barber</Label>
                  <select
                    id="barber"
                    value={selectedBarber}
                    onChange={(e) => setSelectedBarber(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  >
                    <option value="">Choose a barber...</option>
                    {businessData.barbers.map((barber) => (
                      <option key={barber.id} value={barber.id}>
                        {barber.name} ({barber.specialties.join(', ')})
                      </option>
                    ))}
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