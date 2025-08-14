import type { Appointment, Client, StaffMember, Service } from './types';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function getAppointments() {
  const snapshot = await getDocs(collection(db, "appointments"));
  return snapshot.docs.map(doc => doc.data());
}

export const mockClients: Client[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', lastAppointment: new Date('2024-05-15'), preferences: 'Likes a fade on the sides, but keep the top longer. Prefers using American Crew products.', pastServices: ['Classic Haircut', 'Beard Trim'] },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '234-567-8901', lastAppointment: new Date('2024-05-20'), preferences: 'Sensitive scalp, prefers gentle products. Likes a clean and sharp beard line.', pastServices: ['Beard Trim'] },
  { id: '3', name: 'Mike Williams', email: 'mike.williams@example.com', phone: '345-678-9012', lastAppointment: new Date('2024-05-01'), preferences: 'Enjoys the hot towel treatment and a very close shave.', pastServices: ['Hot Towel Shave'] },
  { id: '4', name: 'Sarah Brown', email: 'sarah.brown@example.com', phone: '456-789-0123', lastAppointment: new Date('2024-04-28'), preferences: 'Looking for low-maintenance styles. Interested in subtle color changes.', pastServices: ['Coloring', 'Classic Haircut'] },
];

export const mockStaff: StaffMember[] = [
  { id: '1', name: 'Alex Johnson', specialty: 'Fades & Classic Cuts', availability: 'Mon-Fri, 9am-5pm', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '2', name: 'Maria Garcia', specialty: 'Beard Sculpting & Styling', availability: 'Tue-Sat, 10am-6pm', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '3', name: 'Chloe Davis', specialty: 'Color & Modern Styles', availability: 'Wed-Sun, 11am-7pm', avatarUrl: 'https://placehold.co/100x100.png' },
];

export const mockServices: Service[] = [
  { id: '1', name: 'Classic Haircut', duration: 30, price: 35, description: 'A timeless haircut tailored to your preferences.' },
  { id: '2', name: 'Beard Trim', duration: 20, price: 20, description: 'Shape and clean up your beard to perfection.' },
  { id: '3', name: 'Hot Towel Shave', duration: 45, price: 45, description: 'A luxurious and close shave with hot towels and premium products.' },
  { id: '4', name: 'Coloring', duration: 60, price: 75, description: 'From subtle changes to bold new looks.' },
  { id: '5', name: 'Kids Cut', duration: 25, price: 25, description: 'A patient and fun haircut experience for the little ones.' },
  { id: '6', name: 'Haircut & Beard Trim Combo', duration: 50, price: 50, description: 'The complete package for a sharp look.' },
];
