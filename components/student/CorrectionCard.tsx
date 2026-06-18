"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils/date"

interface CorrectionCardProps {
  correction: any
  onDeleteClick: (correction: any) => void
}

export function CorrectionCard({ correction, onDeleteClick }: CorrectionCardProps) {
  const handleToggleConfirm = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDeleteClick(correction)
  }

  return (
    <Card
      className="hover:border-primary/30 hover:shadow-xl transition-all duration-300 group overflow-hidden border-gray-100 relative"
    >
      <CardContent className="p-6">
        {/* Delete Button */}
        <button
          onClick={handleToggleConfirm}
          className="absolute top-4 right-4 p-2 rounded-xl bg-gray-50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all z-10"
          title="Elimina correzione"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center justify-center h-14 w-14 bg-primary/5 rounded-2xl border border-primary/10">
            <span className="text-xl font-black text-primary leading-none">
              {correction.overall_score}
            </span>
            <span className="text-[9px] text-gray-400 uppercase font-bold mt-1">pts</span>
          </div>
          <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase bg-gray-50 border-gray-100 text-gray-400">
            {correction.writings?.writing_type?.replace('_', ' ') || 'Generale'}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-display font-bold text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1 pr-8">
              {correction.writings?.title || 'Scritto senza titolo'}
            </h3>
            <div className="flex items-center gap-2 mt-2">
               <Badge className="bg-blue-500 text-white border-none text-[10px] font-black px-2">
                 {correction.detected_level}
               </Badge>
               <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(correction.created_at)}</span>
               </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 flex justify-end">
            <Link href={`/student/corrections/${correction.id}`}>
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 font-bold gap-2">
                Vedi analisi <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
