"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Eye } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils/date"
import { useState, useEffect } from "react"

interface LatestCorrectionsProps {
  corrections: any[]
}

export function LatestCorrections({ corrections }: LatestCorrectionsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="border-none shadow-sm bg-card overflow-hidden">
      <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span>Ultime Correzioni</span>
        </CardTitle>
        <Link href="/student/corrections" className="text-[10px] font-bold text-primary hover:underline">
          TUTTE →
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {corrections.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {corrections.map((correction) => (
              <div key={correction.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 bg-primary/5 rounded-xl flex flex-col items-center justify-center shrink-0 border border-primary/5">
                      <span className="text-sm font-black text-primary leading-none">{correction.overall_score}</span>
                      <span className="text-[8px] font-black text-primary/40 uppercase">pts</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-foreground truncate leading-none mb-1.5">
                        {correction.writings.title || 'Senza titolo'}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] font-black bg-blue-50/50 text-blue-600 border-none px-1 py-0 uppercase">
                          {correction.detected_level}
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{mounted ? formatDate(correction.created_at, 'd MMM') : '...'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href={`/student/corrections/${correction.id}`}>
                    <Button size="icon-sm" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="h-5 w-5 text-gray-300" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nessuna correzione</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
