"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  XCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { AuthProgress } from "@/components/auth/AuthProgress"
import { registerSchema, type RegisterValues } from "@/lib/validations/auth"
import { signUp, validateTeacherCode } from "@/app/actions/auth"
import { cn } from "@/lib/utils"

const levels = [
  { id: "A1", label: "A1", color: "bg-gray-100 border-gray-200 text-gray-600", desc: "Principiante" },
  { id: "A2", label: "A2", color: "bg-green-100 border-green-200 text-green-700", desc: "Elementare" },
  { id: "B1", label: "B1", color: "bg-blue-100 border-blue-200 text-blue-700", desc: "Intermedio" },
  { id: "B2", label: "B2", color: "bg-orange-100 border-orange-200 text-orange-700", desc: "Intermedio superiore" },
  { id: "C1", label: "C1", color: "bg-purple-100 border-purple-200 text-purple-700", desc: "Avanzato" },
  { id: "C2", label: "C2", color: "bg-yellow-100 border-yellow-200 text-yellow-700", desc: "Padronanza" },
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

  // Password strength indicator
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

  // Teacher code debounce check
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

      if (!result) {
        toast.error("Nessuna risposta ricevuta dal server")
        return
      }

      if (result.error) {
        if (result.error.includes("already registered") || result.error.includes("ya está registrado")) {
          form.setError("email", { message: "Questa email è già registrata. Prova ad accedere." })
        } else {
          toast.error("Errore: " + result.error)
        }
        return
      }

      if (result.success) {
        if (data.role === 'teacher') {
          toast.success("Account creato! Un amministratore lo revisionerà presto. Ti avviseremo via email.", { duration: 6000 })
        } else if (data.teacher_code) {
          toast.success("Account creato! Controlla la tua email per confermare il tuo account.", { duration: 6000 })
        } else {
          toast.success("Account creato! Un amministratore assegnerà il tuo account a un insegnante.", { duration: 6000 })
        }

        window.location.href = '/pending-approval'
      } else {
        toast.error("Risposta imprevista dal server")
      }
    } catch (error: any) {
      toast.error("Errore imprevisto: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const onError = React.useCallback((errors: any) => {
    const errorMessages = Object.entries(errors)
      .map(([field, error]: any) => `${field}: ${error.message}`)
      .join(', ')
    toast.error("Campi non validi: " + errorMessages)
  }, [])

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="mb-10 text-center">
           <Link href="/" className="flex items-center justify-center gap-1 mb-6">
              <span className="text-4xl font-display font-bold text-primary">M✦</span>
              <span className="text-2xl font-display font-bold text-foreground">Maestria</span>
            </Link>
            <AuthProgress currentStep={step} totalSteps={3} />
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-display font-bold text-center">Come vuoi usare Maestria?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    type="button"
                    onClick={() => { setValue("role", "student"); nextStep(); }}
                    className={cn(
                      "flex flex-col items-center p-8 rounded-2xl border-2 transition-all hover:border-primary",
                      role === "student" ? "border-primary bg-primary/5" : "border-muted"
                    )}
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <GraduationCap className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-xl font-display font-bold">Studente</span>
                    <p className="text-sm text-muted-foreground text-center mt-2">Voglio migliorare il mio italiano e ricevere correzioni.</p>
                    {role === "student" && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4"><CheckCircle2 className="text-primary" /></motion.div>}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setValue("role", "teacher"); nextStep(); }}
                    className={cn(
                      "flex flex-col items-center p-8 rounded-2xl border-2 transition-all hover:border-primary",
                      role === "teacher" ? "border-primary bg-primary/5" : "border-muted"
                    )}
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-xl font-display font-bold">Insegnante</span>
                    <p className="text-sm text-muted-foreground text-center mt-2">Voglio gestire i miei studenti e generare compiti.</p>
                    {role === "teacher" && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4"><CheckCircle2 className="text-primary" /></motion.div>}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome completo</label>
                    <Input {...register("full_name")} placeholder="Il tuo nome" />
                    {errors.full_name && <p className="text-xs text-secondary">{errors.full_name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Indirizzo email</label>
                    <Input {...register("email")} type="email" placeholder="tuo@email.com" />
                    {errors.email && <p className="text-xs text-secondary">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <PasswordInput {...register("password")} />
                    <div className="h-1.5 w-full bg-muted rounded-full mt-2 overflow-hidden">
                      <div className={cn("h-full transition-all duration-500", strengthColor)} style={{ width: `${strength}%` }} />
                    </div>
                    {errors.password && <p className="text-xs text-secondary">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Conferma password</label>
                    <PasswordInput {...register("confirm_password")} />
                    {errors.confirm_password && <p className="text-xs text-secondary">{errors.confirm_password.message}</p>}
                  </div>
                </div>

                {role === "student" && (
                  <div className="space-y-6 pt-4 border-t">
                    <div className="space-y-4">
                      <label className="text-sm font-medium">Livello obiettivo</label>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {levels.map((lvl) => (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => setValue("target_level", lvl.id)}
                            title={lvl.desc}
                            className={cn(
                              "h-12 rounded-lg border-2 flex items-center justify-center font-bold transition-all",
                              lvl.color,
                              watch("target_level") === lvl.id ? "ring-2 ring-primary ring-offset-2" : ""
                            )}
                          >
                            {lvl.label}
                          </button>
                        ))}
                      </div>
                      {errors.target_level && <p className="text-xs text-secondary">{errors.target_level.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Codice dell&apos;insegnante (opzionale)</label>
                      <div className="relative">
                        <Input {...register("teacher_code")} placeholder="Es: HER2025482" />
                        <div className="absolute right-3 top-2.5">
                          {teacherStatus.exists === true && <Check className="text-primary w-5 h-5" />}
                          {teacherStatus.exists === false && <XCircle className="text-secondary w-5 h-5" />}
                        </div>
                      </div>
                      {teacherStatus.exists === true && (
                        <p className="text-xs text-primary font-bold">✅ Insegnante: {teacherStatus.name}</p>
                      )}
                      {teacherStatus.exists === false && (
                        <p className="text-xs text-secondary font-bold">❌ Codice non trovato</p>
                      )}
                      <p className="text-xs text-muted-foreground">Chiedilo al tuo insegnante. Se non ne hai uno, puoi registrarti comunque.</p>
                    </div>
                  </div>
                )}

                {role === "teacher" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Istituzione o scuola</label>
                      <Input {...register("institution")} placeholder="Nome della scuola" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Breve descrizione</label>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        {...register("bio")}
                        placeholder="Parlaci di te..."
                      />
                      {errors.bio && <p className="text-xs text-secondary">{errors.bio.message}</p>}
                    </div>
                    <p className="text-xs p-3 bg-accent/10 text-accent-foreground rounded-lg border border-accent/20">
                      ⚠️ Il tuo account sarà revisionato e approvato da un amministratore nelle prossime 24 ore.
                    </p>
                  </div>
                )}

                <div className="flex justify-between gap-4 pt-4">
                  <Button type="button" variant="ghost" onClick={prevStep}>Indietro</Button>
                  <Button type="button" className="flex-grow" onClick={nextStep}>Continua</Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-muted/30 p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold border-b pb-2">Riepilogo registrazione</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-muted-foreground">Nome:</span>
                    <span className="font-medium text-right">{watch("full_name")}</span>
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-right">{watch("email")}</span>
                    <span className="text-muted-foreground">Ruolo:</span>
                    <span className="font-medium text-right text-primary capitalize">{role === 'student' ? 'Studente 👨‍🎓' : 'Insegnante 👨‍🏫'}</span>
                    {role === 'student' && (
                      <>
                        <span className="text-muted-foreground">Livello:</span>
                        <span className="font-medium text-right">{watch("target_level")}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-xl hover:bg-muted/20 transition-colors">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 rounded border-muted text-primary focus:ring-primary"
                    {...register("accept_terms")}
                  />
                  <label htmlFor="terms" className="text-sm cursor-pointer">
                    Accetto i <span className="text-primary underline">termini e le condizioni</span> e l&apos;informativa sulla privacy.
                  </label>
                </div>
                {errors.accept_terms && <p className="text-xs text-secondary">{errors.accept_terms.message}</p>}

                <div className="flex justify-between gap-4 pt-4">
                  <Button type="button" variant="ghost" disabled={isLoading} onClick={prevStep}>Indietro</Button>
                  <Button type="submit" className="flex-grow bg-primary hover:bg-primary-dark" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crea il mio account ✨
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  )
}
