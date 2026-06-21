"use client"

import { useState, useMemo, useEffect } from "react"
import { StudentCard } from "@/components/teacher/StudentCard"
import { CourseManagerSheet } from "@/components/teacher/CourseManagerSheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Users, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface Course {
  id: string
  name: string
}

interface TeacherStudentsClientProps {
  initialStudents: any[]
  initialCourses: Course[]
}

export function TeacherStudentsClient({ initialStudents, initialCourses }: TeacherStudentsClientProps) {
  const [students, setStudents] = useState(initialStudents)
  const [courses, setCourses] = useState(initialCourses)
  const [search, setSearch] = useState("")
  const [activeCourseFilter, setActiveCourseFilter] = useState<string>("all") // "all" | "none" | courseId
  const [isCourseManagerOpen, setIsCourseManagerOpen] = useState(false)

  // Sincronizar con el servidor después de un router.refresh() (ej: crear/borrar curso)
  useEffect(() => {
    setStudents(initialStudents)
  }, [initialStudents])

  useEffect(() => {
    setCourses(initialCourses)
  }, [initialCourses])

  const handleCourseAssigned = (studentId: string, courseId: string | null) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, course_id: courseId } : s))
    )
  }

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const profile = Array.isArray(student.profiles) ? student.profiles[0] : student.profiles
      const fullName = (profile?.full_name || "").toLowerCase()

      const matchesSearch = !search || fullName.includes(search.toLowerCase())

      const matchesCourse =
        activeCourseFilter === "all" ||
        (activeCourseFilter === "none" ? !student.course_id : student.course_id === activeCourseFilter)

      return matchesSearch && matchesCourse
    })
  }, [students, search, activeCourseFilter])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
             <Users className="h-8 w-8 text-primary" />
             Studenti
          </h1>
          <p className="text-muted-foreground mt-1">Lista completa degli studenti sotto la tua supervisione.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca per nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border rounded-xl"
              />
           </div>
           <Button
             variant="outline"
             onClick={() => setIsCourseManagerOpen(true)}
             className="rounded-xl gap-2 border-border font-bold shrink-0"
           >
              <BookOpen className="h-4 w-4" /> Gestisci corsi
           </Button>
        </div>
      </header>

      {/* Filtro de cursos */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCourseFilter("all")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0",
            activeCourseFilter === "all" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted"
          )}
        >
          Tutti ({students.length})
        </button>
        {courses.map((course) => {
          const count = students.filter((s) => s.course_id === course.id).length
          return (
            <button
              key={course.id}
              onClick={() => setActiveCourseFilter(course.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0",
                activeCourseFilter === course.id ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted"
              )}
            >
              {course.name} ({count})
            </button>
          )
        })}
        <button
          onClick={() => setActiveCourseFilter("none")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0",
            activeCourseFilter === "none" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted"
          )}
        >
          Senza corso ({students.filter((s) => !s.course_id).length})
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-border pb-4">
         <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
           Mostrando {filteredStudents.length} studenti
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
         {filteredStudents.map((student) => (
           <StudentCard
             key={student.id}
             student={student}
             courses={courses}
             onCourseAssigned={handleCourseAssigned}
           />
         ))}
         {filteredStudents.length === 0 && (
           <div className="col-span-full py-20 text-center bg-card rounded-3xl border-2 border-dashed border-border">
              <Users className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">
                {students.length === 0
                  ? "Non hai ancora studenti registrati con il tuo codice."
                  : "Nessuno studente corrisponde ai filtri selezionati."}
              </p>
           </div>
         )}
      </div>

      <CourseManagerSheet
        open={isCourseManagerOpen}
        onOpenChange={setIsCourseManagerOpen}
        courses={courses}
      />
    </div>
  )
}
