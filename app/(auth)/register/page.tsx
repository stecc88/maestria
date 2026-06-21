"use client"

import * as React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import {
  Loader2,
  User,
  GraduationCap,
  Check,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { AuthProgress } from "@/components/auth/AuthProgress"
import { registerSchema, type RegisterValues } from "@/lib/validations/auth"
import { signUp, validateTeacherCode } from "@/app/actions/auth"
import { cn } from "@/lib/utils"

const levels = [
  { id: "A1", label: "A1", gradient: "from-gray-400 to-gray-600", bg: "bg-gray-50", desc: "Principiante" },
  { id: "A2", label: "A2", gradient: "from-emerald-400 to-emerald-600", bg: "bg-emerald-50", desc: "Elementare" },
  { id: "B1", label: "B1", gradient: "from-blue-400 to-blue-600", bg: "bg-blue-50", desc: "Intermedio" },
  { id: "B2", label: "B2", gradient: "from-purple-400 to-purple-600", bg: "bg-purple-50", desc: "Intermedio superiore" },
  { id: "C1", label: "C1", gradient: "from-orange-400 to-orange-600", bg: "bg-orange-50", desc: "Avanzato" },
  { id: "C2", label: "C2", gradient: "from-red-400 to-red-600", bg: "bg-red-50", desc: "Padronanza" },
] as const

export default function RegisterPage() {
  const [step, setStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [teacherStatus, setTeacherStatus] = React.useState<{ exists?: boolean; name?: string }>({})

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
      accept_terms: false,
    }
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form

  const role = watch("role")
  const password = watch("password") || ""
  const teacherCode = watch("teacher_code")

  const getPasswordStrength = React.useCallback((pwd: string) => {
    if (!pwd) return 0
    let strength = 0
    if (pwd.length >= 8) strength += 25
    if (/[A-Z]/.test(pwd)) strength += 25
    if (/[0-9]/.test(pwd)) strength += 25
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25
    return strength
  }, [])

  const strength = React.useMemo(() => getPasswordStrength(password), [password, getPasswordStrength])
  const strengthColor = strength <= 25 ? "bg-secondary" : strength <= 75 ? "bg-accent" : "bg-primary"

  React.useEffect(() => {
    if (role !== 'student' || !teacherCode || teacherCode.length < 5) {
      setTeacherStatus({})
      return
    }

    const timer = setTimeout(async () => {
      const result = await validateTeacherCode(teacherCode)
      setTeacherStatus({ exists: result.exists, name: result.teacherName })
    }, 500)

    return () => clearTimeout(timer)
  }, [teacherCode, role])

  async function onSubmit(data: RegisterValues) {
    setIsLoading(true)
    try {
      const result = await signUp(data)
      if (result?.success) {
        window.location.href = '/pending-approval'
      } else if (result?.error) {
        toast.error(result.error)
      }
    } catch (error: any) {
      toast.error("Errore imprevisto")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 p-8 md:p-16 border border-gray-50 relative">
        <div className="absolute top-10 right-10">
           <Link href="/">
             <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black hover:scale-110 transition-transform">
               M
             </div>
           </Link>
        </div>

        <div className="mb-12 text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mx-auto">
              <Sparkles className="h-3.5 w-3.5" /> Registrazione Premium
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Crea el tuo account</h1>
            <AuthProgress currentStep={step} totalSteps={3} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    type="button"
                    onClick={() => { setValue("role", "student"); setStep(2); }}
                    className={cn(
                      "group relative flex flex-col items-center p-10 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden",
                      role === "student" ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-gray-100 hover:border-primary/20"
                    )}
                  >
                    <div className="p-4 bg-primary/10 rounded-2xl mb-4 group-hover:rotate-12 transition-transform">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-xl font-black text-gray-900">Studente</span>
                    <p className="text-xs text-gray-400 text-center mt-2 font-bold leading-relaxed">Impara l&apos;italiano con l&apos;analisi IA.</p>
                    {role === "student" && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-1 bg-primary rounded-full"><Check className="text-white h-4 w-4" /></motion.div>}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setValue("role", "teacher"); setStep(2); }}
                    className={cn(
                      "group relative flex flex-col items-center p-10 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden",
                      role === "teacher" ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-gray-100 hover:border-primary/20"
                    )}
                  >
                    <div className="p-4 bg-blue-100 rounded-2xl mb-4 group-hover:rotate-12 transition-transform">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <span className="text-xl font-black text-gray-900">Docente</span>
                    <p className="text-xs text-gray-400 text-center mt-2 font-bold leading-relaxed">Gestisci classi e genera compiti.</p>
                    {role === "teacher" && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-1 bg-primary rounded-full"><Check className="text-white h-4 w-4" /></motion.div>}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Nome Completo</label>
                    <Input {...register("full_name")} placeholder="Mario Rossi" className="h-12 rounded-xl bg-gray-50/50 border-gray-100 px-4 font-bold focus:bg-white" />
                    {errors.full_name && <p className="text-xs text-secondary font-bold">{errors.full_name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                    <Input {...register("email")} type="email" placeholder="mario@email.it" className="h-12 rounded-xl bg-gray-50/50 border-gray-100 px-4 font-bold focus:bg-white" />
                    {errors.email && <p className="text-xs text-secondary font-bold">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                    <PasswordInput {...register("password")} className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:bg-white" />
                    <div className="h-1 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div className={cn("h-full transition-all duration-500", strengthColor)} style={{ width: `${strength}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Conferma</label>
                    <PasswordInput {...register("confirm_password")} className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:bg-white" />
                  </div>
                </div>

                {role === "student" && (
                  <div className="space-y-8 pt-6 border-t border-gray-50">
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Obiettivo QCER</label>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {levels.map((lvl) => (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => setValue("target_level", lvl.id)}
                            className={cn(
                              "h-12 rounded-xl border-2 flex items-center justify-center font-black transition-all text-sm",
                              watch("target_level") === lvl.id
                                ? "border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                : "border-gray-100 bg-gray-50/50 text-gray-400 hover:border-primary/20"
                            )}
                          >
                            {lvl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Codice Docente <span className="opacity-50">(Opzionale)</span></label>
                      <div className="relative">
                        <Input {...register("teacher_code")} placeholder="Es: ITA2025" className="h-12 rounded-xl bg-gray-50/50 border-gray-100 px-4 font-black uppercase tracking-widest focus:bg-white" />
                        <div className="absolute right-3 top-3">
                          {teacherStatus.exists === true && <CheckCircle2 className="text-primary w-6 h-6" />}
                          {teacherStatus.exists === false && <XCircle className="text-secondary w-6 h-6" />}
                        </div>
                      </div>
                      {teacherStatus.name && <p className="text-xs text-primary font-black uppercase tracking-widest mt-2 ml-1">Docente: {teacherStatus.name}</p>}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <Button type="button" variant="ghost" className="h-14 px-8 rounded-xl font-black uppercase text-xs tracking-widest" onClick={() => setStep(1)}>Indietro</Button>
                  <Button type="button" className="flex-grow h-14 bg-gray-900 hover:bg-black rounded-xl font-black uppercase text-xs tracking-widest text-white shadow-xl shadow-gray-200 transition-all" onClick={() => setStep(3)}>Prossimo Passo <ChevronRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-200 pb-4">Conferma Dati</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nome</span>
                      <span className="font-black text-gray-900">{watch("full_name")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ruolo</span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest">{role}</span>
                    </div>
                    {role === 'student' && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Livello</span>
                        <span className="font-black text-gray-900">{watch("target_level")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 border-2 border-gray-50 rounded-[1.5rem] hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="relative h-6 w-6 shrink-0 mt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
                      {...register("accept_terms")}
                    />
                    <div className="absolute inset-0 border-2 border-gray-200 rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                       <Check className="h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <label htmlFor="terms" className="text-sm font-bold text-gray-500 leading-relaxed cursor-pointer select-none">
                    Accetto i <span className="text-primary font-black underline">termini di servizio</span> e confermo di aver letto l&apos;informativa sulla privacy.
                  </label>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="button" variant="ghost" className="h-14 px-8 rounded-xl font-black uppercase text-xs tracking-widest" onClick={() => setStep(2)}>Indietro</Button>
                  <Button type="submit" disabled={isLoading} className="flex-grow h-14 bg-gray-900 hover:bg-black rounded-xl font-black uppercase text-xs tracking-widest text-white shadow-xl shadow-gray-200 relative group overflow-hidden border-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                       {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>CREA IL MIO ACCOUNT <Sparkles className="h-4 w-4" /></>}
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="mt-12 text-center text-sm font-bold text-gray-400">
           Hai già un account?
           <Link href="/login" className="text-primary font-black uppercase tracking-widest hover:underline ml-2">
             Accedi &rarr;
           </Link>
        </p>
      </div>
    </div>
  )
}
