"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Mail, Phone, Calendar } from "lucide-react";
import type { Client } from "@/lib/types";
import { AddClientDialog } from "@/components/add-client-dialog";

export const dynamic = "force-dynamic";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch("/api/data?type=clients")
      .then(res => res.json())
      .then(data => setClients(data));
  }, []);

  const formatDate = (dateString: string) => {
    try {
      // Parse the date string and format it
      const date = parseISO(dateString);
      return format(date, "PPP");
    } catch (error) {
      // If date parsing fails, return the original string
      return dateString;
    }
  };

  const handleClientAdded = (newClient: Client) => {
    setClients(prev => [newClient, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Clients</h1>
        <AddClientDialog onClientAdded={handleClientAdded} />
      </div>
      <div className="space-y-4">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{client.name}</CardTitle>
                    <CardDescription>Client Profile</CardDescription>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Last visit: {formatDate(client.lastAppointment)}</span>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
