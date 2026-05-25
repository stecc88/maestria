"use client"

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
import { es } from 'date-fns/locale'
import { TrendingUp } from "lucide-react"

interface EvolutionChartProps {
  data: any[]
}

export function EvolutionChart({ data }: EvolutionChartProps) {
  const hasData = data && data.length >= 2

  return (
    <Card className="border-gray-100 md:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>Tu evolución en el tiempo</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex flex-col justify-center">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(str) => format(new Date(str), 'd MMM', { locale: es })}
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
                labelFormatter={(label) => format(new Date(label), 'PPP', { locale: es })}
                formatter={(value: any, name: any, props: any) => [
                  <span key="score" className="font-bold text-primary">{value} pts</span>,
                  <span key="level">Nivel: {props.payload.detected_level}</span>
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
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-cream rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <TrendingUp className="h-10 w-10 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Aún no hay datos suficientes</p>
              <p className="text-xs text-gray-500 mt-1">Envía al menos 2 escritos para ver tu evolución gráfica.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
