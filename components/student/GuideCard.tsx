"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { GuideDetail } from "./GuideDetail"
import { GuideContent } from "@/lib/constants/guides"

interface GuideCardProps {
  guide: GuideContent
  isFavorite: boolean
  onToggleFavorite: () => void
  featured?: boolean
}

export function GuideCard({ guide, isFavorite, onToggleFavorite, featured }: GuideCardProps) {
  const typeLabels: Record<string, string> = {
    email_formal: "Email formale",
    email_informal: "Email informale",
    narrativo: "Narrativo",
    descriptivo: "Descrittivo",
    argumentativo: "Argomentativo",
    reclamo: "Reclamo",
    articulo: "Articolo",
    libre: "Libero"
  }

  return (
    <Sheet>
      <Card className={cn(
        "group h-full flex flex-col transition-all duration-300 border-border",
        featured ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5" : "bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
      )}>
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300",
              featured ? "bg-primary text-white" : "bg-cream text-primary"
            )}>
              <guide.icon className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isFavorite ? "text-accent bg-accent/10" : "text-gray-300 hover:text-accent hover:bg-accent/5"
                )}
                aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                title={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
              >
                <Star className={cn("h-4 w-4", isFavorite && "fill-accent")} />
              </button>
              <Badge className={cn(
                "font-bold border-none",
                guide.level.startsWith('A') ? "bg-green-500" :
                guide.level.startsWith('B') ? "bg-blue-500" : "bg-secondary"
              )}>
                {guide.level}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {guide.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {guide.description}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest bg-muted border-border text-muted-foreground">
              {typeLabels[guide.type] || guide.type.replace('_', ' ')}
            </Badge>
            <SheetTrigger render={
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 gap-2 font-bold p-0">
                Vedi guida <ArrowRight className="h-4 w-4" />
              </Button>
            } />
          </div>
        </CardContent>
      </Card>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
        <GuideDetail guide={guide} />
      </SheetContent>
    </Sheet>
  )
}
