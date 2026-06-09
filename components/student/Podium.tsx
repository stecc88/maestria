"use client"

import React from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Crown, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface PodiumProps {
  topStudents: any[]
}

export function Podium({ topStudents }: PodiumProps) {
  // topStudents order: [1st, 2nd, 3rd]
  const displayOrder = [
    topStudents[1],
    topStudents[0],
    topStudents[2]
  ].filter(Boolean)

  return (
    <div className="flex items-end justify-center gap-3 md:gap-8 min-h-[380px] pt-16 pb-8 px-4">
      {displayOrder.map((student, i) => {
        const isFirst = student?.id === topStudents[0]?.id
        const isSecond = student?.id === topStudents[1]?.id
        const position = isFirst ? 1 : isSecond ? 2 : 3

        return (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="flex flex-col items-center group flex-1 max-w-[200px]"
          >
            <div className="relative mb-6">
              {isFirst && (
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 z-10"
                >
                  <Crown className="h-10 w-10 text-accent fill-accent drop-shadow-[0_0_15px_rgba(245,166,35,0.6)]" />
                </motion.div>
              )}

              <div className="relative p-1 rounded-full bg-gradient-to-tr from-white/10 via-white/40 to-white/10 shadow-2xl">
                 <Avatar className={cn(
                   "border-4 border-[#0F0F0F] transition-all duration-500",
                   isFirst ? "h-24 w-24 md:h-32 md:w-32 ring-4 ring-accent/20" : "h-16 w-16 md:h-24 md:w-24"
                 )}>
                   <AvatarImage src={student.profiles.avatar_url} />
                   <AvatarFallback className="bg-gray-800 text-white font-bold text-xl">
                     {student.profiles.full_name.split(' ').map((n:any) => n[0]).join('')}
                   </AvatarFallback>
                 </Avatar>
                 <div className={cn(
                   "absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black border-2 border-[#0F0F0F] text-white shadow-xl",
                   isFirst ? "bg-accent text-lg" : isSecond ? "bg-slate-400 text-base" : "bg-orange-600 text-base"
                 )}>
                   {position}
                 </div>
              </div>
            </div>

            <div className="text-center mb-4 w-full">
              <p className="font-display font-bold text-white text-sm md:text-lg truncate px-2">
                {student.profiles.full_name}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="h-3 w-3 text-accent fill-accent" />
                <span className="text-xs font-black text-accent">{student.xp_points} XP</span>
              </div>
            </div>

            <motion.div
              initial={{ height: 0 }}
              animate={{ height: isFirst ? 160 : isSecond ? 100 : 70 }}
              className={cn(
                "w-full rounded-t-2xl relative overflow-hidden flex flex-col items-center pt-4 shadow-2xl",
                isFirst ? "bg-gradient-to-b from-accent/30 to-accent/5 border-t-2 border-accent/40" :
                isSecond ? "bg-gradient-to-b from-slate-400/20 to-slate-400/5 border-t-2 border-slate-400/30" :
                "bg-gradient-to-b from-orange-600/20 to-orange-600/5 border-t-2 border-orange-600/30"
              )}
            >
               <span className="text-4xl md:text-6xl font-display font-black text-white/10 select-none">
                 {position}
               </span>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
