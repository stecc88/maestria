"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  PenLine,
  FileText,
  BookOpen,
  ClipboardList,
  Trophy,
  Settings,
  LogOut,
  ChevronRight,
  Users,
  CheckCircle2,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { signOut } from "@/app/actions/auth"

interface SidebarProps {
  user: {
    full_name: string
    avatar_url?: string
    role: string
  }
  studentData?: {
    current_level: string
    xp_points: number
    target_xp: number
    next_level_name: string
    pending_tasks: number
  }
  isMobile?: boolean
  onClose?: () => void
  teacherData?: {
    teacher_code: string
  }
}

const studentNavItems = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "Scrittura", href: "/student/write", icon: PenLine },
  { label: "Correzioni", href: "/student/corrections", icon: FileText },
  { label: "Guide", href: "/student/guides", icon: BookOpen },
  { label: "Compiti", href: "/student/tasks", icon: ClipboardList, badge: true },
  { label: "Classifica", href: "/student/ranking", icon: Trophy },
]

const teacherNavItems = [
  { label: "Pannello", href: "/teacher", icon: LayoutDashboard },
  { label: "Studenti", href: "/teacher/students", icon: Users },
  { label: "Compiti", href: "/teacher/tasks", icon: ClipboardList },
  { label: "Notifiche", href: "/teacher/notifications", icon: Sparkles },
]

const adminNavItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Approvazioni", href: "/admin/approvals", icon: CheckCircle2 },
  { label: "Utenti", href: "/admin/users", icon: Users },
]

export function Sidebar({ user, studentData, isMobile, onClose, teacherData }: SidebarProps) {
  const pathname = usePathname()
  const xpPercentage = studentData ? (studentData.xp_points / studentData.target_xp) * 100 : 0

  let navItems = studentNavItems
  if (user.role === 'teacher') navItems = teacherNavItems as any
  else if (user.role === 'admin') navItems = adminNavItems as any

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-[1px_0_0_0_rgba(0,0,0,0.02)]">
      {/* Brand Logo */}
      <div className="h-16 px-6 flex items-center shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
            M
          </div>
          <span className="text-xl font-display font-bold text-gray-900 tracking-tight">
            Maestria
          </span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        {/* Nav Group: Main */}
        <div className="space-y-1 mb-6">
          <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary/5 text-primary"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-2.5 relative z-10">
                  <item.icon className={cn("h-4.5 w-4.5 transition-colors", isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600")} />
                  <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                </div>

                {item.badge && studentData && studentData.pending_tasks > 0 && (
                  <div className="h-5 min-w-[20px] bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                    {studentData.pending_tasks}
                  </div>
                )}

                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Account Settings for mobile if needed or just space */}
        <div className="space-y-1">
          <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Account</p>
          <Link
             href={`/${user.role}/profile`}
             onClick={isMobile ? onClose : undefined}
             className={cn(
               "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-900",
               pathname.includes('/profile') && "bg-primary/5 text-primary"
             )}
          >
            <Settings className="h-4.5 w-4.5" />
            <span className="text-sm font-semibold tracking-tight">Profilo</span>
          </Link>
        </div>
      </ScrollArea>

      {/* User Footer Card */}
      <div className="p-3 mt-auto border-t border-gray-100 bg-gray-50/50">
        {user.role === 'student' && studentData && (
           <div className="mb-4 px-2 pt-1">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Livello {studentData.current_level}</span>
                <span className="text-[10px] font-bold text-primary">{studentData.xp_points} / {studentData.target_xp} XP</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  className="h-full bg-primary"
                />
              </div>
           </div>
        )}

        {user.role === 'teacher' && teacherData && (
          <div className="mb-4 px-3 py-2 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest mb-0.5">Codice docente</p>
            <p className="text-sm font-display font-bold text-primary tracking-tight">{teacherData.teacher_code}</p>
          </div>
        )}

        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-white">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-primary text-white text-xs font-bold">
                  {user.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate tracking-tight">{user.full_name}</p>
                <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 text-gray-400 hover:text-secondary transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
        </div>
      </div>
    </div>
  )
}
