import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Bell } from "lucide-react"
import NotificationsList from "../components/NotificationsList"

export default async function TeacherNotificationsPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Initial fetch for SSR
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notifiche
          </h1>
          <p className="text-gray-500 mt-1">Rimani aggiornato sull&apos;attività dei tuoi studenti.</p>
        </div>
      </header>

      <NotificationsList initialNotifications={notifications || []} userId={user.id} />
    </div>
  )
}
