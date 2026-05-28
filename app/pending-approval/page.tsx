"use client"

import { motion } from "framer-motion"
import { Clock, LogOut } from "lucide-react"
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
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center"
          >
            <Clock className="w-10 h-10 text-accent" />
          </motion.div>
        </div>

        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          Tu cuenta está siendo revisada 🕐
        </h1>

        <div className="font-body text-muted-foreground mb-8 space-y-4">
          {!isEmailConfirmed && (
            <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-2xl text-secondary-dark font-bold text-sm">
              📧 Revisá tu casilla de email y hacé click en el link de confirmación que te enviamos.
            </div>
          )}
          <p>
            Un administrador está revisando tu perfil. Este proceso suele tardar menos de 24 horas.
            Te enviaremos un correo electrónico una vez que tu cuenta sea aprobada.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-11 border-primary/20 hover:bg-primary/5"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>

          <Link href="/" className="block text-sm text-primary hover:underline font-body">
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
