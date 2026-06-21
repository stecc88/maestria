"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, AlertTriangle } from "lucide-react"

interface ErrorAnalysisProps {
  errors: Record<string, number>
  examples: any[]
}

export function ErrorAnalysis({ errors, examples }: ErrorAnalysisProps) {
  const categories = Object.entries(errors).sort((a, b) => b[1] - a[1])
  const max = Math.max(...categories.map(c => c[1]), 1)

  return (
    <div className="space-y-8">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-secondary" />
            Errori più frequenti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map(([category, count]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize font-bold text-foreground/90">{category}</span>
                <span className="text-muted-foreground font-medium">{count} volte</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-1000"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {categories.length === 0 && <p className="text-center text-muted-foreground italic py-4">Dati sugli errori insufficienti.</p>}
        </CardContent>
      </Card>

      <Card className="border-border bg-secondary/5 border-secondary/10">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-secondary">
             <AlertCircle className="h-5 w-5" />
             Esempi reali rilevati
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           {examples.slice(0, 4).map((ex, i) => (
             <div key={i} className="p-3 bg-card rounded-xl border border-secondary/10 text-sm">
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-[10px] font-black uppercase text-secondary">{ex.type}</span>
                   <span className="text-gray-300">|</span>
                   <span className="text-red-400 line-through italic">{ex.original}</span>
                </div>
                <p className="font-bold text-foreground">{ex.corrected}</p>
             </div>
           ))}
           {examples.length === 0 && <p className="text-center text-muted-foreground italic py-4 text-sm">Non ci sono ancora esempi da mostrare.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
