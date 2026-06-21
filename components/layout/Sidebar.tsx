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
  GraduationCap,
  Trophy,
  Settings,
  LogOut,
  Users,
  CheckCircle2,
  Sparkles,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  { label: "Esercizi CILS", href: "/student/exercises", icon: GraduationCap },
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
  { label: "Console", href: "/admin", icon: LayoutDashboard },
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
    <div className="flex flex-col h-full bg-card border-r border-border shadow-[1px_0_0_0_rgba(0,0,0,0.01)] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

      {/* Brand Logo */}
      <div className="h-20 px-8 flex items-center shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
            M
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground">
            Maestria
          </span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        {/* Nav Group: Main */}
        <div className="space-y-1.5 mb-10">
          <p className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Navigazione</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                  isActive
                    ? "bg-gray-900 text-white shadow-xl shadow-gray-200"
                    : "text-gray-500 hover:bg-primary/5 hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <item.icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-primary" : "text-gray-400 group-hover:text-primary")} />
                  <span className="text-sm font-black tracking-tight uppercase text-[11px]">{item.label}</span>
                </div>

                {item.badge && studentData && studentData.pending_tasks > 0 && (
                  <div className={cn(
                    "h-5 min-w-[20px] rounded-lg flex items-center justify-center px-1.5 text-[10px] font-black border-2 transition-colors",
                    isActive ? "bg-primary text-white border-gray-900" : "bg-secondary text-white border-white"
                  )}>
                    {studentData.pending_tasks}
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        {/* Account Group */}
        <div className="space-y-1.5">
          <p className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Account</p>
          <Link
             href={`/${user.role}/profile`}
             onClick={isMobile ? onClose : undefined}
             className={cn(
               "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 uppercase text-[11px] font-black",
               pathname.includes('/profile')
                ? "bg-gray-900 text-white shadow-xl shadow-gray-200"
                : "text-gray-500 hover:bg-primary/5 hover:text-primary"
             )}
          >
            <Settings className={cn("h-5 w-5 transition-transform group-hover:rotate-45", pathname.includes('/profile') ? "text-primary" : "text-gray-400")} />
            <span>Profilo</span>
          </Link>
        </div>
      </ScrollArea>

      {/* Footer Card */}
      <div className="p-4 mt-auto border-t border-border bg-muted/50 space-y-4">
        {user.role === 'student' && studentData && (
           <div className="bg-card p-4 rounded-2xl shadow-sm border border-border">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-1.5">
                   <Zap className="h-3 w-3 text-accent fill-accent" />
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">LIVELLO {studentData.current_level}</span>
                </div>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{studentData.xp_points} XP</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
           </div>
        )}

        {user.role === 'teacher' && teacherData && (
          <div className="p-4 bg-gray-900 rounded-2xl shadow-lg border border-white/5 group">
            <div className="flex items-center gap-2 mb-1.5">
               <Users className="h-3 w-3 text-primary" />
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Codice Classe</p>
            </div>
            <p className="text-lg font-black text-white tracking-[0.2em] font-display group-hover:text-primary transition-colors">{teacherData.teacher_code}</p>
          </div>
        )}

        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="relative group/avatar">
                <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-2 ring-gray-100 group-hover/avatar:ring-primary/20 transition-all">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">
                    {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-xs font-black text-foreground truncate tracking-tight">{user.full_name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-70">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2.5 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300 active:scale-90"
              title="Esci"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
        </div>
      </div>
    </div>
  )
}
