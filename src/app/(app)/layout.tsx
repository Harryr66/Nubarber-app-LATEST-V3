"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  Menu,
  Scissors,
  Settings,
  Users,
  Globe,
  Contact,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/logo";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/appointments", icon: CalendarDays, label: "Schedule" },
  { href: "/services", icon: Scissors, label: "Services" },
  { href: "/staff", icon: Users, label: "Staff" },
  { href: "/clients", icon: Contact, label: "Clients" },
  { href: "/public-site", icon: Globe, label: "Public Site" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href === "/dashboard" && pathname === "/")}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start gap-2 w-full px-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/images/default-avatar.png" alt="User" data-ai-hint="user avatar" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="truncate">Loading...</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:justify-end">
            <SidebarTrigger className="md:hidden">
              <Menu />
            </SidebarTrigger>
            <div className="hidden md:block">
              {/* Desktop header content can go here if needed */}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
