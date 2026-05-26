"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Trophy } from "lucide-react"

interface ClassRankingProps {
  students: any[]
  teacherName: string
  userId: string
}

export function ClassRanking({ students, teacherName, userId }: ClassRankingProps) {
  const myIndex = students.findIndex(s => s.id === userId)
  const myPosition = myIndex + 1

  return (
    <Card className="bg-gray-900 border-gray-800 text-white shadow-2xl">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Ranking de mi clase</h3>
          </div>
          <p className="text-[10px] font-bold text-gray-500 italic">Con Prof. {teacherName}</p>
        </div>

        <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
           <p className="text-sm font-bold text-center">
             {myPosition === 1 ? "¡Estás primero/a en tu clase! 🏆" :
              myIndex > 0 ? `¡Estás a ${(students[myIndex-1].xp_points - students[myIndex].xp_points)} XP de ${students[myIndex-1].profiles.full_name}!` :
              "¡Seguí así! Cada texto cuenta."}
           </p>
        </div>

        <div className="space-y-4">
          {students.slice(0, 5).map((student, i) => (
            <div key={student.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                 <span className="text-xs font-black text-gray-600 w-4">{i + 1}</span>
                 <Avatar className="h-8 w-8 border border-white/10">
                   <AvatarImage src={student.profiles.avatar_url} />
                   <AvatarFallback className="bg-gray-800 text-xs">
                     {student.profiles.full_name.split(' ').map((n:any) => n[0]).join('')}
                   </AvatarFallback>
                 </Avatar>
                 <span className={`text-sm font-medium ${student.id === userId ? "text-primary font-bold" : "text-gray-300"}`}>
                   {student.profiles.full_name}
                 </span>
              </div>
              <span className="text-xs font-black text-gray-500">{student.xp_points} XP</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
