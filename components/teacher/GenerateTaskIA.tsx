"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Sparkles,
  Bot,
  Send,
  Edit3,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import ReactMarkdown from 'react-markdown'

interface GenerateTaskIAProps {
  student: any
  recentWritings: any[]
}

export function GenerateTaskIA({ student, recentWritings }: GenerateTaskIAProps) {
  const profile = Array.isArray(student.profiles) ? student.profiles[0] : student.profiles;
  const fullName = profile?.full_name || "Studente";

  const [isGenerating, setIsGenerating] = useState(false)
  const [previewTask, setPreviewTask] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  const [selectedWritingId, setSelectedWritingId] = useState<string>("")
  const [exerciseType, setExerciseType] = useState("completamento")

  const handleGenerate = async () => {
    if (!selectedWritingId) {
      toast.error("Seleziona un testo per iniziare")
      return
    }

    const selectedWriting = recentWritings.find(w => w.id === selectedWritingId)
    const correction = selectedWriting?.corrections?.[0]

    if (!correction) {
      toast.error("Il testo selezionato non ha una correzione valida")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          writingId: selectedWritingId,
          exerciseType,
          errorCategories: correction.error_categories,
          studentLevel: correction.detected_level || student.current_level || student.target_level
        }),
      })

      const data = await response.json()
      if (data.title) {
        setPreviewTask(data)
        setIsEditing(false)
      } else {
        throw new Error(data.error || "Errore durante la generazione del compito")
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSend = async () => {
    const selectedWriting = recentWritings.find(w => w.id === selectedWritingId)
    const correctionId = selectedWriting?.corrections?.[0]?.id

    try {
      const response = await fetch("/api/send-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          task: previewTask,
          correctionId: correctionId,
          exerciseType
        }),
      })

      if (response.ok) {
        toast.success(`✅ Compito inviato a ${fullName}`)
        setPreviewTask(null)
      } else {
        throw new Error("Errore durante l'invio del compito")
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const ExerciseTypeChip = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setExerciseType(id)}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all font-bold text-xs",
        exerciseType === id
          ? "border-primary bg-primary text-white"
          : "border-border bg-card text-muted-foreground hover:border-primary/20"
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  )

  if (previewTask) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50 shadow-xl animate-in zoom-in-95 duration-300">
        <CardHeader className="bg-card border-b border-emerald-100 rounded-t-3xl">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Bot className="h-6 w-6 text-emerald-600" />
               <span className="text-emerald-900">Anteprima del Compito</span>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="text-emerald-700 hover:bg-emerald-50">
                  <Edit3 className="h-4 w-4 mr-2" /> {isEditing ? 'Salva' : 'Modifica'}
               </Button>
               <Button variant="outline" size="sm" onClick={() => setPreviewTask(null)} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">Scarta</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
           {previewTask.error_focus && (
             <div className="bg-emerald-100/50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                   <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Focus dell&apos;errore</p>
                   <p className="text-sm text-emerald-900 font-medium">{previewTask.error_focus}</p>
                </div>
             </div>
           )}

           <div className="space-y-4">
              <Label className="text-emerald-700 font-black uppercase text-xs tracking-widest">Titolo del compito</Label>
              {isEditing ? (
                <Input value={previewTask.title} onChange={e => setPreviewTask({...previewTask, title: e.target.value})} className="bg-card border-emerald-200 focus:ring-emerald-500" />
              ) : (
                <h3 className="text-2xl font-display font-bold text-emerald-950">{previewTask.title}</h3>
              )}
           </div>

           <div className="space-y-4">
              <Label className="text-emerald-700 font-black uppercase text-xs tracking-widest">Spiegazione Teorica</Label>
              {isEditing ? (
                <Textarea value={previewTask.theory_explanation} onChange={e => setPreviewTask({...previewTask, theory_explanation: e.target.value})} className="bg-card border-emerald-200 focus:ring-emerald-500 min-h-[150px]" />
              ) : (
                <div className="p-6 bg-card rounded-2xl border border-emerald-100 prose prose-sm max-w-none text-emerald-900">
                   <ReactMarkdown>{previewTask.theory_explanation}</ReactMarkdown>
                </div>
              )}
           </div>

           <div className="pt-6 border-t border-emerald-100 flex justify-end">
              <Button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 py-6 text-lg rounded-2xl gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]">
                 Invia a {fullName.split(' ')[0]} <Send className="h-5 w-5" />
              </Button>
           </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none bg-emerald-50 relative overflow-hidden shadow-sm">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Sparkles className="h-40 w-40 text-emerald-600" />
      </div>

      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-emerald-800">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <Bot className="h-6 w-6 text-emerald-600" />
          </div>
          Genera compito con l&apos;IA 🤖
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="font-bold text-emerald-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 bg-emerald-200 text-emerald-700 rounded-full text-[10px]">1</span>
              Basa su questo testo:
            </Label>
            <Select onValueChange={(value: string | null) => setSelectedWritingId(value || "")}>
              <SelectTrigger className="bg-card border-emerald-100 rounded-xl h-12">
                <SelectValue placeholder="Seleziona un testo..." />
              </SelectTrigger>
              <SelectContent>
                {recentWritings.map(w => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.title} ({w.corrections?.[0]?.overall_score} pts)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="font-bold text-emerald-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 bg-emerald-200 text-emerald-700 rounded-full text-[10px]">2</span>
              Tipo di esercizio:
            </Label>
            <div className="flex flex-wrap gap-2">
               <ExerciseTypeChip id="scrittura" label="Scrittura" icon={Edit3} />
               <ExerciseTypeChip id="completamento" label="Completamento" icon={CheckCircle2} />
               <ExerciseTypeChip id="trasformazione" label="Trasformazione" icon={Sparkles} />
               <ExerciseTypeChip id="riscrittura" label="Riscrittura" icon={Bot} />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedWritingId}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-8 text-xl rounded-2xl gap-3 shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                 <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>Analizzando errori e generando...</span>
              </>
            ) : (
              <>
                 Genera compito automaticamente ✨
              </>
            )}
          </Button>
          <p className="text-center text-[10px] text-emerald-600/60 mt-4 font-medium uppercase tracking-widest">
            L&apos;IA identificherà l&apos;errore principale e creerà un esercizio mirato
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
