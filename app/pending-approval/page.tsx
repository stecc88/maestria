"use client"

import { motion } from "framer-motion"
import { Clock, LogOut, ShieldCheck, Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import * as React from "react"

export default function PendingApprovalPage() {
  const [isEmailConfirmed, setIsEmailConfirmed] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && !user.email_confirmed_at) {
        setIsEmailConfirmed(false)
      }
    }
    checkUser()
  }, [supabase])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 p-10 md:p-16 text-center border border-gray-50 relative"
      >
        <div className="flex justify-center mb-10">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 bg-accent/10 rounded-[2rem] flex items-center justify-center border-2 border-accent/20"
            >
              <Clock className="w-10 h-10 text-accent" />
            </motion.div>
            <div className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-gray-100">
               <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            Stato Account: In Revisione
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Quasi pronti! 🚀
          </h1>
          <p className="text-gray-500 font-bold text-lg leading-relaxed max-w-md mx-auto">
            Stiamo configurando la tua esperienza su <span className="text-primary">Maestria</span>. La revisione richiede solitamente meno di 24 ore.
          </p>
        </div>

        <div className="space-y-6">
          {!isEmailConfirmed && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 bg-secondary/5 border-2 border-secondary/10 rounded-[1.5rem] flex items-start gap-4 text-left group hover:bg-secondary/10 transition-colors"
            >
              <div className="p-3 bg-secondary/20 rounded-xl group-hover:rotate-12 transition-transform">
                <Mail className="h-6 w-6 text-secondary fill-secondary/20" />
              </div>
              <div>
                <p className="font-black text-secondary uppercase tracking-widest text-xs mb-1">Azione Richiesta</p>
                <p className="text-secondary-dark font-bold text-sm leading-relaxed">
                   Controlla la tua casella email e clicca sul link di conferma per attivare el tuo profilo.
                </p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-14 rounded-2xl border-gray-100 font-black uppercase text-xs tracking-widest text-gray-400 hover:text-secondary hover:bg-secondary/5 hover:border-secondary/20 transition-all"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnetti
            </Button>

            <Link href="/">
              <Button className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black font-black uppercase text-xs tracking-widest text-white shadow-xl shadow-gray-200 transition-all">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna alla Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer decorations */}
        <div className="mt-12 flex justify-center gap-3 opacity-20">
           {[1,2,3].map(i => (
             <div key={i} className="h-1 w-8 bg-gray-400 rounded-full" />
           ))}
        </div>
      </motion.div>
    </div>
  )
}
