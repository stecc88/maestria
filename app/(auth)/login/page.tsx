"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { loginSchema, type LoginValues } from "@/lib/validations/auth"
import { signIn } from "@/app/actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginValues) {
    setIsLoading(true)
    try {
      const result = await signIn(data)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("¡Bienvenido de nuevo!")
        router.refresh()
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-10 left-10">
           <Link href="/" className="flex items-center gap-1">
              <span className="text-4xl font-display font-bold text-white">M✦</span>
              <span className="text-2xl font-display font-bold">Maestria</span>
            </Link>
        </div>

        <div className="z-10 text-center max-w-md">
          <div className="text-8xl mb-8">🇮🇹</div>
          <h2 className="text-4xl font-display font-bold mb-6 italic">
            &quot;La lingua è lo specchio della mente.&quot;
          </h2>
          <p className="font-body text-white/80">
            Inicia sesión para continuar tu viaje hacia la maestría del italiano.
          </p>
        </div>

        {/* Abstract decoration */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-display font-bold">Iniciar sesión</h1>
            <p className="text-muted-foreground font-body">Bienvenido a Maestria</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-body" htmlFor="email">
                Correo electrónico
              </label>
              <Input
                id="email"
                placeholder="tu@email.com"
                type="email"
                disabled={isLoading}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-secondary">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-body" htmlFor="password">
                  Contraseña
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline font-body"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <PasswordInput
                id="password"
                disabled={isLoading}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-secondary">{errors.password.message}</p>
              )}
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary-dark h-11 text-lg font-body font-bold"
              disabled={isLoading}
              type="submit"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar sesión
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-cream px-2 text-muted-foreground font-body">o</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-primary/20 hover:bg-primary/5 h-11 font-body"
            disabled={isLoading}
            onClick={() => {}} // Handle Google OAuth
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar con Google
          </Button>

          <p className="text-center text-sm font-body text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Registrate gratis &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
