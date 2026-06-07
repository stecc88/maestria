"use client"
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts'

interface RadarChartProps {
  data: any[]
}

export function RadarChart({ data }: RadarChartProps) {
  if (!data || data.length === 0) return null

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
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
    </div>
  )
}
