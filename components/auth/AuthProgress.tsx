"use client"

import { motion } from "framer-motion"

interface AuthProgressProps {
  currentStep: number
  totalSteps: number
}

export function AuthProgress({ currentStep, totalSteps }: AuthProgressProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-8">
      <motion.div
        className="h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}
