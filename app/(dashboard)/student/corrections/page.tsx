"use client"

import React, { useState, useEffect } from "react"
import { FileText, Search, Loader2, AlertTriangle, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { CorrectionCard } from "@/components/student/CorrectionCard"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import toast from "react-hot-toast"

export default function CorrectionsPage() {
  const [corrections, setCorrections] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [correctionToDelete, setCorrectionToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchCorrections = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("corrections")
        .select("*, writings!inner(student_id, title, writing_type)")
        .eq("writings.student_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setCorrections(data)
      }
      setIsLoading(false)
    }

    fetchCorrections()
  }, [supabase])

  const handleDelete = async () => {
    if (!correctionToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch("/api/corrections/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correctionId: correctionToDelete.id })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Errore durante l'eliminazione")

      toast.success("Correzione eliminata")
      setCorrections(prev => prev.filter(c => c.id !== correctionToDelete.id))
      setCorrectionToDelete(null)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Caricamento correzioni...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-4 tracking-tight">
             <div className="p-2 bg-primary/10 rounded-2xl">
               <FileText className="h-8 w-8 text-primary" />
             </div>
             Correzioni
          </h1>
          <p className="text-gray-500 mt-2 font-bold text-lg">Archivio completo dei tuoi testi corretti e valutati.</p>
        </div>
      </header>

      {corrections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {corrections.map((correction) => (
            <CorrectionCard
              key={correction.id}
              correction={correction}
              onDeleteClick={setCorrectionToDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 shadow-inner">
          <div className="bg-gray-50 w-28 h-28 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl">
            <FileText className="h-12 w-12 text-gray-200" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Ancora nessuna correzione</h3>
          <p className="text-gray-400 font-bold max-w-sm mx-auto leading-relaxed mb-10">
            Invia el tuo primo testo per ricevere una valutazione dettagliata dal nuestro esaminatore AI.
          </p>
          <Link href="/student/write">
            <Button className="bg-primary hover:bg-primary-dark font-black px-12 py-8 rounded-[1.5rem] text-lg shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
              INIZIA A SCRIVERE ✍️
            </Button>
          </Link>
        </div>
      )}

      {/* Shared Confirmation Modal */}
      <Sheet open={!!correctionToDelete} onOpenChange={(open) => !open && setCorrectionToDelete(null)}>
        <SheetContent side="bottom" className="rounded-t-[2rem] p-8 max-w-lg mx-auto border-none shadow-2xl">
          <SheetHeader className="space-y-4">
            <div className="h-16 w-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <SheetTitle className="text-2xl font-black text-center text-gray-900">Sei sicuro?</SheetTitle>
            <SheetDescription className="text-center text-gray-500 font-medium text-lg leading-relaxed">
              Stai per eliminare: <span className="text-gray-900 font-black italic">&quot;{correctionToDelete?.writings?.title || 'Senza titolo'}&quot;</span>.
              Questa azione non può essere annullata.
            </SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <Button
              variant="outline"
              onClick={() => setCorrectionToDelete(null)}
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
    </div>
  )
}
