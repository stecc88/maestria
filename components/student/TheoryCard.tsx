"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, CheckCircle2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'

interface TheoryCardProps {
  explanation: string
}

export function TheoryCard({ explanation }: TheoryCardProps) {
  return (
    <Card className="bg-accent/5 border-accent/20 border-2 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BookOpen className="h-24 w-24 text-accent" />
      </div>
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent/20 rounded-lg">
            <BookOpen className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">Antes de empezar, leé esto</h2>
        </div>

        <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed font-body">
          <ReactMarkdown>{explanation}</ReactMarkdown>
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2">
            <CheckCircle2 className="h-3 w-3" /> Tip del Profe
          </div>
          <p className="text-sm text-muted-foreground italic">
            Prestá especial atención a la concordancia. ¡Vos podés!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
