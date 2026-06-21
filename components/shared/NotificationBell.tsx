"use client"

import * as React from "react"
import { Bell, BellOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { formatDate } from "@/lib/utils/date"

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  created_at?: string
}

interface NotificationBellProps {
  notifications?: Notification[]
}

export function NotificationBell({ notifications = [] }: NotificationBellProps) {
  const pathname = usePathname()
  const unreadCount = notifications.filter(n => !n.read).length

  // Determine notifications page based on path
  const isTeacher = pathname.startsWith('/teacher')
  const isStudent = pathname.startsWith('/student')
  const notificationsPath = isTeacher ? '/teacher/notifications' : (isStudent ? '/student/notifications' : '#')

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" className="relative group">
            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full border-2 border-white animate-in zoom-in"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        }
      />
      <PopoverContent align="end" className="w-80 p-0 rounded-2xl shadow-2xl border-border overflow-hidden">
        <PopoverHeader className="p-4 bg-gray-50/50 border-b border-border">
          <PopoverTitle className="text-sm font-bold flex items-center justify-between">
            Notifiche
            {unreadCount > 0 && (
              <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">
                {unreadCount} nuove
              </span>
            )}
          </PopoverTitle>
        </PopoverHeader>

        <ScrollArea className="h-[350px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-colors hover:bg-muted flex flex-col gap-1 ${!notification.read ? 'bg-primary/5' : ''}`}
                >
                  <p className="text-xs font-bold text-foreground">{notification.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{notification.message}</p>
                  {notification.created_at && (
                    <p className="text-[9px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter">
                      {formatDate(notification.created_at, "d MMMM, HH:mm")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
              <BellOff className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-xs font-medium italic">Nessuna notifica</p>
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && notificationsPath !== '#' && (
          <div className="p-3 bg-gray-50/50 border-t border-border">
            <Link href={notificationsPath}>
              <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/5 gap-2">
                Vedi tutte <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
