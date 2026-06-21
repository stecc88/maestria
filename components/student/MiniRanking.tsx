"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, ArrowUp, ArrowDown, Minus, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MiniRankingProps {
  topStudents: any[]
  userRank: {
    rank: number
    diff: number
  }
}

export function MiniRanking({ topStudents, userRank }: MiniRankingProps) {
  return (
    <Card className="border-none shadow-xl shadow-gray-200/50 bg-card overflow-hidden rounded-[2rem] group hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-4 border-b border-gray-50 flex flex-row items-center justify-between px-6 bg-gradient-to-r from-white to-gray-50/50">
        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2.5">
          <div className="p-1.5 bg-accent/10 rounded-lg group-hover:rotate-12 transition-transform">
            <Trophy className="h-3.5 w-3.5 text-accent" />
          </div>
          <span>Top Performance</span>
        </CardTitle>
        <Link
          href="/student/ranking"
          className="text-[10px] font-black text-primary hover:text-primary-dark transition-colors bg-primary/5 px-3 py-1 rounded-full border border-primary/10 shadow-sm"
        >
          VEDI TUTTI
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {/* User Rank Highlight */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 bg-gradient-to-br from-primary/5 via-white to-accent/5 border-b border-gray-50 relative"
        >
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-card flex items-center justify-center border-2 border-primary/20 shadow-lg font-display font-black text-xl text-primary transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    #{userRank.rank || '-'}
                  </div>
                  <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-accent animate-pulse" />
                </div>
                <div>
                   <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Il tuo Rango</p>
                   <div className="flex items-center gap-2">
                      {userRank.diff > 0 ? (
                        <div className="flex items-center text-xs text-primary font-black bg-primary/10 px-2 py-0.5 rounded-full">
                          <ArrowUp className="h-3 w-3 mr-0.5" /> {userRank.diff}
                        </div>
                      ) : userRank.diff < 0 ? (
                        <div className="flex items-center text-xs text-secondary font-black bg-secondary/10 px-2 py-0.5 rounded-full">
                          <ArrowDown className="h-3 w-3 mr-0.5" /> {Math.abs(userRank.diff)}
                        </div>
                      ) : (
                        <div className="flex items-center text-xs text-muted-foreground font-black bg-muted px-2 py-0.5 rounded-full">
                          <Minus className="h-3 w-3 mr-0.5" /> 0
                        </div>
                      )}
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest italic">vs sett. scorsa</span>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Top List */}
        <div className="p-5 space-y-5">
          {topStudents.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between group/item"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-2 ring-gray-50 group-hover/item:ring-primary/20 transition-all duration-300">
                    <AvatarImage src={student.profiles.avatar_url} />
                    <AvatarFallback className={cn(
                      "text-white text-xs font-black",
                      i === 0 ? "bg-accent shadow-accent/20 shadow-lg" :
                      i === 1 ? "bg-slate-400 shadow-slate-400/20 shadow-lg" :
                      "bg-orange-400 shadow-orange-400/20 shadow-lg"
                    )}>
                      {student.profiles.full_name.split(' ').map((n:any) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -top-1 -left-1 w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black border-2 border-white shadow-lg",
                    i === 0 ? "bg-accent text-white" : i === 1 ? "bg-slate-300 text-slate-700" : "bg-orange-300 text-orange-800"
                  )}>
                    {i + 1}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-foreground truncate tracking-tight group-hover/item:text-primary transition-colors">{student.profiles.full_name}</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none mt-1.5 flex items-center gap-1">
                    <span className="text-accent font-black">{student.xp_points}</span> XP
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] font-black border-border bg-gray-50/50 text-muted-foreground rounded-xl px-2.5 py-1 group-hover/item:bg-primary group-hover/item:text-white group-hover/item:border-primary transition-all shadow-sm">
                LV {Math.floor(student.xp_points / 500) + 1}
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
