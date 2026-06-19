"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FileText, History, X } from "lucide-react"

interface InlineCorrection {
  original: string
  corrected: string
  explanation: string
  error_type: string
}

interface AnnotatedTextProps {
  originalText: string
  correctedText: string
  corrections: InlineCorrection[]
}

const getCategoryStyle = (type: string) => {
  const t = (type || "").toLowerCase()
  if (t.includes("gramm")) return { text: "text-secondary", underline: "border-secondary/40", dot: "bg-secondary", label: "Grammatica" }
  if (t.includes("lessic")) return { text: "text-accent-dark", underline: "border-accent/40", dot: "bg-accent", label: "Lessico" }
  if (t.includes("ortograf")) return { text: "text-blue-600", underline: "border-blue-400/40", dot: "bg-blue-400", label: "Ortografia" }
  if (t.includes("registro")) return { text: "text-purple-600", underline: "border-purple-400/40", dot: "bg-purple-400", label: "Registro" }
  return { text: "text-gray-600", underline: "border-gray-300", dot: "bg-gray-400", label: type || "Altro" }
}

function CorrectionPopover({ corr, anchorEl, onClose }: { corr: InlineCorrection; anchorEl: HTMLElement; onClose: () => void }) {
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const popRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const rect = anchorEl.getBoundingClientRect()
      const popoverWidth = 288
      let left = rect.left + window.scrollX
      const viewportWidth = window.innerWidth
      if (left + popoverWidth > viewportWidth - 16) {
        left = viewportWidth - popoverWidth - 16
      }
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: Math.max(16, left),
      })
    }
    update()
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
    }
  }, [anchorEl])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node) && e.target !== anchorEl) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [anchorEl, onClose])

  const style = getCategoryStyle(corr.error_type)

  return createPortal(
    <motion.div
      ref={popRef}
      initial={{ opacity: 0, y: -6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      style={{ position: "absolute", top: pos.top, left: pos.left, zIndex: 9999 }}
      className="w-72 bg-gray-900 text-white rounded-2xl shadow-2xl p-4 space-y-2.5 not-italic font-normal"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", style.dot)} />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {style.label}
          </span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <span className="line-through text-gray-500">{corr.original}</span>
        <span className="text-gray-400">→</span>
        <span className="font-bold text-white">{corr.corrected}</span>
      </div>
      <p className="text-[13px] leading-relaxed text-gray-300">{corr.explanation}</p>
    </motion.div>,
    document.body
  )
}

export function AnnotatedText({ originalText, correctedText, corrections }: AnnotatedTextProps) {
  const [showOriginal, setShowOriginal] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const usedCategories = Array.from(new Set(corrections.map(c => c.error_type))).filter(Boolean)

  const closePopover = () => {
    setActiveIndex(null)
    setAnchorEl(null)
  }

  const buildParts = (sourceText: string, mode: "corrected" | "original") => {
    const sorted = corrections
      .map((c, i) => ({ ...c, _i: i }))
      .sort((a, b) => (mode === "corrected" ? b.corrected.length - a.corrected.length : b.original.length - a.original.length))

    let parts: (string | React.ReactNode)[] = [sourceText]

    sorted.forEach((corr) => {
      const target = mode === "corrected" ? corr.corrected : corr.original
      if (!target) return

      const newParts: (string | React.ReactNode)[] = []

      parts.forEach((part) => {
        if (typeof part !== "string") {
          newParts.push(part)
          return
        }

        const segments = part.split(target)
        segments.forEach((segment, segIndex) => {
          newParts.push(segment)
          if (segIndex < segments.length - 1) {
            const style = getCategoryStyle(corr.error_type)

            newParts.push(
              <button
                key={`${corr._i}-${segIndex}-${mode}`}
                type="button"
                onClick={(e) => {
                  if (activeIndex === corr._i) {
                    closePopover()
                  } else {
                    setActiveIndex(corr._i)
                    setAnchorEl(e.currentTarget)
                  }
                }}
                className={cn(
                  "cursor-pointer font-bold transition-all px-0.5 rounded-sm border-b-2 hover:bg-gray-50 outline-none",
                  style.underline,
                  style.text,
                  mode === "original" && "line-through opacity-70"
                )}
              >
                {target}
              </button>
            )
          }
        })
      })
      parts = newParts
    })

    return parts
  }

  const parts = buildParts(showOriginal ? originalText : correctedText, showOriginal ? "original" : "corrected")
  const activeCorrection = activeIndex !== null ? corrections[activeIndex] : null

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-1 rounded-2xl w-fit">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-xl gap-2 font-bold text-xs px-4 h-9 transition-all",
              !showOriginal ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
            onClick={() => { setShowOriginal(false); closePopover() }}
          >
            <FileText className="h-3.5 w-3.5" />
            Testo corretto
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-xl gap-2 font-bold text-xs px-4 h-9 transition-all",
              showOriginal ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
            onClick={() => { setShowOriginal(true); closePopover() }}
          >
            <History className="h-3.5 w-3.5" />
            Testo originale
          </Button>
        </div>

        {usedCategories.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap text-[11px] text-gray-500">
            {usedCategories.map((cat) => {
              const style = getCategoryStyle(cat)
              return (
                <div key={cat} className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", style.dot)} />
                  <span className="font-semibold">{style.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-400 italic px-1">
        💡 Tocca una parola sottolineata per vedere la spiegazione
      </p>

      <div className="relative font-mono text-base md:text-lg leading-[2.1] text-gray-800 whitespace-pre-wrap">
        {parts}
      </div>

      <AnimatePresence>
        {activeCorrection && anchorEl && (
          <CorrectionPopover corr={activeCorrection} anchorEl={anchorEl} onClose={closePopover} />
        )}
      </AnimatePresence>
    </div>
  )
}
