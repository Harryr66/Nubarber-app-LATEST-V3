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
  const [selectedService, setSelectedService] = useState("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [businessName, setBusinessName] = useState("Harrys Barbers");
  const [selectedBarber, setSelectedBarber] = useState("");
  const [tempCustomerEmail, setTempCustomerEmail] = useState("");
  const [tempCustomerPassword, setTempCustomerPassword] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showCustomerAuth, setShowCustomerAuth] = useState(false);
  const [customerAccount, setCustomerAccount] = useState<any>(null);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerBookings, setCustomerBookings] = useState<any[]>([]);

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
      { id: "barber1", name: "Mike Johnson" },
      { id: "barber2", name: "David Smith" },
      { id: "barber3", name: "Chris Wilson" }
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

  // Generate calendar data for the next 30 days with stable, professional availability
  const generateCalendarData = () => {
    const today = new Date();
    const calendarData = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Get day of week (0 = Sunday, 6 = Saturday)
      const dayOfWeek = date.getDay();
      
      // Professional business hours and availability patterns
      let baseCapacity = 0;
      let isClosed = false;
      
      if (dayOfWeek === 0) { // Sunday - Closed
        baseCapacity = 0;
        isClosed = true;
      } else if (dayOfWeek === 6) { // Saturday - Limited hours
        baseCapacity = 50;
      } else if (dayOfWeek === 5) { // Friday - Busy day
        baseCapacity = 70;
      } else { // Weekdays - Full availability
        baseCapacity = 85;
      }
      
      // Consistent availability based on business patterns (no random variation)
      let capacity = baseCapacity;
      
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
        status = 'Fully Booked';
      } else if (capacity < 40) {
        colorClass = 'bg-red-500 text-white shadow-md';
        status = 'Limited Availability';
      } else if (capacity < 60) {
        colorClass = 'bg-orange-500 text-white shadow-md';
        status = 'Moderate Availability';
      } else if (capacity < 80) {
        colorClass = 'bg-green-400 text-black shadow-sm';
        status = 'Good Availability';
      } else {
        colorClass = 'bg-green-500 text-white shadow-sm';
        status = 'Excellent Availability';
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

  // Get available time slots for selected date and barber - NOW CORRELATES WITH CALENDAR COLORS
  const getAvailableTimeSlots = (date: Date, barberId: string) => {
    if (!date || !barberId || date.getDay() === 0) return []; // Sunday closed or no barber selected
    
    // Find the calendar day data to get the actual capacity
    const dayData = calendarData.find(day => 
      day.date.toDateString() === date.toDateString()
    );
    
    if (!dayData || dayData.isClosed) return [];
    
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 19; // 7 PM
    
    // Simulate different availability patterns for different barbers
    const barberAvailability = {
      'barber1': { start: 9, end: 17, busyHours: [12, 13] }, // Mike: 9AM-5PM, busy at lunch
      'barber2': { start: 10, end: 18, busyHours: [14, 15] }, // David: 10AM-6PM, busy mid-afternoon
      'barber3': { start: 8, end: 16, busyHours: [10, 11] }  // Chris: 8AM-4PM, busy mid-morning
    };
    
    const barber = barberAvailability[barberId as keyof typeof barberAvailability];
    if (!barber) return [];
    
    // Calculate how many slots should be available based on calendar capacity
    const totalPossibleSlots = barber.end - barber.start;
    const availableSlotsCount = Math.round((dayData.capacity / 100) * totalPossibleSlots);
    
    // Generate slots based on actual calendar availability
    let slotsGenerated = 0;
    for (let hour = barber.start; hour < barber.end && slotsGenerated < availableSlotsCount; hour++) {
      // Check if this hour is busy for this barber
      const isBusy = barber.busyHours.includes(hour);
      
      if (!isBusy) {
        slots.push({
          time: `${hour}:00`,
          displayTime: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
          available: true,
          barberId: barberId
        });
        slotsGenerated++;
      }
    }
    
    return slots;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleBarberSelect = (barberId: string) => {
    setSelectedBarber(barberId);
    setSelectedDate(null); // Reset date when barber changes
    setSelectedTime(""); // Reset time when barber changes
  };

  const availableTimeSlots = selectedDate && selectedBarber ? getAvailableTimeSlots(selectedDate, selectedBarber) : [];

  // Customer authentication functions
  const handleCustomerLogin = async (email: string, password: string) => {
    // Validate required fields
    if (!email.trim() || !password.trim()) {
      alert('Please fill in both Email and Password');
      return;
    }

    try {
      const response = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const customerData = await response.json();
        setCustomerAccount(customerData.customer);
        setIsCustomerLoggedIn(true);
        setShowCustomerAuth(false);
        
        // Load customer's bookings
        await loadCustomerBookings(customerData.customer.id);
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleCustomerRegistration = async (email: string, password: string) => {
    // Validate required fields
    if (!email.trim() || !password.trim()) {
      alert('Please fill in both Email and Password');
      return;
    }

    try {
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const customerData = await response.json();
        setCustomerAccount(customerData.customer);
        setIsCustomerLoggedIn(true);
        setShowCustomerAuth(false);
        
        // Load customer's bookings
        await loadCustomerBookings(customerData.customer.id);
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const loadCustomerBookings = async (customerId: string) => {
    try {
      const response = await fetch(`/api/customer/${customerId}/bookings`);
      
      if (response.ok) {
        const data = await response.json();
        setCustomerBookings(data.bookings);
      } else {
        const errorData = await response.json();
        console.error('Failed to load bookings:', errorData.error);
        setCustomerBookings([]);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      setCustomerBookings([]);
    }
  };

  const cancelBooking = async (bookingId: string, appointmentDate: string) => {
    try {
      const response = await fetch(`/api/customer/bookings/${bookingId}/cancel`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Remove booking from local state
        setCustomerBookings(prev => prev.filter(booking => booking.id !== bookingId));
        alert('Booking cancelled successfully.');
      } else {
        const errorData = await response.json();
        alert(`Failed to cancel booking: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const createBooking = async () => {
    try {
      const appointmentDateTime = new Date(selectedDate!);
      const [hours, minutes] = selectedTime!.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const bookingData = {
        customerId: customerAccount.id,
        customerEmail: customerAccount.email,
        serviceId: selectedService,
        serviceName: businessData.services.find(s => s.id === selectedService)?.name,
        barberId: selectedBarber,
        barberName: businessData.barbers.find(b => b.id === selectedBarber)?.name,
        appointmentDate: selectedDate?.toLocaleDateString(),
        appointmentTime: availableTimeSlots.find(slot => slot.time === selectedTime)?.displayTime,
        appointmentDateTime: appointmentDateTime.toISOString()
      };

      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add new booking to local state
        setCustomerBookings(prev => [data.booking, ...prev]);
        setShowCustomerAuth(false);
        setBookingSuccess(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setBookingSuccess(false);
          setSelectedService("");
          setSelectedDate(null);
          setSelectedTime("");
          setSelectedBarber("");
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(`Failed to create booking: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Services */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-black mb-6">Our Services</h3>
              <div className="space-y-4">
                {businessData.services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedService === service.id
                        ? 'border-black bg-black text-white'
                        : 'border-black bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{service.name}</h4>
                      <span className="text-2xl font-bold">${service.price}</span>
                    </div>
                    <p className={`mb-2 ${selectedService === service.id ? 'text-gray-300' : 'text-gray-600'}`}>
                      {service.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${selectedService === service.id ? 'text-gray-400' : 'text-gray-500'}`}>
                        {service.duration}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Integrated Calendar & Booking */}
          <div className="space-y-6">
            {/* Integrated Calendar & Booking Section */}
            <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-black mb-4">Book Your Appointment</h3>
              <p className="text-gray-600 mb-6">Select your barber, date, and time to book</p>
              
              {/* Barber Selection */}
              <div className="mb-6">
                <Label className="text-sm font-semibold text-black mb-3 block">1. Select Your Barber</Label>
                <div className="grid grid-cols-3 gap-3">
                  {businessData.barbers.map((barber) => (
                    <button
                      key={barber.id}
                      onClick={() => handleBarberSelect(barber.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedBarber === barber.id
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 bg-white text-black hover:border-black'
                      }`}
                    >
                      <div className="text-sm font-semibold">{barber.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Calendar Section */}
              {selectedBarber && (
                <div className="mb-6">
                  <Label className="text-sm font-semibold text-black mb-3 block">2. Select Date</Label>
                  <div className="grid grid-cols-7 gap-1 mb-4">
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
                  
                  {/* Calendar Legend */}
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-xs text-black">Excellent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded"></div>
                      <span className="text-xs text-black">Good</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span className="text-xs text-black">Moderate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-xs text-black">Limited</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-300 rounded"></div>
                      <span className="text-xs text-black">Closed</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Time Slots Section */}
              {selectedDate && selectedBarber && availableTimeSlots.length > 0 && (
                <div className="mb-6">
                  <Label className="text-sm font-semibold text-black mb-3 block">3. Select Time</Label>
                  <div className="grid grid-cols-4 gap-2">
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
              
              {/* Service Selection */}
              {selectedTime && (
                <div className="mb-6">
                  <Label className="text-sm font-semibold text-black mb-3 block">4. Selected Service</Label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Service:</p>
                    <p className="font-semibold text-black">
                      {businessData.services.find(s => s.id === selectedService)?.name} - ${businessData.services.find(s => s.id === selectedService)?.price}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Next Button - Only show when all selections are made */}
              {selectedService && selectedTime && selectedBarber && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowCustomerAuth(true)}
                    className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    Continue to Booking
                  </button>
                </div>
              )}
              
              {/* No Availability Message */}
              {selectedDate && selectedBarber && availableTimeSlots.length === 0 && (
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No Available Times</h4>
                  <p className="text-gray-500 text-sm">
                    {businessData.barbers.find(b => b.id === selectedBarber)?.name} is not available on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}. 
                    Please select a different date or barber.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Customer Authentication Modal */}
      {showCustomerAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border-2 border-black">
            {/* Modal Header */}
            <div className="bg-black text-white p-4 rounded-t-lg">
              <h3 className="text-xl font-bold">Customer Account</h3>
              <p className="text-sm text-gray-300 mt-1">
                Sign in or create an account to complete your booking
              </p>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {!isCustomerLoggedIn ? (
                <>
                  {/* Login Form */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="auth-email" className="text-sm font-semibold text-black">Email Address</Label>
                      <Input
                        id="auth-email"
                        type="email"
                        value={tempCustomerEmail}
                        onChange={(e) => setTempCustomerEmail(e.target.value)}
                        className="w-full p-3 border-2 border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="auth-password" className="text-sm font-semibold text-black">Password</Label>
                      <Input
                        id="auth-password"
                        type="password"
                        value={tempCustomerPassword}
                        onChange={(e) => setTempCustomerPassword(e.target.value)}
                        className="w-full p-3 border-2 border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleCustomerLogin(tempCustomerEmail, tempCustomerPassword)}
                      className="flex-1 py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleCustomerRegistration(tempCustomerEmail, tempCustomerPassword)}
                      className="flex-1 py-2 px-4 border-2 border-black text-black rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Create Account
                    </button>
                  </div>
                </>
              ) : (
                /* Customer Dashboard */
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Welcome back,</p>
                    <p className="font-semibold text-black">{customerAccount?.name}</p>
                  </div>
                  
                  {/* Upcoming Bookings */}
                  <div>
                    <h4 className="font-semibold text-black mb-2">Upcoming Bookings</h4>
                    <div className="space-y-2">
                      {customerBookings.filter(booking => new Date(booking.date) > new Date()).map((booking) => (
                        <div key={booking.id} className="bg-white border border-gray-200 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-black">{booking.service}</p>
                              <p className="text-sm text-gray-600">{booking.barber} • {booking.date} • {booking.time}</p>
                            </div>
                            <button
                              onClick={() => cancelBooking(booking.id, booking.date)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Complete Current Booking */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={createBooking}
                      className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Complete Current Booking
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t border-gray-200">
              <button
                onClick={() => setShowCustomerAuth(false)}
                className="py-2 px-4 border-2 border-black text-black rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 