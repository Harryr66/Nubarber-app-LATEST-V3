"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import type { StaffMember } from "@/lib/types";
import { CalendarDays, MoreHorizontal } from "lucide-react";
import { AddStaffDialog } from "@/components/add-staff-dialog";

export const dynamic = "force-dynamic";

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/data?type=staff")
      .then(res => res.json())
      .then(data => {
        setStaff(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching staff:", error);
        setIsLoading(false);
      });
  }, []);

  const handleStaffAdded = (newStaff: StaffMember) => {
    setStaff(prev => [newStaff, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline">Staff</h1>
          <AddStaffDialog onStaffAdded={handleStaffAdded} />
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Staff</h1>
        <AddStaffDialog onStaffAdded={handleStaffAdded} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Team</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={staffMember.avatarUrl}
                          alt={staffMember.name}
                          data-ai-hint="barber portrait"
                        />
                        <AvatarFallback>{staffMember.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{staffMember.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{staffMember.availability}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Manage
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
