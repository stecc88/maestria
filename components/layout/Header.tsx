"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NotificationBell } from "@/components/shared/NotificationBell"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"

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
  const pathname = usePathname()

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      const labels: Record<string, string> = {
        student: "Dashboard",
        teacher: "Dashboard",
        admin: "Admin",
        write: "Scrittura",
        corrections: "Correzioni",
        guides: "Guide",
        tasks: "Compiti",
        ranking: "Classifica",
        profile: "Profilo",
        students: "Studenti",
        notifications: "Notifiche",
        approvals: "Approvazioni",
        users: "Utenti"
      }
      return labels[segment] || segment
    })

  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md px-4 md:px-8">
      {/* Mobile Toggle & Logo */}
      <div className="flex items-center gap-4 md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-[280px] border-none shadow-2xl">
            <Sidebar
              user={user}
              studentData={studentData}
              teacherData={teacherData}
              isMobile
              onClose={() => setIsSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-white font-bold shadow-sm">
            M
          </div>
        </Link>
      </div>

      {/* Desktop Breadcrumbs */}
      <div className="hidden md:flex items-center gap-2">
        <nav className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
           {breadcrumbs.map((label, i) => (
             <React.Fragment key={i}>
                <span className={cn(
                  "transition-colors hover:text-gray-900 capitalize",
                  i === breadcrumbs.length - 1 && "text-gray-900 font-bold"
                )}>
                  {label}
                </span>
                {i < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
             </React.Fragment>
           ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <NotificationBell notifications={notifications} />

        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-900 leading-none">{user.full_name}</p>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 opacity-70">
              {user.role}
            </p>
          </div>
          <Link href={`/${user.role}/profile`}>
            <Avatar className="h-8 w-8 border border-gray-100 ring-2 ring-white hover:ring-primary/10 transition-all">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-cream text-primary text-[10px] font-bold">
                {user.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
