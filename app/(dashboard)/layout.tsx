"use client"

import type React from "react"

import { Suspense } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Home, TrendingUp, Heart, Settings, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { toggleDarkMode } from "@/lib/slices/preferencesSlice"
import { usePathname } from "next/navigation" // Client component hook
import SearchInput from "@/components/dashboard/SearchInput" // Client component
import { useSearchParams } from "next/navigation"

const navItems = [
  { title: "Personalized Feed", href: "/", icon: Home },
  { title: "Trending", href: "/trending", icon: TrendingUp },
  { title: "Favorites", href: "/favorites", icon: Heart },
  { title: "Settings", href: "/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const darkMode = useSelector((state: RootState) => state.preferences.darkMode)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode())
  }

  // Placeholder for search functionality in header. The actual search logic is in page components.
  const handleHeaderSearch = (query: string) => {
    console.log("Header search query:", query)
    // In a real app, you might navigate to a search results page or update a global search state.
  }

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Explicitly set variant and collapsible for clarity */}
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="flex items-center justify-between p-2">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="sr-only">Dashboard</span>
            <Home className="h-6 w-6" />
            <span className="group-data-[state=collapsed]:hidden">Dashboard</span>
          </Link>
          <SidebarTrigger className="group-data-[state=collapsed]:hidden" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[state=collapsed]:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleToggleDarkMode}>
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="group-data-[state=collapsed]:hidden">{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="group-data-[state=collapsed]:hidden">John Doe</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {/* Added shadow to header for more advanced UI feel */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 shadow-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* SidebarTrigger visible on small screens */}
          <SidebarTrigger className="sm:hidden" />
          <div className="relative ml-auto flex-1 md:grow-0">
            <SearchInput onSearch={handleHeaderSearch} />
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Suspense>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
