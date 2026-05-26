"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NotificationBell } from "@/components/shared/NotificationBell"
import { Sidebar } from "./Sidebar"

interface HeaderProps {
  user: {
    full_name: string
    avatar_url?: string
    role: string
  }
  studentData?: any
  teacherData?: any
  notifications?: any[]
}

export function Header({ user, studentData, teacherData, notifications }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 md:px-8">
      {/* Mobile Toggle & Logo */}
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-gray-600" />
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-[280px]">
            <Sidebar user={user} studentData={studentData} teacherData={teacherData} isMobile />
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-lg font-display font-bold text-gray-900">
            Maestria
          </span>
        </Link>
      </div>

      <div className="hidden md:block">
        {/* Placeholder for breadcrumbs or page title if needed */}
        <h2 className="text-sm font-medium text-gray-500">
          Dashboard / {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <NotificationBell notifications={notifications} />

        <div className="h-8 w-[1px] bg-gray-200 hidden md:block mx-1" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-none">{user.full_name}</p>
            <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
          </div>
          <Avatar className="h-9 w-9 border border-gray-200">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="bg-cream text-primary font-bold">
              {user.full_name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
