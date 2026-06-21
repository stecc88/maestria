"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Flame, Clock, ClipboardList, ChevronRight, BookOpen } from "lucide-react"
import Link from "next/link"
import {
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts'
import { formatRelative } from "@/lib/utils/date"
import toast from "react-hot-toast"

interface Course {
  id: string
  name: string
}

interface StudentCardProps {
  student: any
  courses?: Course[]
  onCourseAssigned?: (studentId: string, courseId: string | null) => void
}

export function StudentCard({ student, courses = [], onCourseAssigned }: StudentCardProps) {
  const [mounted, setMounted] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const profile = Array.isArray(student.profiles) ? student.profiles[0] : student.profiles;
  const fullName = profile?.full_name || "Studente";
  const email = profile?.email || "";
  const avatarUrl = profile?.avatar_url;

  const currentCourseName = courses.find(c => c.id === student.course_id)?.name

  const handleCourseChange = async (value: string) => {
    const newCourseId = value === "none" ? null : value
    setIsAssigning(true)
    try {
      const response = await fetch("/api/students/assign-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student.id, courseId: newCourseId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Errore")

      toast.success("Corso assegnato")
      onCourseAssigned?.(student.id, newCourseId)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsAssigning(false)
    }
  }

  // Mock sparkline data
  const sparkData = React.useMemo(() =>
    Array.from({ length: 5 }).map(() => ({ score: 60 + Math.floor(Math.random() * 30) })),
  [])

  return (
    <Card className="hover:border-primary/30 hover:shadow-xl transition-all duration-300 group overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-border">
               <AvatarImage src={avatarUrl} />
               <AvatarFallback className="bg-primary text-white font-bold text-lg">
                 {fullName.split(' ').map((n:any) => n[0]).join('')}
               </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-display font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
                {fullName}
              </h3>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
             <Badge className="bg-blue-500 text-white border-none text-[10px] font-black uppercase">
               {student.current_level || student.target_level}
             </Badge>
             <div className="flex items-center gap-1 text-secondary font-bold text-xs">
                <Flame className="h-3 w-3 fill-secondary" />
                {student.streak_days}
             </div>
          </div>
        </div>

        <div className="mb-6">
          <Select
            value={student.course_id || "none"}
            onValueChange={handleCourseChange}
            disabled={isAssigning}
          >
            <SelectTrigger className="h-9 text-xs bg-muted border-border rounded-xl gap-2">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Senza corso">
                {currentCourseName || "Senza corso"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Senza corso</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="p-3 bg-cream rounded-xl border border-primary/5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Compiti</p>
              <div className="flex items-center gap-2 mt-1">
                 <ClipboardList className="h-3 w-3 text-primary" />
                 <span className="text-sm font-black text-foreground/90">0/0</span>
              </div>
           </div>
           <div className="p-3 bg-cream rounded-xl border border-primary/5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Punteggi</p>
              <div className="h-5 w-full mt-1">
                 <div style={{ width: '100%', height: 20 }}>
                    {mounted && (
                        <ResponsiveContainer width="100%" height={20}>
                            <LineChart data={sparkData}>
                                <Line type="monotone" dataKey="score" stroke="#009246" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                 </div>
              </div>
           </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
           <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
              <Clock className="h-3 w-3" />
              Attività: {mounted ? formatRelative(student.last_activity) : '...'}
           </div>
           <Link href={`/teacher/students/${student.id}`}>
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 font-bold gap-1 p-0 h-auto">
                 Vedi profilo <ChevronRight className="h-4 w-4" />
              </Button>
           </Link>
        </div>
      </CardContent>
    </Card>
  )
}
