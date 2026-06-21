"use client"

import { motion } from "framer-motion"
import { XCircle, LogOut, MessageSquare, AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth"
import Link from "next/link"
import * as React from "react"

export default function RejectedPage() {
  const reason = "Impossibile verificare l'istituzione educativa fornita o el codice docente non è valido."

  return (
    <div className="min-h-screen bg-card flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gray-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-card rounded-3xl shadow-2xl shadow-gray-200/50 p-10 md:p-16 text-center border border-border relative"
      >
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="w-24 h-24 bg-secondary/10 rounded-3xl flex items-center justify-center border-2 border-secondary/20">
              <XCircle className="w-10 h-10 text-secondary" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2 p-2 bg-card rounded-full shadow-lg border border-border"
            >
               <AlertCircle className="h-5 w-5 text-secondary" />
            </motion.div>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            Stato Account: Non Approvato
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
            Accesso Negato 🛑
          </h1>
          <p className="text-muted-foreground font-bold text-lg leading-relaxed max-w-md mx-auto">
            Spiacenti, el tuo profilo non ha superato i controlli di sicurezza necessari per accedere a <span className="text-primary">Maestria</span>.
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 bg-muted rounded-3xl border-2 border-border mb-10 text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <AlertCircle className="h-20 w-20 text-foreground" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
            Motivazione Ufficiale
          </p>
          <p className="text-foreground/90 font-black text-lg italic leading-relaxed relative z-10">
            &quot;{reason}&quot;
          </p>
        </motion.div>

        <div className="space-y-4">
          <Link
            href="mailto:supporto@maestria.it"
            className="w-full h-16 rounded-2xl bg-gray-900 hover:bg-black font-black uppercase text-xs tracking-widest text-white shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-3"
          >
            <MessageSquare className="w-5 h-5" />
            CONTATTA IL SUPPORTO
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-14 rounded-2xl border-border font-black uppercase text-xs tracking-widest text-muted-foreground hover:bg-muted transition-all"
              onClick={() => React.startTransition(() => { signOut() })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnetti
            </Button>

            <Link href="/">
              <Button variant="ghost" className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest text-primary hover:bg-primary/5 transition-all">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna alla Home
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
