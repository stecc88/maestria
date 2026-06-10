"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { TrendingUp } from "lucide-react"

interface EvolutionChartProps {
  data: any[]
}

export function EvolutionChart({ data }: EvolutionChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hasData = data && data.length >= 2

  return (
    <Card className="border-gray-100 md:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>La tua evoluzione nel tempo</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col justify-center p-0 pt-6 min-h-[360px]">
        {hasData && mounted ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(str) => {
                    try {
                        return format(new Date(str), 'd MMM', { locale: it })
                    } catch (e) {
                        return ""
                    }
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  labelFormatter={(label) => {
                    try {
                        return format(new Date(label), 'PPP', { locale: it })
                    } catch (e) {
                        return ""
                    }
                  }}
                  formatter={(value: any, name: any, props: any) => [
                    <span key="score" className="font-bold text-primary">{value} pts</span>,
                    <span key="level">Livello: {props.payload.detected_level}</span>
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="writing_score"
                  stroke="#009246"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#009246', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#F5A623', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : !hasData ? (
          <div className="text-center space-y-4 py-12">
            <div className="bg-cream rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <TrendingUp className="h-10 w-10 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Non ci sono ancora dati sufficienti</p>
              <p className="text-xs text-gray-500 mt-1">Invia almeno 2 scritti per vedere il tuo grafico di evoluzione.</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
