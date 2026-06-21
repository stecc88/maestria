"use client"

import React, { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles, PenLine } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExerciseAreaProps {
  type: string
  instructions: string
  content: any
  onSubmit: (answer: string) => void
  isSubmitting: boolean
}

export function ExerciseArea({
  type,
  instructions,
  content,
  onSubmit,
  isSubmitting,
}: ExerciseAreaProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [textAnswer, setTextAnswer] = useState("")
  const [wordCount, setWordCount] = useState(0)

  // Determine actual type from content or props
  const exerciseType = content?.type || type

  useEffect(() => {
    if (exerciseType === "scrittura" || exerciseType === "riscrittura") {
      const words = textAnswer.trim().split(/\s+/).filter((w) => w.length > 0)
      setWordCount(words.length)
    }
  }, [textAnswer, exerciseType, type])

  const handleValueChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = () => {
    if (exerciseType === "completamento" || exerciseType === "trasformazione") {
      onSubmit(JSON.stringify(answers))
    } else {
      onSubmit(textAnswer)
    }
  }

  const isFormValid = () => {
    if (exerciseType === "completamento") {
      return content.items && Object.keys(answers).length === content.items.length
    }
    if (exerciseType === "trasformazione") {
      return content.items && Object.keys(answers).length === content.items.length
    }
    if (exerciseType === "scrittura") {
      return wordCount >= (content.min_words || 10)
    }
    return textAnswer.length > 10
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <PenLine className="h-6 w-6 text-primary" />
          Esercizio
        </h2>
        <div className="p-4 bg-card rounded-xl border border-border text-foreground/90 leading-relaxed">
          {instructions}
        </div>
      </div>

      <div className="space-y-6">
        {/* COMPLETAMENTO */}
        {exerciseType === "completamento" && content.items && (
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
            {content.items.map((item: any) => (
              <div key={item.id} className="flex flex-wrap items-center gap-2 text-lg py-2 border-b border-border last:border-0">
                <span className="text-muted-foreground text-sm font-bold w-6">{item.id}.</span>
                <span>{item.sentence_before}</span>
                <Select onValueChange={(val: string | null) => handleValueChange(item.id.toString(), val || "")}>
                  <SelectTrigger className="w-[180px] h-9 border-primary/20 bg-primary/5 font-bold">
                    <SelectValue placeholder="..." />
                  </SelectTrigger>
                  <SelectContent>
                    {item.options.map((opt: string) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>{item.sentence_after}</span>
              </div>
            ))}
          </div>
        )}

        {/* TRASFORMAZIONE */}
        {exerciseType === "trasformazione" && content.items && (
          <div className="space-y-4">
            {content.items.map((item: any) => (
              <div key={item.id} className="p-6 bg-card rounded-2xl border border-border shadow-sm space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">Frase {item.id}</span>
                  <span className="text-xs font-bold text-muted-foreground italic">{item.instruction}</span>
                </div>
                <p className="text-muted-foreground italic">&quot;{item.original_sentence}&quot;</p>
                <Textarea
                  placeholder="Scrivi qui la trasformazione..."
                  className="bg-gray-50/50 border-border focus:bg-card transition-colors"
                  onChange={(e) => handleValueChange(item.id.toString(), e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* RISCRITTURA */}
        {exerciseType === "riscrittura" && (
          <div className="space-y-6">
            <div className="p-6 bg-muted rounded-2xl border border-border">
              <Label className="text-[10px] font-black text-muted-foreground uppercase block mb-3 tracking-[0.2em]">
                TESTO DA CORREGGERE
              </Label>
              <p className="text-muted-foreground italic leading-relaxed">{content.original_text}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-bold text-primary">Istruzione: {content.instruction}</p>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">La tua versione</Label>
              <Textarea
                placeholder="Riscrivi il testo correttamente..."
                className="min-h-[300px] text-lg leading-relaxed p-6"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* SCRITTURA */}
        {exerciseType === "scrittura" && (
          <div className="space-y-6">
            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
              <Label className="text-[10px] font-black text-primary/60 uppercase block mb-2 tracking-[0.2em]">
                CONSEGNA
              </Label>
              <p className="text-foreground font-medium text-lg">{content.prompt}</p>
              <div className="flex gap-4 mt-4">
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Min: {content.min_words} parole</span>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Max: {content.max_words} parole</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Il tuo testo</Label>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  wordCount < content.min_words ? "text-orange-500" : "text-primary"
                )}>
                  {wordCount} / {content.max_words} Parole
                </span>
              </div>
              <Textarea
                placeholder="Scrivi qui il tuo testo..."
                className="min-h-[400px] text-lg leading-relaxed p-8"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Legacy types support */}
        {!exerciseType && (
           <div className="space-y-4">
              <Textarea
                placeholder="Scrivi qui la tua risposta..."
                className="min-h-[200px]"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
              />
           </div>
        )}
      </div>

      <Button
        size="lg"
        className="w-full py-8 text-xl font-bold bg-primary hover:bg-primary-dark shadow-xl shadow-primary/20 group rounded-2xl"
        onClick={handleSubmit}
        disabled={isSubmitting || !isFormValid()}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Verifica in corso...</span>
          </div>
        ) : (
          <span className="flex items-center gap-2">
            Invia esercizio <Sparkles className="h-6 w-6 group-hover:animate-bounce" />
          </span>
        )}
      </Button>
    </div>
  )
}
