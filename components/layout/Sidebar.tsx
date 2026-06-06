"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  PenLine,
  FileText,
  BookOpen,
  ClipboardList,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Users,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  { label: "Progressi", href: "/student", icon: LayoutDashboard },
  { label: "Invia testo", href: "/student/write", icon: PenLine },
  { label: "Correzioni", href: "/student/corrections", icon: FileText },
  { label: "Guide alla scrittura", href: "/student/guides", icon: BookOpen },
  { label: "Compiti", href: "/student/tasks", icon: ClipboardList, badge: true },
  { label: "Classifica", href: "/student/ranking", icon: Trophy },
  { label: "Profilo", href: "/student/profile", icon: Settings },
]

const teacherNavItems = [
  { label: "Pannello", href: "/teacher", icon: LayoutDashboard },
  { label: "Studenti", href: "/teacher/students", icon: Trophy },
  { label: "Compiti generati", href: "/teacher/tasks", icon: ClipboardList },
  { label: "Notifiche", href: "/teacher/notifications", icon: LayoutDashboard },
  { label: "Profilo", href: "/teacher/profile", icon: Settings },
] as const

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Approvazioni", href: "/admin/approvals", icon: CheckCircle2 },
  { label: "Utenti", href: "/admin/users", icon: Users },
] as const

type NavItem = {
  label: string
  href: string
  icon: typeof LayoutDashboard
  badge?: boolean
}

export function Sidebar({ user, studentData, isMobile, onClose, teacherData }: SidebarProps) {
  const pathname = usePathname()

  const xpPercentage = studentData ? (studentData.xp_points / studentData.target_xp) * 100 : 0

  let navItems: readonly NavItem[] = studentNavItems
  if (user.role === 'teacher') navItems = teacherNavItems
  else if (user.role === 'admin') navItems = adminNavItems

  const NavContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">
            M
          </div>
          <span className="text-xl font-display font-bold text-gray-900 tracking-tight">
            Maestria<span className="text-primary">✦</span>
          </span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-4">
        {/* User Profile Summary */}
        <div className="mb-8 p-4 bg-cream rounded-2xl border border-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-primary text-white text-lg">
                {user.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate">{user.full_name}</p>
              {user.role === 'student' ? (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-2 py-0">
                  {studentData?.current_level || 'A1'}
                </Badge>
              ) : user.role === 'teacher' ? (
                <Badge variant="outline" className="border-primary text-primary text-[10px] uppercase font-bold px-2 py-0">
                  Insegnante
                </Badge>
              ) : (
                <Badge variant="outline" className="border-secondary text-secondary text-[10px] uppercase font-bold px-2 py-0">
                  Admin
                </Badge>
              )}
            </div>
          </div>

          {/* Role-specific summary info */}
          {user.role === 'student' ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-500">XP: {studentData?.xp_points || 0} / {studentData?.target_xp || 1000}</span>
                <span className="text-primary">{studentData?.next_level_name || 'Praticante'}</span>
              </div>
              <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-dark"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Codice docente</p>
              <p className="text-lg font-display font-bold text-primary">{teacherData?.teacher_code || '---'}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-600 hover:bg-primary/5 hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400 group-hover:text-primary")} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && studentData && studentData.pending_tasks > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-[20px] flex items-center justify-center p-0 text-[10px] rounded-full">
                    {studentData.pending_tasks}
                  </Badge>
                )}
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="p-4 mt-auto border-t border-gray-100">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-secondary hover:bg-secondary/5 rounded-xl transition-colors font-medium"
        >
          <LogOut className="h-5 w-5" />
          <span>Disconnetti</span>
        </button>
      </div>
    </div>
  )

  return NavContent
}
