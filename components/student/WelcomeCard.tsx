"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Sparkles, Target, Zap, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { getLevelFromXP } from "@/lib/utils/levels"

interface WelcomeCardProps {
  name: string
  targetLevel: string
  currentLevel?: string
  streak: number
  xp: number
}

const LEVEL_COLORS: Record<string, string> = {
  "A1": "bg-gray-500",
  "A2": "bg-emerald-500",
  "B1": "bg-blue-500",
  "B2": "bg-purple-500",
  "C1": "bg-orange-500",
  "C2": "bg-red-500",
}

export function WelcomeCard({ name, targetLevel, currentLevel = "A1", streak, xp }: WelcomeCardProps) {
  const levelInfo = getLevelFromXP(xp)
  const currentLevelXp = levelInfo.current.minXp
  const nextLevelXp = levelInfo.next ? levelInfo.next.minXp : currentLevelXp
  const progress = levelInfo.progress

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/5 via-white to-accent/5 premium-shadow relative group">
      {/* Decorative animated bar */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-secondary"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 100%" }}
      />

      <CardContent className="p-6 md:p-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-black text-primary uppercase tracking-widest">Studente Premium</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                Ciao, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{name.split(' ')[0]}</span>! 👋
              </h1>
              <p className="text-gray-500 font-bold text-lg leading-relaxed max-w-xl">
                Il tuo viaggio verso l&apos;italiano perfetto continua. Quale sarà la tua próxima sfida oggi?
              </p>
            </motion.div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-white/50 backdrop-blur shadow-sm border border-gray-100 rounded-2xl px-5 py-3 transition-all hover:shadow-md">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Obiettivo</p>
                  <Badge className={cn("mt-0.5 font-black border-none", LEVEL_COLORS[targetLevel] || "bg-primary")}>{targetLevel}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/50 backdrop-blur shadow-sm border border-gray-100 rounded-2xl px-5 py-3 transition-all hover:shadow-md">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attuale</p>
                  <Badge className={cn("mt-0.5 font-black border-none text-white", LEVEL_COLORS[currentLevel] || "bg-blue-500")}>{currentLevel}</Badge>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 bg-secondary/10 border border-secondary/20 rounded-2xl px-5 py-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <Flame className="h-5 w-5 text-secondary fill-secondary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Serie</p>
                  <p className="text-lg font-black text-secondary">{streak} GIORNI</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-gray-100 lg:pl-10 relative">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{levelInfo.next?.name || "Prossimo Livello"}</span>
                 </div>
                 <span className="text-sm font-black text-gray-900">{xp} <span className="text-gray-300">/</span> {nextLevelXp} XP</span>
              </div>

              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden p-1 shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${progress}%`,
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{
                      width: { duration: 1.5, ease: "easeOut" },
                      backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                    }}
                    style={{ backgroundSize: "200% 100%" }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                  </motion.div>
                </div>
                <div className="flex justify-between items-center px-1">
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                     {levelInfo.next ? `Mancano ${nextLevelXp - xp} XP` : "Livello Massimo"}
                   </p>
                   <p className="text-[10px] text-primary font-black uppercase tracking-widest">
                     {levelInfo.current.name}
                   </p>
                </div>
              </div>

              <Link href="/student/write" className="block w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative overflow-hidden bg-gray-900 text-white font-black py-4 rounded-[1.25rem] transition-all shadow-xl shadow-gray-900/20 text-sm group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    INIZIA A SCRIVERE ORA <Sparkles className="h-4 w-4" />
                  </span>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating background element */}
        <div className="absolute -bottom-10 -right-6 opacity-[0.03] pointer-events-none select-none overflow-hidden group-hover:opacity-[0.05] transition-opacity">
           <span className="text-[15rem] font-black leading-none italic">IT</span>
        </div>
      </CardContent>
    </Card>
  )
}
