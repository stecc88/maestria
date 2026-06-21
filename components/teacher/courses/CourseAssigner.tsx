"use client"

import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface CourseAssignerProps {
  studentId: string
  currentCourseId: string | null
  courses: any[]
}

export function CourseAssigner({ studentId, currentCourseId, courses }: CourseAssignerProps) {
  const router = useRouter()

  const handleAssign = async (courseId: string) => {
    const finalCourseId = courseId === "none" ? null : courseId
    try {
      const res = await fetch("/api/students/assign-course", {
        method: "POST",
        body: JSON.stringify({ studentId, courseId: finalCourseId }),
        headers: { "Content-Type": "application/json" }
      })
      if (!res.ok) throw new Error("Errore durante l'assegnazione")
      toast.success("Corso aggiornato")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Corso</label>
      <Select
        defaultValue={currentCourseId || "none"}
        onValueChange={(val) => handleAssign(val || "none")}
      >
        <SelectTrigger className="h-8 rounded-lg border-gray-100 bg-white text-xs font-bold">
          <SelectValue placeholder="Senza corso" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none" className="text-xs font-bold">Senza corso</SelectItem>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id} className="text-xs font-bold">
              {course.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
