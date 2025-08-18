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
