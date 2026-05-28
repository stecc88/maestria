import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-primary/10">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold">Recuperar contraseña</h1>
          <p className="text-muted-foreground font-body mt-2">
            Ingresá tu email y te enviaremos las instrucciones.
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" placeholder="tu@email.com" />
          </div>
          <Button className="w-full bg-primary hover:bg-primary-dark">
            Enviar instrucciones
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-primary font-bold hover:underline">
            &larr; Volver al login
          </Link>
        </div>
      </div>
    </div>
  )
}
