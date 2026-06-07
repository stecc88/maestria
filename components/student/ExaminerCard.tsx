"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Quote } from "lucide-react"

interface ExaminerCardProps {
  comment: string
}

export function ExaminerCard({ comment }: ExaminerCardProps) {
  return (
    <Card className="bg-white border-none relative overflow-hidden shadow-sm rounded-3xl h-full flex flex-col">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent" />

      <CardContent className="p-8 md:p-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-50 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-accent/10 rounded-2xl">
              <ShieldCheck className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-gray-900">Rapporto dell&apos;Esaminatore</h3>
              <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Official Assessment Report</p>
            </div>
          </div>
          <Quote className="h-8 w-8 text-gray-100 shrink-0" />
        </div>

        <div className="relative flex-1">
          <p className="font-body text-gray-700 leading-relaxed italic text-lg px-2">
            {comment}
          </p>
        </div>

        <div className="mt-10 flex flex-col items-end border-t border-gray-50 pt-6">
            <p className="font-display font-bold text-gray-900 italic text-xl tracking-tight leading-none">
              Maestria AI
            </p>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1.5">Valutazione Professionale</span>
        </div>
      </CardContent>
    </Card>
  )
}
