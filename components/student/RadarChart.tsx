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
    <Card className="border-gray-100 md:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Target className="h-5 w-5 text-secondary" />
          <span>Tus fortalezas y áreas a mejorar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex flex-col justify-center">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 25]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Alumno"
                dataKey="A"
                stroke="#CE2B37"
                fill="#CE2B37"
                fillOpacity={0.6}
              />
            </RechartsRadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-cream rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <Target className="h-10 w-10 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Sin datos de evaluación</p>
              <p className="text-xs text-gray-500 mt-1">Completa tu primera evaluación para ver el análisis de competencias.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
