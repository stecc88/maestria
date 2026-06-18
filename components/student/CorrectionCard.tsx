"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, Trash2, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils/date"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface CorrectionCardProps {
  correction: any
  onDelete: (id: string) => void
}

export function CorrectionCard({ correction, onDelete }: CorrectionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsDeleting(true)
    try {
      const response = await fetch("/api/corrections/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correctionId: correction.id })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Errore durante l'eliminazione")

      toast.success("Correzione eliminata")
      onDelete(correction.id)
    } catch (error: any) {
      toast.error(error.message)
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  const toggleConfirm = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowConfirm(!showConfirm)
  }

  return (
    <>
      <Card
        className="hover:border-primary/30 hover:shadow-xl transition-all duration-300 group overflow-hidden border-gray-100 relative"
      >
        <CardContent className="p-6">
          {/* Delete Button */}
          <button
            onClick={toggleConfirm}
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

      {/* Confirmation Modal using Sheet as a Dialog surrogate if Dialog is missing */}
      <Sheet open={showConfirm} onOpenChange={setShowConfirm}>
        <SheetContent side="bottom" className="rounded-t-[2rem] p-8 max-w-lg mx-auto border-none shadow-2xl">
          <SheetHeader className="space-y-4">
            <div className="h-16 w-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <SheetTitle className="text-2xl font-black text-center text-gray-900">Sei sicuro?</SheetTitle>
            <SheetDescription className="text-center text-gray-500 font-medium text-lg leading-relaxed">
              Questa azione eliminerà definitivamente la correzione e il testo associato. Non puoi annullare questa operazione.
            </SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="py-6 rounded-2xl font-bold border-gray-100 hover:bg-gray-50"
            >
              Annulla
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="py-6 rounded-2xl font-black shadow-lg shadow-red-200 gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  Elimina
                </>
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
