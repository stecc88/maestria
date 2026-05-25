"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"

interface ExaminerCardProps {
  comment: string
}

export function ExaminerCard({ comment }: ExaminerCardProps) {
  return (
    <Card className="bg-cream border-accent/20 relative overflow-hidden shadow-md">
      {/* Decorative Stamp */}
      <div className="absolute -top-4 -right-4 w-24 h-24 border-4 border-accent/10 rounded-full flex items-center justify-center rotate-12">
        <div className="border-2 border-accent/10 w-16 h-16 rounded-full flex items-center justify-center">
          <span className="text-[8px] font-bold text-accent/20 uppercase tracking-widest text-center">
            Maestria<br/>Examiner
          </span>
        </div>
      </div>

      <CardContent className="p-8 space-y-4">
        <div className="flex items-center gap-3 border-b border-accent/10 pb-4">
          <div className="p-2 bg-accent/10 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-gray-900">Evaluación del examinador</h3>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Official Assessment Report</p>
          </div>
        </div>

        <p className="font-body text-gray-700 leading-relaxed italic text-lg first-letter:text-4xl first-letter:font-display first-letter:font-bold first-letter:mr-1 first-letter:float-left">
          {comment}
        </p>

        <div className="pt-6 flex flex-col items-end">
          <div className="font-display font-bold text-gray-900 italic text-xl border-b border-gray-900 px-4">
            Maestria AI
          </div>
          <span className="text-xs text-gray-400 mt-1">Evaluación profesional</span>
        </div>
      </CardContent>
    </Card>
  )
}
