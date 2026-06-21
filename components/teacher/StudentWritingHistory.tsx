"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils/date"
import { useState, useEffect } from "react"

interface StudentWritingHistoryProps {
  writings: any[]
}

export function StudentWritingHistory({ writings }: StudentWritingHistoryProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardHeader className="border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Cronologia scritti</CardTitle>
        <Badge variant="outline" className="font-bold">{writings.length} testi</Badge>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {writings.map((w) => (
            <div key={w.id} className="p-5 rounded-2xl bg-card border border-border items-start group hover:border-primary/20 transition-all shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-medium">{mounted ? formatDate(w.submitted_at, 'd MMM yyyy') : '...'}</span>
                    <p className="font-bold text-foreground line-clamp-1">{w.title}</p>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-lg font-black text-primary">{w.corrections?.[0]?.overall_score || '-'}</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">pts</span>
                 </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-[9px] h-5 border-border">{w.target_level}</Badge>
                    <span className="text-gray-300">→</span>
                    <Badge className="text-[9px] h-5 bg-primary text-white border-none">{w.corrections?.[0]?.detected_level || '-'}</Badge>
                 </div>
                 <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{w.writing_type.replace('_', ' ')}</span>
              </div>

              <div className="flex justify-end border-t border-border pt-3">
                {w.corrections?.[0]?.id && (
                  <Link href={`/student/corrections/${w.corrections[0].id}`}>
                    <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/5 font-bold gap-2">
                       <Eye className="h-4 w-4" /> Vedi dettagli
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
          {writings.length === 0 && (
             <div className="w-full py-10 text-center text-muted-foreground italic">Nessuno scritto inviato finora.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
