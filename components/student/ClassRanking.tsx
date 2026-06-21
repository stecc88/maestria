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
    <Card className="bg-white/[0.02] border-white/5 text-white shadow-2xl rounded-3xl overflow-hidden">
      <CardContent className="p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
               <Users className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display font-bold text-xl text-white">I miei compagni</h3>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">
            Prof. {teacherName}
          </p>
        </div>

        <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl relative overflow-hidden group">
           <Trophy className="absolute -right-4 -bottom-4 h-24 w-24 text-primary opacity-5 group-hover:rotate-12 transition-transform duration-700" />
           <p className="text-sm font-bold text-center relative z-10 leading-relaxed">
             {myPosition === 1 ? "Incredibile! Sei al primo posto nella tua classe! 🏆" :
              myIndex > 0 ? `Sei a un passo! Ti mancano solo ${(students[myIndex-1].xp_points - students[myIndex].xp_points)} XP per superare ${students[myIndex-1].profiles.full_name.split(' ')[0]}!` :
              "Continua a scrivere! Ogni correzione ti porta più in alto."}
           </p>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Top 5 Classe</p>
          <div className="grid grid-cols-1 gap-2">
            {students.slice(0, 5).map((student, i) => (
              <div key={student.id} className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-all duration-300",
                student.id === userId ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-white/[0.03]"
              )}>
                <div className="flex items-center gap-3">
                   <span className={cn(
                     "text-xs font-black w-5 text-center",
                     i === 0 ? "text-accent" : "text-muted-foreground"
                   )}>{i + 1}</span>
                   <Avatar className="h-9 w-9 border-2 border-white/5 ring-2 ring-[#0F0F0F]">
                     <AvatarImage src={student.profiles.avatar_url} />
                     <AvatarFallback className="bg-gray-800 text-xs font-bold">
                       {student.profiles.full_name.split(' ').map((n:any) => n[0]).join('')}
                     </AvatarFallback>
                   </Avatar>
                   <div className="flex flex-col min-w-0">
                     <span className={cn(
                       "text-sm font-bold truncate",
                       student.id === userId ? "text-primary" : "text-gray-200"
                     )}>
                       {student.profiles.full_name}
                     </span>
                     <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Lvl {Math.floor(student.xp_points / 500) + 1}</span>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-white">{student.xp_points.toLocaleString()}</p>
                  <p className="text-[8px] font-black text-muted-foreground uppercase">XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { cn } from "@/lib/utils"
