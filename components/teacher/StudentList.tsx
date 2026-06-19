"use client"

import React from "react"
import { StudentCard } from "@/components/teacher/StudentCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Users, LayoutGrid, List } from "lucide-react"
import { CourseManager } from "@/components/teacher/courses/CourseManager"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StudentListProps {
  initialStudents: any[]
  courses: any[]
}

export function StudentList({ initialStudents, courses }: StudentListProps) {
  const [search, setSearch] = React.useState("")
  const [selectedCourse, setSelectedCourse] = React.useState("all")

  const filteredStudents = initialStudents.filter(student => {
    const profile = Array.isArray(student.profiles) ? student.profiles[0] : student.profiles;
    const nameMatch = profile?.full_name?.toLowerCase().includes(search.toLowerCase());

    let courseMatch = true;
    if (selectedCourse === "none") {
      courseMatch = !student.course_id;
    } else if (selectedCourse !== "all") {
      courseMatch = student.course_id === selectedCourse;
    }

    return nameMatch && courseMatch;
  })

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
             <Users className="h-8 w-8 text-primary" />
             Studenti
          </h1>
          <p className="text-gray-500 mt-1">Lista completa degli studenti sotto la tua supervisione.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
           <CourseManager courses={courses} />
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca per nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-gray-200 rounded-xl"
              />
           </div>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
         <div className="flex items-center gap-4">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Mostrando {filteredStudents.length} studenti</p>
            <div className="w-48">
              <Select value={selectedCourse} onValueChange={(val) => setSelectedCourse(val || "all")}>
                <SelectTrigger className="h-9 rounded-xl border-gray-100 bg-white text-xs font-bold">
                  <SelectValue placeholder="Filtra per corso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs font-bold">Tutti i corsi</SelectItem>
                  <SelectItem value="none" className="text-xs font-bold">Senza corso</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id} className="text-xs font-bold">
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
         </div>
         <div className="flex items-center bg-white border border-gray-100 p-1 rounded-xl">
            <Button size="icon" variant="ghost" className="h-8 w-8 bg-gray-50 text-primary"><LayoutGrid className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400"><List className="h-4 w-4" /></Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
         {filteredStudents.map((student) => (
           <StudentCard key={student.id} student={student} courses={courses} />
         ))}
         {filteredStudents.length === 0 && (
           <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <Users className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Nessun risultato trovato.</p>
           </div>
         )}
      </div>
    </div>
  )
}
