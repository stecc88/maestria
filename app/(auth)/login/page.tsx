"use client"

import * as React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Loader2, Sparkles, ArrowLeft, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { loginSchema, type LoginValues } from "@/lib/validations/auth"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
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
    const supabase = createClient()

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        toast.error(authError.message)
        setIsLoading(false)
        return
      }

      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', authData.user.id)
          .single()

        if (profileError || !profile) {
          toast.error("Profilo utente non trovato. Contatta il supporto.")
          setIsLoading(false)
          return
        }

        toast.success("Bentornato!")

        if (profile.status === 'pending') {
          window.location.href = '/pending-approval'
        } else if (profile.status === 'rejected') {
          window.location.href = '/rejected'
        } else {
          window.location.href = `/${profile.role}`
        }
      }
    } catch (error) {
      toast.error("Si è verificato un errore imprevisto")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]" />

        <div className="absolute top-12 left-12">
           <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/20 transition-transform group-hover:rotate-12">
                M
              </div>
              <span className="text-3xl font-black tracking-tighter">Maestria</span>
            </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 text-center max-w-lg space-y-12"
        >
          <div className="space-y-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-9xl drop-shadow-2xl"
            >
              🇮🇹
            </motion.div>
            <h2 className="text-5xl font-black leading-tight tracking-tight italic">
              &quot;La lingua è lo specchio della mente.&quot;
            </h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </div>

          <p className="text-xl font-bold text-gray-400 max-w-md mx-auto leading-relaxed">
            Accedi per continuare el tuo percorso verso la padronanza dell&apos;italiano.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-12 opacity-50">
             {[1,2,3].map(i => (
               <div key={i} className="h-1 bg-white/20 rounded-full" />
             ))}
          </div>
        </motion.div>

        {/* Decorative corner element */}
        <div className="absolute -bottom-20 -right-20 opacity-10">
           <Sparkles className="h-96 w-96 text-primary" />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white relative">
        <div className="absolute top-8 left-8 lg:hidden">
           <Link href="/">
             <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12">
               <ArrowLeft className="h-6 w-6" />
             </Button>
           </Link>
        </div>

        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left space-y-3">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Accesso Protetto
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Accedi ora</h1>
            <p className="text-gray-500 font-bold text-lg">Benvenuto su <span className="text-primary">Maestria</span>, el futuro dell&apos;italiano.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1" htmlFor="email">
                Indirizzo Email
              </label>
              <Input
                id="email"
                placeholder="tuo@email.com"
                type="email"
                disabled={isLoading}
                className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 font-bold focus:bg-white focus:ring-primary/10 transition-all"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-secondary font-bold mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1" htmlFor="password">
                Password
              </label>
              <PasswordInput
                id="password"
                disabled={isLoading}
                className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 font-bold focus:bg-white transition-all"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-secondary font-bold mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              className="w-full bg-gray-900 hover:bg-black h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-gray-200 transition-all active:scale-95 group relative overflow-hidden border-none"
              disabled={isLoading}
              type="submit"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2 justify-center">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "ENTRA NEL SISTEMA"}
              </span>
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
              <span className="bg-white px-4 text-gray-300 italic tracking-widest font-black uppercase">oppure</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-gray-100 hover:border-primary/20 hover:bg-primary/5 h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all"
            disabled={isLoading}
            onClick={() => {}}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
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
            Continua con Google
          </Button>

          <p className="text-center text-sm font-bold text-gray-400">
            Non hai ancora un account? <br className="md:hidden" />
            <Link href="/register" className="text-primary font-black uppercase tracking-widest hover:underline ml-1">
              Registrati gratis &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
