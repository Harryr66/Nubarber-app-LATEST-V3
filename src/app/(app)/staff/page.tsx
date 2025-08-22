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
import { TableSkeleton } from "@/components/ui/loading-skeleton";

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

  return (
    <div className="space-y-6 layout-stable">
      {/* Stable Header - Always rendered to prevent layout shifts */}
      <div className="flex items-center justify-between btn-container">
        <h1 className="text-3xl font-bold font-headline text-stable">Staff</h1>
        <AddStaffDialog onStaffAdded={handleStaffAdded} />
      </div>

      {/* Content Area - Stable structure */}
      <Card className="layout-stable">
        <CardHeader>
          <CardTitle className="text-stable">Your Team</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // Loading state with stable layout
            <TableSkeleton />
          ) : staff.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first team member.</p>
            </div>
          ) : (
            // Staff table
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
                        <div>
                          <div className="font-medium">{staffMember.name}</div>
                          <div className="text-sm text-gray-500">{staffMember.availability}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">{staffMember.availability}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Schedule</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
