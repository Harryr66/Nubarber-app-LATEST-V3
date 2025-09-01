"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  User, 
  Mail, 
  Calendar, 
  DollarSign, 
  Eye,
  Users,
  TrendingUp
} from "lucide-react";

interface Customer {
  id: string;
  email: string;
  createdAt: any;
  isActive: boolean;
  lastLogin: any;
}

interface CustomerDetails {
  id: string;
  email: string;
  createdAt: any;
  isActive: boolean;
  lastLogin: any;
  totalBookings: number;
  totalSpent: number;
  bookings: Array<{
    id: string;
    serviceName: string;
    barberName: string;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
    createdAt: any;
  }>;
}

export default function ClientsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch customers from API
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/barber/customers');
      
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers);
        setFilteredCustomers(data.customers);
      } else {
        console.error('Failed to fetch customers');
        setCustomers([]);
        setFilteredCustomers([]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customerId: string) => {
    try {
      const response = await fetch(`/api/barber/customers/${customerId}`);
      
      if (response.ok) {
        const data = await response.json();
        setSelectedCustomer(data.customer);
        setShowCustomerModal(true);
      } else {
        console.error('Failed to fetch customer details');
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  // Filter customers based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const formatDate = (date: any) => {
    if (!date) return "Never";
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
        <p className="text-gray-300">Manage your customer relationships and view booking history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => {
                    const created = c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search clients by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{customer.email}</CardTitle>
                    <CardDescription className="text-sm">
                      Client since {formatDate(customer.createdAt)}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={customer.isActive ? "default" : "secondary"}>
                  {customer.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Last login: {formatDate(customer.lastLogin)}</span>
                </div>
              </div>
              <Button
                onClick={() => fetchCustomerDetails(customer.id)}
                className="w-full mt-4"
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Client Details</h3>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                </div>
                <Button
                  onClick={() => setShowCustomerModal(false)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Client Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium">{formatDate(selectedCustomer.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={selectedCustomer.isActive ? "default" : "secondary"}>
                        {selectedCustomer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Login:</span>
                      <span className="font-medium">{formatDate(selectedCustomer.lastLogin)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Bookings:</span>
                      <span className="font-medium">{selectedCustomer.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-medium">${selectedCustomer.totalSpent}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking History</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCustomer.bookings.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCustomer.bookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium">{booking.serviceName}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">{booking.barberName}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">{booking.appointmentDate} at {booking.appointmentTime}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              Booked on {formatDate(booking.createdAt)}
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No bookings yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-white mb-2">No clients found</h3>
          <p className="text-gray-300">
            {searchTerm ? "Try adjusting your search terms" : "Clients will appear here once they create accounts"}
          </p>
        </div>
      )}
    </div>
  );
}
