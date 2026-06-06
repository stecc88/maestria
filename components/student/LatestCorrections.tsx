"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Eye } from "lucide-react"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import Link from "next/link"

interface LatestCorrectionsProps {
  corrections: any[]
}

export function LatestCorrections({ corrections }: LatestCorrectionsProps) {
  return (
    <Card className="border-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Ultime correzioni</span>
          </div>
          <Link href="/student/corrections" className="text-xs text-primary font-medium hover:underline">
            Vedi tutte →
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {corrections.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
            {corrections.map((correction) => (
              <div
                key={correction.id}
                className="min-w-[280px] p-4 rounded-xl border border-gray-50 bg-white hover:border-primary/20 transition-colors shadow-sm snap-center"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center h-12 w-12 bg-cream rounded-lg border border-primary/5">
                      <span className="text-lg font-bold text-primary leading-none">
                        {correction.overall_score}
                      </span>
                      <span className="text-[8px] text-gray-400 uppercase font-bold mt-1">pts</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight mb-1 truncate max-w-[120px]">
                        {correction.writings.title || 'Scritto senza titolo'}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 border-none px-1.5 py-0">
                          {correction.detected_level}
                        </Badge>
                        <span className="text-[10px] text-gray-400 capitalize">
                          {correction.writings.writing_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/student/corrections/${correction.id}`}>
                    <Button size="icon-sm" variant="ghost" className="rounded-full hover:bg-primary/5 hover:text-primary">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(correction.created_at), 'd MMMM yyyy', { locale: it })}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 italic">Non ci sono ancora correzioni da mostrare</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
