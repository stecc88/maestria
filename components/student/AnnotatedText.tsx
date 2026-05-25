"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface InlineCorrection {
  original: string
  corrected: string
  explanation: string
  error_type: 'gramatica' | 'vocabulario' | 'ortografia' | 'registro' | string
}

interface AnnotatedTextProps {
  originalText: string
  correctedText: string
  corrections: InlineCorrection[]
}

export function AnnotatedText({ originalText, correctedText, corrections }: AnnotatedTextProps) {
  const [showOriginal, setShowOriginal] = useState(false)

  // This function renders the corrected text with inline highlights and tooltips
  const renderAnnotatedText = () => {
    if (showOriginal) {
      return (
        <div className="prose prose-lg max-w-none font-body leading-relaxed text-gray-800">
          {originalText.split('\n').map((line, i) => (
            <p key={i} className="mb-4">{line}</p>
          ))}
        </div>
      )
    }

    // Sort corrections by length (descending) to minimize overlapping issues
    const sortedCorrections = [...corrections].sort((a, b) => b.corrected.length - a.corrected.length)

    // We'll build the text parts
    let parts: (string | React.ReactNode)[] = [correctedText]

    sortedCorrections.forEach((corr) => {
      const newParts: (string | React.ReactNode)[] = []

      parts.forEach((part) => {
        if (typeof part !== 'string') {
          newParts.push(part)
          return
        }

        const segments = part.split(corr.corrected)
        segments.forEach((segment, index) => {
          newParts.push(segment)
          if (index < segments.length - 1) {
            const colorClass =
              corr.error_type === 'gramatica' ? 'bg-red-100 border-red-300 text-red-900 decoration-red-400' :
              corr.error_type === 'vocabulario' ? 'bg-orange-100 border-orange-300 text-orange-900 decoration-orange-400' :
              corr.error_type === 'ortografia' ? 'bg-blue-100 border-blue-300 text-blue-900 decoration-blue-400' :
              'bg-purple-100 border-purple-300 text-purple-900 decoration-purple-400'

            newParts.push(
              <Tooltip key={`${corr.corrected}-${index}`}>
                <TooltipTrigger render={
                  <span className={cn(
                    "px-1 py-0.5 rounded cursor-help border-b-2 font-bold transition-colors",
                    colorClass
                  )}>
                    {corr.corrected}
                  </span>
                } />
                <TooltipContent className="p-4 max-w-xs space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                      {corr.error_type}
                    </Badge>
                    <span className="text-xs font-bold text-red-500 line-through">{corr.original}</span>
                  </div>
                  <p className="text-sm leading-snug">{corr.explanation}</p>
                </TooltipContent>
              </Tooltip>
            )
          }
        })
      })
      parts = newParts
    })

    return (
      <div className="prose prose-lg max-w-none font-body leading-relaxed text-gray-800 whitespace-pre-wrap">
        {parts}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gray-100 p-1 rounded-xl w-fit">
        <Button
          variant={showOriginal ? "ghost" : "default"}
          size="sm"
          className={cn("rounded-lg", !showOriginal && "bg-white text-gray-900 shadow-sm hover:bg-white")}
          onClick={() => setShowOriginal(false)}
        >
          Texto corregido
        </Button>
        <Button
          variant={!showOriginal ? "ghost" : "default"}
          size="sm"
          className={cn("rounded-lg", showOriginal && "bg-white text-gray-900 shadow-sm hover:bg-white")}
          onClick={() => setShowOriginal(true)}
        >
          Tu texto
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-gray-100 shadow-sm overflow-hidden">
          <CardContent className="p-8">
            {renderAnnotatedText()}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            Detalle de correcciones
            <Badge variant="secondary" className="bg-gray-100 text-gray-500">{corrections.length}</Badge>
          </h3>
          <div className="space-y-3">
            {corrections.map((c, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-lg bg-white border border-gray-100 items-start group hover:border-primary/20 transition-colors shadow-sm">
                 <div className={cn(
                   "shrink-0 w-1.5 h-12 rounded-full",
                   c.error_type === 'gramatica' ? 'bg-red-400' :
                   c.error_type === 'vocabulario' ? 'bg-orange-400' :
                   c.error_type === 'ortografia' ? 'bg-blue-400' :
                   'bg-purple-400'
                 )} />
                 <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                     <span className="text-[10px] font-bold uppercase text-gray-400">{c.error_type}</span>
                     <span className="text-xs text-gray-300">|</span>
                     <span className="text-xs font-medium text-red-400 line-through">{c.original}</span>
                   </div>
                   <p className="font-bold text-gray-900">{c.corrected}</p>
                   <p className="text-xs text-gray-500 mt-1">{c.explanation}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
