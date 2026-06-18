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

    // 1. Fetch correction and associated writing to verify ownership
    const { data: correction, error: fetchError } = await adminSupabase
      .from("corrections")
      .select("id, writing_id, writings(student_id)")
      .eq("id", correctionId)
      .single()

    if (fetchError || !correction) {
      console.error("Fetch error or correction not found:", fetchError)
      return NextResponse.json({ error: "Correzione non trovata" }, { status: 404 })
    }

    const writingsData = Array.isArray(correction.writings) ? correction.writings[0] : correction.writings;

    if (!writingsData || writingsData.student_id !== user.id) {
      return NextResponse.json({ error: "Non autorizzato a eliminare questa correzione" }, { status: 403 })
    }

    // 2. Clear any foreign key references in the tasks table
    // Some tasks might point to this correction_id. Set them to null before deleting.
    const { error: updateTasksError } = await adminSupabase
      .from("tasks")
      .update({ correction_id: null })
      .eq("correction_id", correctionId)

    if (updateTasksError) {
      console.error("Error clearing task references:", updateTasksError)
      // We continue as this might not be critical or the table might be empty
    }

    // 3. Delete the writing (which will cascade-delete the correction)
    // In our schema, corrections has ON DELETE CASCADE from writings
    const { error: deleteWritingError } = await adminSupabase
      .from("writings")
      .delete()
      .eq("id", correction.writing_id)

    if (deleteWritingError) {
      console.error("Error deleting writing:", deleteWritingError)
      throw deleteWritingError
    }

    // Double check: if cascade didn't work for some reason, delete correction explicitly
    await adminSupabase.from("corrections").delete().eq("id", correctionId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting correction:", error)
    return NextResponse.json({ error: error.message || "Errore durante l'eliminazione" }, { status: 500 })
  }
}
