"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Quote } from "lucide-react"

interface ExaminerCardProps {
  comment: string
}

export function ExaminerCard({ comment }: ExaminerCardProps) {
  return (
    <Card className="h-full bg-card border-none relative overflow-hidden shadow-sm rounded-3xl">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent" />
      <CardContent className="p-8 md:p-10 h-full flex flex-col">
        <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-accent/10 rounded-2xl">
              <ShieldCheck className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-foreground">Rapporto dell&apos;Esaminatore</h3>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Official Assessment Report</p>
            </div>
          </div>
          <Quote className="h-8 w-8 text-gray-100 shrink-0" />
        </div>

        <div className="relative max-w-3xl flex-1">
          <p className="font-body text-foreground/90 leading-relaxed italic text-lg px-2 text-balance">
            {comment}
          </p>
        </div>

        <div className="mt-10 flex flex-col items-end border-t border-border pt-6">
          <p className="font-display font-bold text-foreground italic text-xl tracking-tight leading-none">
            Maestria AI
          </p>
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1.5">Valutazione Professionale</span>
        </div>
      </CardContent>
    </Card>
  )
}
