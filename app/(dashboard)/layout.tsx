import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { getLevelFromXP } from "@/lib/utils/levels"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const adminSupabase = createAdminClient()

  // First fetch profile to know the role
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/login")
  }

  // Fetch remaining data in parallel
  const [studentResult, teacherResult, notificationsResult, pendingTasksResult] = await Promise.all([
    profile.role === 'student'
      ? adminSupabase.from("students").select("*, teachers(profiles(full_name))").eq("id", user.id).single()
      : Promise.resolve({ data: null }),
    profile.role === 'teacher'
      ? adminSupabase.from("teachers").select("teacher_code").eq("id", user.id).single()
      : Promise.resolve({ data: null }),
    supabase.from("notifications").select("*").eq("user_id", user.id).eq("read", false).order("created_at", { ascending: false }).limit(5),
    profile.role === 'student'
      ? supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('student_id', user.id).eq('status', 'pending')
      : Promise.resolve({ count: 0 })
  ])

  let studentData = null
  if (profile.role === 'student' && studentResult.data) {
    const levelInfo = getLevelFromXP(studentResult.data.xp_points);
    studentData = {
      ...studentResult.data,
      target_xp: levelInfo.next?.minXp || levelInfo.current.minXp,
      next_level_name: levelInfo.next?.name || "Massimo",
      pending_tasks: pendingTasksResult.count || 0
    }
  }

  const teacherData = teacherResult.data
  const notifications = notificationsResult.data || []

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-40">
        <Sidebar user={profile} studentData={studentData ?? undefined} teacherData={teacherData ?? undefined} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-72">
        <Header
          user={profile}
          studentData={studentData ?? undefined}
          teacherData={teacherData ?? undefined}
          notifications={notifications || []}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
