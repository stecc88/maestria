"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Quote } from "lucide-react"

interface ExaminerCardProps {
  comment: string
}

export function ExaminerCard({ comment }: ExaminerCardProps) {
  return (
    <Card className="bg-white border-none relative overflow-hidden shadow-sm rounded-3xl">
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-accent" />

      <CardContent className="p-8 md:p-10 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-50 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-2xl">
              <ShieldCheck className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl text-gray-900">Rapporto dell&apos;Esaminatore</h3>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Official Assessment Report</p>
            </div>
          </div>
          <Quote className="h-12 w-12 text-gray-50 shrink-0" />
        </div>

        <div className="relative">
          <p className="font-body text-gray-700 leading-[1.8] italic text-xl px-2">
            {comment}
          </p>
        </div>

        <div className="pt-8 flex flex-col items-end">
          <div className="flex flex-col items-end border-t border-gray-100 pt-6 min-w-[200px]">
            <p className="font-display font-bold text-gray-900 italic text-2xl tracking-tight">
              Maestria AI
            </p>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Valutazione Professionale</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
