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
  // We want to render them in order: [2nd, 1st, 3rd] for the visual podium
  const displayOrder = [
    topStudents[1],
    topStudents[0],
    topStudents[2]
  ].filter(Boolean)

  return (
    <div className="flex items-end justify-center gap-2 md:gap-8 min-h-[400px] pt-20 pb-8 px-4">
      {displayOrder.map((student, i) => {
        const isFirst = student?.id === topStudents[0]?.id
        const isSecond = student?.id === topStudents[1]?.id
        const position = isFirst ? 1 : isSecond ? 2 : 3

        return (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.8, type: "spring" }}
            className="flex flex-col items-center group"
          >
            <div className="relative mb-6">
              {isFirst && (
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 z-10"
                >
                  <Crown className="h-12 w-12 text-accent fill-accent drop-shadow-[0_0_10px_rgba(245,166,35,0.8)]" />
                </motion.div>
              )}

              <div className="relative p-1 rounded-full bg-gradient-to-tr from-gray-700 via-white/20 to-gray-700 shadow-2xl">
                 <Avatar className={cn(
                   "border-4 border-gray-900 group-hover:scale-105 transition-transform duration-500",
                   isFirst ? "h-24 w-24 md:h-32 md:w-32" : "h-20 w-20 md:h-24 md:w-24"
                 )}>
                   <AvatarImage src={student.profiles.avatar_url} />
                   <AvatarFallback className="bg-gray-800 text-white font-bold text-xl">
                     {student.profiles.full_name.split(' ').map((n:any) => n[0]).join('')}
                   </AvatarFallback>
                 </Avatar>
                 <div className={cn(
                   "absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black border-2 border-gray-900 text-white shadow-xl",
                   isFirst ? "bg-accent text-lg" : isSecond ? "bg-gray-400 text-base" : "bg-orange-600 text-base"
                 )}>
                   {position}
                 </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="font-display font-bold text-white text-sm md:text-lg truncate max-w-[120px] md:max-w-[180px]">
                {student.profiles.full_name}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="h-3 w-3 text-accent fill-accent" />
                <span className="text-xs font-black text-accent">{student.xp_points} XP</span>
              </div>
              <Badge variant="outline" className="mt-2 border-white/10 text-gray-400 text-[10px] bg-white/5">
                Nivel {student.target_level}
              </Badge>
            </div>

            <motion.div
              initial={{ height: 0 }}
              animate={{ height: isFirst ? 180 : isSecond ? 120 : 80 }}
              transition={{ delay: 0.5, duration: 1 }}
              className={cn(
                "w-24 md:w-40 rounded-t-2xl relative overflow-hidden flex flex-col items-center pt-4 shadow-2xl",
                isFirst ? "bg-gradient-to-b from-accent/40 to-accent/5 border-t-2 border-accent/30" :
                isSecond ? "bg-gradient-to-b from-gray-400/30 to-gray-400/5 border-t-2 border-gray-400/30" :
                "bg-gradient-to-b from-orange-600/30 to-orange-600/5 border-t-2 border-orange-600/30"
              )}
            >
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
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
