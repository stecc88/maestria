"use client"

import React from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Minus, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface RankingTableProps {
  students: any[]
  userId: string
}

export function RankingTable({ students, userId }: RankingTableProps) {
  return (
    <div className="bg-gray-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-white/[0.02]">
              <th className="px-6 py-5">Posto</th>
              <th className="px-6 py-5">Studente</th>
              <th className="px-6 py-5">Livello</th>
              <th className="px-6 py-5">XP Totali</th>
              <th className="px-6 py-5">Streak</th>
              <th className="px-6 py-5 text-center">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.map((student, i) => {
              const isMe = student.id === userId
              const rank = i + 1
              const trend = Math.floor(Math.random() * 3) - 1

              return (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className={cn(
                    "group transition-all duration-300",
                    isMe ? "bg-primary/10" : "hover:bg-white/[0.03]"
                  )}
                >
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-display font-black text-lg",
                      rank === 1 ? "text-accent" : rank === 2 ? "text-slate-400" : rank === 3 ? "text-orange-500" : "text-muted-foreground"
                    )}>
                      #{rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className={cn(
                          "h-10 w-10 border-2 transition-transform duration-300 group-hover:scale-105",
                          isMe ? "border-primary" : "border-gray-800"
                        )}>
                          <AvatarImage src={student.profiles.avatar_url} />
                          <AvatarFallback className="bg-gray-800 text-white font-bold">
                             {student.profiles.full_name.split(' ').map((n:any) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {isMe && (
                           <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-gray-900 shadow-sm" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={cn(
                          "font-bold text-sm truncate max-w-[120px] md:max-w-none",
                          isMe ? "text-primary font-black" : "text-white"
                        )}>
                          {student.profiles.full_name}
                        </p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Studente Attivo</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="text-[10px] font-black border-white/10 bg-white/5 text-muted-foreground uppercase px-2 py-0">
                      {student.target_level}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                        <span className="font-black text-sm text-gray-200">{student.xp_points.toLocaleString()}</span>
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">Punti Esperienza</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-1.5 rounded-lg",
                        student.streak_days > 0 ? "bg-secondary/10" : "bg-white/5"
                      )}>
                        <Flame className={cn(
                          "h-3.5 w-3.5",
                          student.streak_days > 0 ? "text-secondary fill-secondary" : "text-foreground/90"
                        )} />
                      </div>
                      <span className="font-bold text-sm text-white">{student.streak_days}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/5 border border-white/5">
                      {trend > 0 ? (
                        <ArrowUp className="h-3.5 w-3.5 text-primary" />
                      ) : trend < 0 ? (
                        <ArrowDown className="h-3.5 w-3.5 text-secondary" />
                      ) : (
                        <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
