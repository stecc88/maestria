"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Eye, FileText } from "lucide-react"
import Link from "next/link"

interface StudentWritingHistoryProps {
  writings: any[]
}

export function StudentWritingHistory({ writings }: StudentWritingHistoryProps) {
  return (
    <Card className="border-gray-100 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-gray-50 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Historial de escritos</CardTitle>
        <Badge variant="outline" className="font-bold">{writings.length} textos</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Tipo / Título</th>
                <th className="px-6 py-4">Nivel (Obj/Det)</th>
                <th className="px-6 py-4">Puntaje</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {writings.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                    {format(new Date(w.submitted_at), 'd MMM yyyy', { locale: es })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 line-clamp-1">{w.title}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{w.writing_type.replace('_', ' ')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                       <Badge variant="outline" className="text-[9px] h-5 border-gray-200">{w.target_level}</Badge>
                       <span className="text-gray-300">→</span>
                       <Badge className="text-[9px] h-5 bg-primary text-white border-none">{w.corrections?.[0]?.detected_level || '-'}</Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-lg font-black text-gray-700">{w.corrections?.[0]?.overall_score || '-'}</span>
                     <span className="text-[8px] font-bold text-gray-400 uppercase ml-1">pts</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {w.corrections?.[0]?.id && (
                      <Link href={`/student/corrections/${w.corrections[0].id}`}>
                        <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                           <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
              {writings.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-gray-400 italic">No hay escritos enviados aún.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
