import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { AdminUsersClient } from "./components/AdminUsersClient"

export default async function AdminUsersPage() {
  const adminSupabase = createAdminClient()

  // Fetch all users
  const { data: users } = await adminSupabase
    .from("profiles")
    .select(`
      *,
      students (
        teacher_id,
        teachers (
            profiles (
                full_name
            )
        )
      )
    `)
    .order("created_at", { ascending: false })

  // Fetch all approved teachers for reassignment
  const { data: teachers } = await adminSupabase
    .from("teachers")
    .select(`
      id,
      profiles (
        full_name
      )
    `)
    .eq("profiles.status", "approved")

  const formattedTeachers = teachers?.map(t => {
    const profile = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles;
    return { id: t.id, name: profile?.full_name || "Insegnante" };
  }) || []

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Gestione Utenti</h1>
          <p className="text-gray-500">Gestisci tutti gli utenti registrati su Maestria.</p>
        </div>
      </div>

      <AdminUsersClient users={users || []} teachers={formattedTeachers} />
    </div>
  )
}
