export type Appointment = {
  id: string;
  clientName: string;
  service: string;
  staff: string;
  startTime: Date;
  endTime: Date;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastAppointment: string;
  preferences: string;
  pastServices: string[];
};

export type StaffMember = {
  id: string;
  name: string;
  availability: string;
  avatarUrl: string;
};

export type Service = {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
  category: string;
};

export interface DepositSettings {
  enabled: boolean;
  type: 'percentage' | 'fixed';
  amount: number;
  refundPolicy: '24h' | '48h' | '72h' | 'no-refund';
  customerMessage: string;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingWithDeposit {
  id: string;
  customerId: string;
  serviceId: string;
  barberId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  depositAmount: number;
  depositPaid: boolean;
  depositRefunded: boolean;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepositPayment {
  id: string;
  bookingId: string;
  customerId: string;
  businessId: string;
  amount: number;
  stripePaymentIntentId: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  refundAmount?: number;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
