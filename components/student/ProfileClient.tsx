"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User, Mail, Pencil, Check, X, Loader2, BookOpen,
  FileText, ClipboardCheck, Flame, GraduationCap, KeyRound
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { joinTeacherWithCode } from "@/app/actions/auth"
import toast from "react-hot-toast"
import { getLevelFromXP } from "@/lib/utils/levels"

interface ProfileClientProps {
  profile: any
  student: any
  teacherName: string | null
  writingsCount: number
  tasksCount: number
}

export function ProfileClient({ profile, student, teacherName, writingsCount, tasksCount }: ProfileClientProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [fullName, setFullName] = useState(profile.full_name || "")
  const [isSavingName, setIsSavingName] = useState(false)

  const [teacherCode, setTeacherCode] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [currentTeacherName, setCurrentTeacherName] = useState(teacherName)

  const levelInfo = getLevelFromXP(student.xp_points || 0)

  const handleSaveName = async () => {
    if (!fullName.trim()) return
    setIsSavingName(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("id", profile.id)

      if (error) throw error

      toast.success("Nome aggiornato")
      setIsEditingName(false)
    } catch (error: any) {
      toast.error(error.message || "Errore durante il salvataggio")
    } finally {
      setIsSavingName(false)
    }
  }

  const handleJoinTeacher = async () => {
    if (!teacherCode.trim()) return
    setIsJoining(true)
    try {
      const result = await joinTeacherWithCode(teacherCode.trim())
      if (!result.success) {
        toast.error(result.error || "Codice non valido")
        return
      }
      toast.success(`Iscritto alla classe di ${result.teacherName}!`)
      setCurrentTeacherName(result.teacherName || null)
      setTeacherCode("")
    } catch (error: any) {
      toast.error(error.message || "Errore durante l'iscrizione")
    } finally {
      setIsJoining(false)
    }
  }

  const initials = (fullName || "S").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          Il mio profilo
        </h1>
        <p className="text-muted-foreground mt-1">Gestisci le tue informazioni personali e controlla i tuoi progressi.</p>
      </header>

      {/* Datos personales */}
      <Card className="border-none shadow-sm rounded-3xl bg-card">
        <CardContent className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="h-20 w-20 border-2 border-border shrink-0">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-primary text-white font-bold text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 w-full space-y-4">
            <div>
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nome completo</Label>
              {isEditingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-muted border-border rounded-xl"
                    autoFocus
                  />
                  <Button size="icon" onClick={handleSaveName} disabled={isSavingName} className="bg-primary hover:bg-primary-dark rounded-xl shrink-0">
                    {isSavingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => { setIsEditingName(false); setFullName(profile.full_name || "") }} className="rounded-xl shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-bold text-foreground text-lg">{fullName || "Senza nome"}</p>
                  <button onClick={() => setIsEditingName(true)} className="text-muted-foreground hover:text-primary transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Mail className="h-4 w-4" />
              {profile.email}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-primary/10 text-primary border-none font-bold">
                {student.current_level || student.target_level}
              </Badge>
              <Badge className="bg-accent/10 text-accent-dark border-none font-bold">
                {levelInfo.current.badge} {levelInfo.current.name}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: GraduationCap, label: "XP totali", value: student.xp_points || 0, color: "text-primary" },
          { icon: Flame, label: "Giorni di serie", value: student.streak_days || 0, color: "text-secondary" },
          { icon: FileText, label: "Testi scritti", value: writingsCount, color: "text-blue-500" },
          { icon: ClipboardCheck, label: "Compiti completati", value: tasksCount, color: "text-accent-dark" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl bg-card">
            <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-2">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profesor / Clase */}
      <Card className="border-none shadow-sm rounded-3xl bg-card">
        <CardContent className="p-8 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            La tua classe
          </h3>

          {currentTeacherName ? (
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                {currentTeacherName[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sei nella classe di</p>
                <p className="font-bold text-foreground">{currentTeacherName}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Non sei ancora in nessuna classe. Inserisci il codice del tuo insegnante per iscriverti.
              </p>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Es: ITA2025"
                    value={teacherCode}
                    onChange={(e) => setTeacherCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleJoinTeacher()}
                    className="pl-10 bg-muted border-border rounded-xl uppercase tracking-widest font-bold"
                  />
                </div>
                <Button
                  onClick={handleJoinTeacher}
                  disabled={isJoining || !teacherCode.trim()}
                  className="bg-primary hover:bg-primary-dark rounded-xl font-bold shrink-0"
                >
                  {isJoining ? <Loader2 className="h-4 w-4 animate-spin" /> : "Iscriviti"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
