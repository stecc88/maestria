import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Bell } from "lucide-react"
import NotificationsList from "@/components/shared/NotificationsList"

export default async function StudentNotificationsPage() {
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
    <div className="max-w-4xl mx-auto space-y-10 py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-2xl border border-primary/20">
            <Bell className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Centro Notifiche</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Le tue Notifiche 🔔</h1>
          <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">
            Rimani aggiornato su correzioni, nuovi compiti e progressi del tuo percorso.
          </p>
        </div>
      </header>

      <NotificationsList initialNotifications={notifications || []} userId={user.id} />
    </div>
  )
}
