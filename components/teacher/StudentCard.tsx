"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Flame, Clock, ClipboardList, ChevronRight, Book } from "lucide-react"
import Link from "next/link"
import { CourseAssigner } from "./courses/CourseAssigner"
import {
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts'
import { formatRelative } from "@/lib/utils/date"

interface StudentCardProps {
  student: any
  courses: any[]
}

export function StudentCard({ student, courses }: StudentCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const profile = Array.isArray(student.profiles) ? student.profiles[0] : student.profiles;
  const fullName = profile?.full_name || "Studente";
  const email = profile?.email || "";
  const avatarUrl = profile?.avatar_url;
  const assignedCourse = courses.find(c => c.id === student.course_id);

  // Mock sparkline data
  const sparkData = React.useMemo(() =>
    Array.from({ length: 5 }).map(() => ({ score: 60 + Math.floor(Math.random() * 30) })),
  [])

  const lastSeen = student.last_activity ? new Date(student.last_activity) : null

  return (
    <Card className="hover:border-primary/30 hover:shadow-xl transition-all duration-300 group overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-gray-100">
               <AvatarImage src={avatarUrl} />
               <AvatarFallback className="bg-primary text-white font-bold text-lg">
                 {fullName.split(' ').map((n:any) => n[0]).join('')}
               </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors">
                  {fullName}
                </h3>
                {assignedCourse && (
                  <Badge variant="outline" className="h-5 px-1.5 border-primary/20 text-primary bg-primary/5 text-[9px] font-black uppercase">
                    <Book className="h-2.5 w-2.5 mr-1" /> {assignedCourse.name}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-400">{email}</p>
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

        <div className="grid grid-cols-2 gap-4 mb-4">
           <div className="p-3 bg-cream rounded-xl border border-primary/5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Compiti</p>
              <div className="flex items-center gap-2 mt-1">
                 <ClipboardList className="h-3 w-3 text-primary" />
                 <span className="text-sm font-black text-gray-700">0/0</span>
              </div>
           </div>
           <div className="p-3 bg-cream rounded-xl border border-primary/5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Punteggi</p>
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

        <div className="mb-6">
           <CourseAssigner
             studentId={student.id}
             currentCourseId={student.course_id}
             courses={courses}
           />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
           <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
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
