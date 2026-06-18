"use client"

import React, { useState, useEffect } from "react"
import { FileText, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { CorrectionCard } from "@/components/student/CorrectionCard"

export default function CorrectionsPage() {
  const [corrections, setCorrections] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  const handleDelete = (id: string) => {
    setCorrections(prev => prev.filter(c => c.id !== id))
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
              onDelete={handleDelete}
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
    </div>
  )
}
