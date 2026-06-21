"use client"

import { useState } from "react"
import { TrendingUp, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { EvolutionChart } from "@/components/student/EvolutionChart"
import { RadarChart } from "@/components/student/RadarChart"

interface ProgressSectionProps {
  evolutionData: any[]
  radarData: any[]
}

/**
 * Antes: dos cards de gráficos lado a lado sin ninguna explicación de
 * qué mostraba cada uno o por qué había dos. Ahora: una sola sección con
 * un título claro y tabs, mostrando un gráfico a la vez con su propósito
 * explicado — reduce carga cognitiva y confusión, especialmente en mobile
 * donde antes los dos gráficos se apilaban sin contexto.
 */
export function ProgressSection({ evolutionData, radarData }: ProgressSectionProps) {
  const [active, setActive] = useState<"trend" | "skills">("trend")

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-foreground">I tuoi progressi</h2>
          <p className="text-xs text-muted-foreground font-medium">
            {active === "trend"
              ? "Come è cambiato il tuo punteggio nel tempo"
              : "Le tue competenze nelle ultime 5 correzioni"}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl w-fit">
          <button
            onClick={() => setActive("trend")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all",
              active === "trend" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"
            )}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Andamento
          </button>
          <button
            onClick={() => setActive("skills")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all",
              active === "skills" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"
            )}
          >
            <Target className="h-3.5 w-3.5" />
            Competenze
          </button>
        </div>
      </div>

      {active === "trend" ? (
        <EvolutionChart data={evolutionData} />
      ) : (
        <RadarChart data={radarData} />
      )}
    </div>
  )
}
