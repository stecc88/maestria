import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/login")
  }

  // Fetch student specific data if role is student
  let studentData = null
  if (profile.role === 'student') {
    const { data: student } = await supabase
      .from('students')
      .select('*, teachers(profiles(full_name))')
      .eq('id', user.id)
      .single()

    const { count: pendingTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id)
      .eq('status', 'pending')

    if (student) {
      studentData = {
        ...student,
        target_xp: 1000, // This could be calculated based on level
        next_level_name: "Praticante", // This could come from a levels utility
        pending_tasks: pendingTasks || 0
      }
    }
  }

  // Fetch teacher specific data if role is teacher
  let teacherData = null
  if (profile.role === 'teacher') {
    const { data: teacher } = await supabase
      .from('teachers')
      .select('teacher_code')
      .eq('id', user.id)
      .single()

    if (teacher) {
      teacherData = teacher
    }
  }

  // Fetch notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="flex min-h-screen bg-cream/30">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-40">
        <Sidebar user={profile} studentData={studentData} teacherData={teacherData} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-72">
        <Header
          user={profile}
          studentData={studentData}
          teacherData={teacherData}
          notifications={notifications || []}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
