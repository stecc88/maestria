import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })

  try {
    const { correctionId } = await request.json()
    if (!correctionId) return NextResponse.json({ error: "ID correzione mancante" }, { status: 400 })

    const adminSupabase = createAdminClient()

    // Verificar que la corrección pertenece al alumno autenticado antes de borrar
    const { data: correction, error: fetchError } = await adminSupabase
      .from("corrections")
      .select("id, writing_id, writings(student_id)")
      .eq("id", correctionId)
      .single()

    if (fetchError || !correction) {
      return NextResponse.json({ error: "Correzione non trovata" }, { status: 404 })
    }

    const writingsData = Array.isArray(correction.writings) ? correction.writings[0] : correction.writings;

    if (!writingsData || writingsData.student_id !== user.id) {
      return NextResponse.json({ error: "Non autorizzato a eliminare questa correzione" }, { status: 403 })
    }

    // Borrar la corrección y el writing asociado
    const { error: deleteCorrError } = await adminSupabase.from("corrections").delete().eq("id", correctionId)
    if (deleteCorrError) throw deleteCorrError

    const { error: deleteWritingError } = await adminSupabase.from("writings").delete().eq("id", correction.writing_id)
    if (deleteWritingError) throw deleteWritingError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting correction:", error)
    return NextResponse.json({ error: error.message || "Errore durante l'eliminazione" }, { status: 500 })
  }
}
