"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ChevronRight, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NotificationBell } from "@/components/shared/NotificationBell"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"
import { signOut } from "@/app/actions/auth"

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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-8">
      {/* Mobile Toggle & Logo */}
      <div className="flex items-center gap-4 md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5 text-muted-foreground" />
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
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg">
            M
          </div>
        </Link>
      </div>

      {/* Desktop Breadcrumbs */}
      <div className="hidden md:flex items-center gap-2">
        <nav className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
           {breadcrumbs.map((label, i) => (
             <React.Fragment key={i}>
                <span className={cn(
                  "transition-colors hover:text-foreground capitalize font-bold",
                  i === breadcrumbs.length - 1 && "text-foreground"
                )}>
                  {label}
                </span>
                {i < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
             </React.Fragment>
           ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <ThemeToggle />
        <NotificationBell notifications={notifications} />

        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-xs font-black text-foreground leading-none">{user.full_name}</p>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 opacity-70">
              {user.role}
            </p>
          </div>
          <Link href={`/${user.role}/profile`}>
            <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-2 ring-gray-100 hover:ring-primary/20 transition-all">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black">
                {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <button
            onClick={() => signOut()}
            className="ml-2 p-2 rounded-xl bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
            title="Esci"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
