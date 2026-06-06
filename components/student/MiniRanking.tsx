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
    <Card className="border-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            <span>Classifica</span>
          </div>
          <Link href="/student/ranking" className="text-xs text-primary font-medium hover:underline">
            Vedi tutto →
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Status */}
        <div className="flex items-center justify-between p-3 bg-cream rounded-xl border border-primary/5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 font-medium">Posto</span>
              <span className="text-xl font-bold text-primary">#{userRank.rank || '-'}</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200" />
            <div>
              <p className="text-sm font-bold">La tua posizione</p>
              <div className="flex items-center gap-1">
                {userRank.diff > 0 ? (
                  <div className="flex items-center text-xs text-primary font-bold">
                    <ArrowUp className="h-3 w-3" /> {userRank.diff}
                  </div>
                ) : userRank.diff < 0 ? (
                  <div className="flex items-center text-xs text-secondary font-bold">
                    <ArrowDown className="h-3 w-3" /> {Math.abs(userRank.diff)}
                  </div>
                ) : (
                  <div className="flex items-center text-xs text-gray-400 font-bold">
                    <Minus className="h-3 w-3" /> 0
                  </div>
                )}
                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">vs scorsa settimana</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 */}
        <div className="space-y-4">
          {topStudents.map((student, i) => (
            <div key={student.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={student.profiles.avatar_url} />
                    <AvatarFallback className={i === 0 ? "bg-accent text-white" : "bg-gray-100"}>
                      {student.profiles.full_name.split(' ').map((n:any) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm
                    ${i === 0 ? "bg-accent text-white" : i === 1 ? "bg-gray-300 text-gray-600" : "bg-orange-300 text-orange-800"}`}
                  >
                    {i + 1}
                  </div>
                </div>
                <div className="max-w-[100px]">
                  <p className="text-sm font-bold text-gray-900 truncate">{student.profiles.full_name}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{student.xp_points} XP</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold border-gray-100">
                Lvl {Math.floor(student.xp_points / 500) + 1}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
