"use client"

import { motion } from "framer-motion"
import { XCircle, LogOut, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth"
import Link from "next/link"

export default function RejectedPage() {
  // In a real scenario, you'd fetch the reason from the profile
  const reason = "No se pudo verificar la institución educativa proporcionada."

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-secondary" />
          </div>
        </div>

        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          Acceso denegado
        </h1>

        <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10 mb-8">
          <p className="text-sm font-body text-secondary-dark font-bold mb-1">Motivo del rechazo:</p>
          <p className="text-sm font-body text-muted-foreground italic">
            &quot;{reason}&quot;
          </p>
        </div>

        <div className="space-y-4">
          <Button className="w-full h-11 bg-primary">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contactar soporte
          </Button>

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
