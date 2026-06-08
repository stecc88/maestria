"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, ArrowUp, ArrowDown, Minus } from "lucide-react"
import Link from "next/link"

interface MiniRankingProps {
  topStudents: any[]
  userRank: {
    rank: number
    diff: number
  }
}

export function MiniRanking({ topStudents, userRank }: MiniRankingProps) {
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-3 border-b border-gray-50 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
          <Trophy className="h-3.5 w-3.5 text-accent" />
          <span>Classifica</span>
        </CardTitle>
        <Link href="/student/ranking" className="text-[10px] font-bold text-primary hover:underline">
          TUTTA →
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {/* User Rank Highlight */}
        <div className="p-4 bg-cream/50 border-b border-gray-50">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-primary/10 shadow-sm font-display font-bold text-primary">
                  #{userRank.rank || '-'}
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-900 leading-none mb-1">Il tuo posto</p>
                   <div className="flex items-center gap-1.5">
                      {userRank.diff > 0 ? (
                        <div className="flex items-center text-[10px] text-primary font-black">
                          <ArrowUp className="h-2.5 w-2.5" /> {userRank.diff}
                        </div>
                      ) : userRank.diff < 0 ? (
                        <div className="flex items-center text-[10px] text-secondary font-black">
                          <ArrowDown className="h-2.5 w-2.5" /> {Math.abs(userRank.diff)}
                        </div>
                      ) : (
                        <div className="flex items-center text-[10px] text-gray-400 font-black">
                          <Minus className="h-2.5 w-2.5" /> 0
                        </div>
                      )}
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">vs scorsa settimana</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Top List */}
        <div className="p-4 space-y-4">
          {topStudents.map((student, i) => (
            <div key={student.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-gray-100">
                    <AvatarImage src={student.profiles.avatar_url} />
                    <AvatarFallback className={i === 0 ? "bg-accent text-white text-xs font-bold" : "bg-gray-100 text-xs font-bold text-gray-400"}>
                      {student.profiles.full_name.split(' ').map((n:any) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -top-1 -left-1 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-black border-2 border-white shadow-sm",
                    i === 0 ? "bg-accent text-white" : i === 1 ? "bg-slate-300 text-slate-700" : "bg-orange-300 text-orange-800"
                  )}>
                    {i + 1}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate tracking-tight">{student.profiles.full_name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">{student.xp_points} XP</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[9px] font-black border-gray-100 bg-gray-50/50 text-gray-500 rounded-lg">
                LVL {Math.floor(student.xp_points / 500) + 1}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { cn } from "@/lib/utils"
