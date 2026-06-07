"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, ArrowRight, BookOpen, Sparkles, Flame, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TaskResultDisplayProps {
  result: {
    score: number
    feedback: string
    error_overcome: boolean
    xp_earned: number
  }
}

export function TaskResultDisplay({ result }: TaskResultDisplayProps) {
  const [count, setCount] = useState(0)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    let timer = setTimeout(() => setShowContent(true), 500)

    let scoreTimer = setInterval(() => {
      setCount(prev => {
        if (prev < result.score) return prev + 1
        clearInterval(scoreTimer)
        return prev
      })
    }, 20)

    return () => {
      clearTimeout(timer)
      clearInterval(scoreTimer)
    }
  }, [result.score])

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-10 text-center">
      <AnimatePresence>
        {showContent && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative inline-block"
            >
              <div className={cn(
                "w-48 h-48 rounded-full flex flex-col items-center justify-center border-8 shadow-2xl mx-auto",
                result.error_overcome ? "border-primary bg-primary/5" : "border-accent bg-accent/5"
              )}>
                <span className="text-6xl font-display font-bold text-gray-900">{count}</span>
                <span className="text-sm font-bold text-gray-400 uppercase">Punti</span>
              </div>

              {result.error_overcome && (
                <motion.div
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-4 -right-4 bg-accent text-white p-3 rounded-2xl shadow-lg rotate-12"
                >
                  <Trophy className="h-8 w-8" />
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-display font-bold text-gray-900">
                {result.error_overcome ? "Hai superato l'errore! 🎉" : "Continua a migliorare! 💪"}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-accent text-white border-none py-1 px-4 gap-2 text-lg">
                  <Sparkles className="h-5 w-5 fill-white" />
                  +{result.xp_earned} XP
                </Badge>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white border-gray-100 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 text-left">
                    <div className={cn(
                      "p-3 rounded-2xl shrink-0",
                      result.error_overcome ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                    )}>
                      {result.error_overcome ? <CheckCircle2 className="h-8 w-8" /> : <Flame className="h-8 w-8" />}
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-900 mb-2">Feedback dell&apos;Insegnante:</h4>
                       <p className="text-gray-600 leading-relaxed italic text-lg">
                         &quot;{result.feedback}&quot;
                       </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <Link href="/student/write" className="w-full sm:w-auto">
                <Button className="w-full bg-primary hover:bg-primary-dark font-bold py-6 px-10 rounded-2xl gap-2 shadow-lg shadow-primary/20">
                  Invia un altro testo ✍️
                </Button>
              </Link>
              <Link href="/student/tasks" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 font-bold py-6 px-10 rounded-2xl gap-2">
                  Vedi i compiti 📝
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
