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
import { Badge } from "@/components/ui/badge"

interface GenerateTaskIAProps {
  student: any
  recentWritings: any[]
  mostFrequentError: string
}

export function GenerateTaskIA({ student, recentWritings, mostFrequentError }: GenerateTaskIAProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewTask, setPreviewTask] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  const [selectedWritingId, setSelectedWritingId] = useState<string>("")
  const [errorType, setErrorType] = useState<string>(mostFrequentError || "gramatica")
  const [errorDetail, setErrorDetail] = useState("")
  const [exerciseType, setExerciseType] = useState("completar")
  const [additionalNotes, setAdditionalNotes] = useState("")

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          writingId: selectedWritingId,
          errorType,
          errorDetail,
          exerciseType,
          additionalNotes,
          studentLevel: student.current_level || student.target_level
        }),
      })

      const data = await response.json()
      if (data.title) {
        setPreviewTask(data)
        setIsEditing(false)
      } else {
        throw new Error(data.error || "Error al generar la tarea")
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSend = async () => {
    try {
      const response = await fetch("/api/send-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          task: previewTask,
          writingId: selectedWritingId
        }),
      })

      if (response.ok) {
        toast.success(`✅ Tarea enviada a ${student.profiles.full_name}`)
        setPreviewTask(null)
        // Reset form
      } else {
        throw new Error("Error al enviar la tarea")
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
          : "border-gray-100 bg-white text-gray-400 hover:border-primary/20"
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  )

  if (previewTask) {
    return (
      <Card className="border-primary/30 bg-primary/5 shadow-xl animate-in zoom-in-95 duration-300">
        <CardHeader className="bg-white border-b border-primary/10">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Bot className="h-6 w-6 text-primary" />
               <span>Preview de la Tarea</span>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit3 className="h-4 w-4 mr-2" /> {isEditing ? 'Bloquear' : 'Editar'}
               </Button>
               <Button variant="outline" size="sm" onClick={() => setPreviewTask(null)}>Descartar</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
           <div className="space-y-4">
              <Label className="text-primary font-black uppercase text-xs">Título de la tarea</Label>
              {isEditing ? (
                <Input value={previewTask.title} onChange={e => setPreviewTask({...previewTask, title: e.target.value})} className="bg-white" />
              ) : (
                <h3 className="text-2xl font-display font-bold text-gray-900">{previewTask.title}</h3>
              )}
           </div>

           <div className="space-y-4">
              <Label className="text-primary font-black uppercase text-xs">Explicación Teórica</Label>
              {isEditing ? (
                <Textarea value={previewTask.theory_explanation} onChange={e => setPreviewTask({...previewTask, theory_explanation: e.target.value})} className="bg-white min-h-[150px]" />
              ) : (
                <div className="p-6 bg-white rounded-2xl border border-primary/10 prose prose-sm max-w-none text-gray-700">
                   {previewTask.theory_explanation}
                </div>
              )}
           </div>

           <div className="pt-6 border-t border-primary/10 flex justify-end">
              <Button onClick={handleSend} className="bg-primary hover:bg-primary-dark font-bold px-10 py-6 text-lg rounded-2xl gap-2 shadow-lg shadow-primary/20">
                 Enviar a {student.profiles.full_name.split(' ')[0]} <Send className="h-5 w-5" />
              </Button>
           </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Bot className="h-32 w-32 text-primary" />
      </div>

      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-primary-dark">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Bot className="h-6 w-6" />
          </div>
          Generar tarea con IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-bold text-gray-700">1. Basar en este texto:</Label>
            <Select onValueChange={setSelectedWritingId}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Seleccionar un texto reciente..." />
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

          <div className="space-y-2">
            <Label className="font-bold text-gray-700">2. Error a trabajar:</Label>
            <Select value={errorType} onValueChange={setErrorType}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gramatica">Gramática</SelectItem>
                <SelectItem value="vocabulario">Vocabulario</SelectItem>
                <SelectItem value="ortografia">Ortografía</SelectItem>
                <SelectItem value="registro">Registro</SelectItem>
                <SelectItem value="estructura">Estructura</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-bold text-gray-700">3. Especificá el error (detalle):</Label>
          <Input
            placeholder="Ej: Uso del condicional simple, concordancia de género..."
            value={errorDetail}
            onChange={e => setErrorDetail(e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-bold text-gray-700 block mb-3">4. Tipo de ejercicio:</Label>
          <div className="flex flex-wrap gap-2">
             <ExerciseTypeChip id="escritura" label="Escritura" icon={Edit3} />
             <ExerciseTypeChip id="completar" label="Completar" icon={CheckCircle2} />
             <ExerciseTypeChip id="transformacion" label="Transformar" icon={Sparkles} />
             <ExerciseTypeChip id="reescritura" label="Reescribir" icon={Bot} />
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !errorDetail}
            className="w-full bg-primary hover:bg-primary-dark font-bold py-8 text-xl rounded-2xl gap-3 shadow-xl shadow-primary/20"
          >
            {isGenerating ? (
              <>
                 <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>Generando tarea mágica...</span>
              </>
            ) : (
              <>
                 Generar tarea con IA <Sparkles className="h-6 w-6" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
