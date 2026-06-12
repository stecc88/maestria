import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Eye, Search, Filter } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils/date"

export default async function CorrectionsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Fetch ALL corrections for this student
  const { data: corrections, error } = await supabase
    .from("corrections")
    .select("*, writings!inner(student_id, title, writing_type)")
    .eq("writings.student_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
             <FileText className="h-8 w-8 text-primary" />
             Correzioni
          </h1>
          <p className="text-gray-500 mt-1">Archivio completo dei tuoi testi corretti e valutati.</p>
        </div>
      </header>

      {corrections && corrections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {corrections.map((correction) => (
            <Card
              key={correction.id}
              className="hover:border-primary/30 hover:shadow-xl transition-all duration-300 group overflow-hidden border-gray-100"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col items-center justify-center h-14 w-14 bg-primary/5 rounded-2xl border border-primary/10">
                    <span className="text-xl font-black text-primary leading-none">
                      {correction.overall_score}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase font-bold mt-1">pts</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase bg-gray-50 border-gray-100 text-gray-400">
                    {correction.writings.writing_type.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                      {correction.writings.title || 'Scritto senza titolo'}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                       <Badge className="bg-blue-500 text-white border-none text-[10px] font-black px-2">
                         {correction.detected_level}
                       </Badge>
                       <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(correction.created_at)}</span>
                       </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex justify-end">
                    <Link href={`/student/corrections/${correction.id}`}>
                      <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 font-bold gap-2">
                        Vedi analisi <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <FileText className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ancora nessuna correzione</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            Invia il tuo primo testo per ricevere una valutazione dettagliata dal nostro esaminatore AI.
          </p>
          <Link href="/student/write">
            <Button className="bg-primary hover:bg-primary-dark font-bold px-8">
              Inizia a scrivere ✍️
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
