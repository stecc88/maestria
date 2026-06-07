"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts'
import { Target } from "lucide-react"

interface RadarChartProps {
  data: any[]
}

export function RadarChart({ data }: RadarChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hasData = data && data.length > 0

  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-secondary" />
          <span>Profilo prestazionale</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center p-4 pt-0">
        {hasData && mounted ? (
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 25]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Studente"
                  dataKey="A"
                  stroke="#CE2B37"
                  fill="#CE2B37"
                  fillOpacity={0.5}
                />
              </RechartsRadarChart>
            </ResponsiveContainer>
          </div>
        ) : !hasData ? (
          <div className="text-center space-y-4 py-8">
            <div className="bg-cream rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Target className="h-8 w-8 text-gray-200" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">Nessun dato</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-[240px] flex items-center justify-center">
             <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
