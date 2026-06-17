import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  try {
    const { taskId } = await request.json()

    if (!taskId) {
      return NextResponse.json({ error: "ID del compito mancante" }, { status: 400 })
    }

    // Verify task ownership
    const { data: task, error: fetchError } = await adminSupabase
      .from("tasks")
      .select("teacher_id")
      .eq("id", taskId)
      .single()

    if (fetchError || !task) {
      return NextResponse.json({ error: "Compito non trovato" }, { status: 404 })
    }

    if (task.teacher_id !== user.id) {
      return NextResponse.json({ error: "Non hai il permesso di eliminare questo compito" }, { status: 403 })
    }

    // Delete the task (task_submissions are ON DELETE CASCADE)
    const { error: deleteError } = await adminSupabase
      .from("tasks")
      .delete()
      .eq("id", taskId)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Task deletion error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
