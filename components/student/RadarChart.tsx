"use client"

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
  const hasData = data && data.length > 0

  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Target className="h-4 w-4 text-secondary" />
          <span>Il tuo profilo</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full flex flex-col justify-center p-0">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
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
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-cream rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <Target className="h-10 w-10 text-gray-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Nessun dato</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
