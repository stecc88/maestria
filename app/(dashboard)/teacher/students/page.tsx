import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StudentCard } from "@/components/teacher/StudentCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Users, LayoutGrid, List } from "lucide-react"

export default async function TeacherStudentsPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch all students for this teacher
  const { data: students } = await supabase
    .from("students")
    .select("*, profiles(*)")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
             <Users className="h-8 w-8 text-primary" />
             Studenti
          </h1>
          <p className="text-gray-500 mt-1">Lista completa degli studenti sotto la tua supervisione.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Cerca per nome..." className="pl-10 bg-white border-gray-200 rounded-xl" />
           </div>
           <Button variant="outline" className="rounded-xl gap-2 border-gray-200 font-bold">
              <Filter className="h-4 w-4" /> Filtri
           </Button>
        </div>
      </header>

      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
         <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Mostrando {students?.length || 0} studenti</p>
         <div className="flex items-center bg-white border border-gray-100 p-1 rounded-xl">
            <Button size="icon" variant="ghost" className="h-8 w-8 bg-gray-50 text-primary"><LayoutGrid className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400"><List className="h-4 w-4" /></Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
         {students?.map((student) => (
           <StudentCard key={student.id} student={student} />
         ))}
         {students?.length === 0 && (
           <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <Users className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Non hai ancora studenti registrati con il tuo codice.</p>
           </div>
         )}
      </div>
    </div>
  )
}
