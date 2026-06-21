"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Activity } from "lucide-react"

interface ActivityBarChartProps {
  data: any[]
}

export function ActivityBarChart({ data }: ActivityBarChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="border-border h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span>Attività studenti — ultimi 14 giorni</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div style={{ width: '100%', height: 300 }}>
          {mounted ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="scritti" name="Scritti" stackId="a" fill="#009246" radius={[4, 4, 0, 0]} />
                <Bar dataKey="compiti" name="Compiti" stackId="a" fill="#F5A623" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
