"use client"

import React, { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sparkles, PenLine, RefreshCw, ClipboardList, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExerciseAreaProps {
  type: 'escritura' | 'completar' | 'transformacion' | 'reescritura' | string
  instructions: string
  content: any
  onSubmit: (answer: string) => void
  isSubmitting: boolean
}

export function ExerciseArea({ type, instructions, content, onSubmit, isSubmitting }: ExerciseAreaProps) {
  const [answer, setAnswer] = useState("")
  const [wordCount, setWordCount] = useState(0)

  // For 'completar' type
  const [blanks, setBlanks] = useState<Record<number, string>>({})

  // For 'transformacion' type
  const [sentences, setSentences] = useState<Record<number, string>>({})

  useEffect(() => {
    if (type === 'escritura' || type === 'reescritura') {
      const words = answer.trim().split(/\s+/).filter(w => w.length > 0)
      setWordCount(words.length)
    }
  }, [answer, type])

  const handleBlankChange = (index: number, value: string) => {
    const newBlanks = { ...blanks, [index]: value }
    setBlanks(newBlanks)
    // Combine blanks for the final answer
    setAnswer(JSON.stringify(newBlanks))
  }

  const handleSentenceChange = (index: number, value: string) => {
    const newSentences = { ...sentences, [index]: value }
    setSentences(newSentences)
    setAnswer(JSON.stringify(newSentences))
  }

  const handleSubmit = () => {
    onSubmit(answer)
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
           <PenLine className="h-6 w-6 text-primary" />
           Tu ejercicio
        </h2>
        <div className="p-4 bg-white rounded-xl border border-gray-100 text-gray-700 leading-relaxed">
          {instructions}
        </div>
      </div>

      <div className="space-y-4">
        {type === 'escritura' && (
          <div className="space-y-2">
            <div className="flex justify-between items-end mb-2">
              <Label className="font-bold">Respuesta</Label>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{wordCount} palabras</span>
            </div>
            <Textarea
              placeholder="Scrivi qui..."
              className="min-h-[300px] text-lg leading-relaxed focus:ring-primary"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
        )}

        {type === 'completar' && (
           <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm leading-loose text-lg">
             {/* Content for completion tasks is usually a string with [___] markers */}
             {typeof content === 'string' ? content.split('[___]').map((part, i, arr) => (
               <React.Fragment key={i}>
                 {part}
                 {i < arr.length - 1 && (
                   <Input
                     className="inline-block w-32 h-8 mx-2 border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0 focus:border-primary text-primary font-bold text-center"
                     value={blanks[i] || ""}
                     onChange={(e) => handleBlankChange(i, e.target.value)}
                   />
                 )}
               </React.Fragment>
             )) : "Contenido de ejercicio inválido"}
           </div>
        )}

        {type === 'transformacion' && (
          <div className="space-y-6">
            {Array.isArray(content) && content.map((item: any, i: number) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <p className="text-gray-500 font-medium italic">Original: {item.original}</p>
                <div className="space-y-2">
                   <Label className="text-xs font-bold text-primary uppercase">Tu respuesta:</Label>
                   <Input
                     placeholder={item.hint || "Transformá la oración..."}
                     className="border-gray-200 focus:ring-primary h-12 text-lg"
                     value={sentences[i] || ""}
                     onChange={(e) => handleSentenceChange(i, e.target.value)}
                   />
                </div>
              </div>
            ))}
          </div>
        )}

        {type === 'reescritura' && (
          <div className="grid gap-6">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
               <Label className="text-xs font-bold text-gray-400 uppercase block mb-3 tracking-widest">Texto original con errores</Label>
               <div className="prose prose-sm max-w-none text-gray-600 italic">
                 {content}
               </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Tu versión corregida</Label>
              <Textarea
                placeholder="Reescribí el texto corrigiendo los errores..."
                className="min-h-[250px] text-lg leading-relaxed focus:ring-primary bg-white"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <Button
        size="lg"
        className="w-full py-8 text-xl font-bold bg-primary hover:bg-primary-dark shadow-xl shadow-primary/20 group"
        onClick={handleSubmit}
        disabled={isSubmitting || answer.length < 5}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-3">
             <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             <span>Revisando tu respuesta...</span>
          </div>
        ) : (
          <span className="flex items-center gap-2">
            Entregar ejercicio <Sparkles className="h-6 w-6 group-hover:animate-bounce" />
          </span>
        )}
      </Button>
    </div>
  )
}
