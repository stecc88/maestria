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
    <div className="bg-gray-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/2">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Studente</th>
              <th className="px-6 py-4">Livello</th>
              <th className="px-6 py-4">XP</th>
              <th className="px-6 py-4">Striscia</th>
              <th className="px-6 py-4">Tendenza</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.map((student, i) => {
              const isMe = student.id === userId
              const rank = i + 1
              // Mocking trend logic
              const trend = Math.floor(Math.random() * 3) - 1

              return (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className={cn(
                    "group transition-colors",
                    isMe ? "bg-primary/10" : "hover:bg-white/5"
                  )}
                >
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-display font-black text-lg",
                      rank === 1 ? "text-accent" : rank === 2 ? "text-gray-300" : rank === 3 ? "text-orange-400" : "text-gray-600"
                    )}>
                      {rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-gray-800">
                        <AvatarImage src={student.profiles.avatar_url} />
                        <AvatarFallback className="bg-gray-800 text-white font-bold">
                           {student.profiles.full_name.split(' ').map((n:any) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={cn(
                          "font-bold text-sm group-hover:translate-x-1 transition-transform",
                          isMe ? "text-primary-foreground" : "text-white"
                        )}>
                          {student.profiles.full_name} {isMe && "(Tu)"}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase font-black">Status: Attivo</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="bg-white/5 text-gray-300 border-white/5">
                      {student.target_level}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-black text-sm text-gray-200">
                    {student.xp_points.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Flame className={cn(
                        "h-4 w-4",
                        student.streak_days > 0 ? "text-secondary fill-secondary" : "text-gray-700"
                      )} />
                      <span className="font-bold text-sm text-white">{student.streak_days}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {trend > 0 ? (
                      <ArrowUp className="h-4 w-4 text-primary" />
                    ) : trend < 0 ? (
                      <ArrowDown className="h-4 w-4 text-secondary" />
                    ) : (
                      <Minus className="h-4 w-4 text-gray-600" />
                    )}
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
