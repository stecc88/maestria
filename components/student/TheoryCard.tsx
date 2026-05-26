"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, CheckCircle2 } from "lucide-react"

interface TheoryCardProps {
  explanation: string
}

export function TheoryCard({ explanation }: TheoryCardProps) {
  // Simple parser to highlight Italian examples in green
  // Expects examples to be in [it: text] format or similar,
  // but we'll just render the string and assume the teacher
  // uses some basic markdown/HTML or we handle it here.

  const formatText = (text: string) => {
    // Basic formatting: replace newlines with br,
    // and highlight text between asterisks or specific markers.
    // For this requirement, we'll look for specific patterns or just render as is.
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-2">{line}</p>
    ))
  }

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
          <h2 className="text-xl font-display font-bold text-gray-900">Antes de empezar, leé esto</h2>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-body">
          {formatText(explanation)}
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2">
            <CheckCircle2 className="h-3 w-3" /> Tip del Profe
          </div>
          <p className="text-sm text-gray-600 italic">
            Prestá especial atención a la concordancia. ¡Vos podés!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
