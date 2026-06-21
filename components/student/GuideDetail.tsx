"use client"

import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ListChecks,
  Lightbulb,
  AlertTriangle,
  PenLine,
  ArrowRight
} from "lucide-react"
import { GuideContent } from "@/lib/constants/guides"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface GuideDetailProps {
  guide: GuideContent
}

export function GuideDetail({ guide }: GuideDetailProps) {
  return (
    <div className="h-full flex flex-col bg-cream/30">
      <header className="p-8 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary rounded-2xl text-white">
            <guide.icon className="h-6 w-6" />
          </div>
          <Badge className={cn(
            "font-bold border-none",
            guide.level.startsWith('A') ? "bg-green-500" :
            guide.level.startsWith('B') ? "bg-blue-500" : "bg-secondary"
          )}>
            {guide.level}
          </Badge>
        </div>
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">{guide.title}</h2>
        <p className="text-gray-500">{guide.description}</p>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-8 space-y-10 pb-20">
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900">
              <ListChecks className="h-5 w-5 text-primary" />
              Struttura consigliata
            </h3>
            <div className="grid gap-3">
              {guide.structure.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900">
              <Lightbulb className="h-5 w-5 text-accent" />
              Connettori utili
            </h3>
            <div className="flex flex-wrap gap-2">
              {guide.connectors.map((item, i) => (
                <Badge key={i} variant="secondary" className="bg-white border-accent/20 text-gray-700 font-medium italic py-2 px-4 text-sm">
                  {item}
                </Badge>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900">
              <AlertTriangle className="h-5 w-5 text-secondary" />
              Errori comuni da evitare
            </h3>
            <div className="space-y-2">
              {guide.commonErrors.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-secondary/5 border border-secondary/10 rounded-xl">
                  <XIcon className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <p className="text-sm text-secondary-dark">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900">
              <PenLine className="h-5 w-5 text-primary" />
              Esempio completo
            </h3>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
               <h4 className="font-bold text-sm text-primary mb-4 italic">&quot;{guide.example.title}&quot;</h4>
               <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap font-body leading-relaxed">
                 {guide.example.content}
               </div>
            </div>
          </section>
        </div>
      </ScrollArea>

      <footer className="p-6 bg-white border-t border-gray-100 mt-auto">
        <Link href={`/student/write?type=${guide.type}&level=${guide.level}`} className="block">
          <Button className="w-full bg-primary hover:bg-primary-dark py-6 text-lg font-bold gap-2 shadow-lg shadow-primary/20">
            Usa questo tipo scrivendo <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </footer>
    </div>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
