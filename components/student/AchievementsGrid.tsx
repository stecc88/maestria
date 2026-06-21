"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ALL_ACHIEVEMENTS } from "@/lib/constants/achievements"

interface AchievementsGridProps {
  unlockedIds: string[]
}

export function AchievementsGrid({ unlockedIds }: AchievementsGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
         <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-lg text-white">Traguardi Raggiunti</h3>
            <span className="text-[10px] font-black bg-white/10 text-white/40 px-2 py-0.5 rounded-md uppercase tracking-widest">Achievements</span>
         </div>
         <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
           {unlockedIds.length} / {ALL_ACHIEVEMENTS.length} Sbloccati
         </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {ALL_ACHIEVEMENTS.map((achievement, i) => {
          const isUnlocked = unlockedIds.includes(achievement.id)

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className={cn(
                "h-full border-none transition-all duration-300 relative group",
                isUnlocked
                  ? "bg-gray-800 ring-1 ring-white/10 shadow-lg hover:shadow-primary/5 hover:ring-primary/40"
                  : "bg-white/5 opacity-30 grayscale saturate-50"
              )}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={cn(
                    "text-3xl mb-3 transition-transform duration-500 group-hover:scale-110",
                    isUnlocked ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""
                  )}>
                    {achievement.icon}
                  </div>
                  <div className="space-y-1">
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-tight",
                      isUnlocked ? "text-white" : "text-muted-foreground"
                    )}>
                      {achievement.title}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-medium leading-tight line-clamp-2">
                      {achievement.description}
                    </p>
                  </div>

                  {isUnlocked && (
                    <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className="absolute top-[-100%] left-[-100%] w-[50%] h-[300%] bg-white/5 rotate-[25deg] translate-x-[-100%] group-hover:translate-x-[500%] transition-transform duration-1000" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
