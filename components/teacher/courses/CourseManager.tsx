"use client"

import React, { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, BookOpen, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface CourseManagerProps {
  courses: any[]
}

export function CourseManager({ courses }: CourseManagerProps) {
  const [newCourseName, setNewCourseName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) return
    setIsCreating(true)
    try {
      const res = await fetch("/api/courses/create", {
        method: "POST",
        body: JSON.stringify({ name: newCourseName }),
        headers: { "Content-Type": "application/json" }
      })
      if (!res.ok) throw new Error("Errore durante la creazione")
      toast.success("Corso creato con successo")
      setNewCourseName("")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Sei sicuro? Gli studenti in questo corso diventeranno 'Senza corso'.")) return
    setDeletingId(courseId)
    try {
      const res = await fetch("/api/courses/delete", {
        method: "POST",
        body: JSON.stringify({ courseId }),
        headers: { "Content-Type": "application/json" }
      })
      if (!res.ok) throw new Error("Errore durante l'eliminazione")
      toast.success("Corso eliminato")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Sheet>
      <SheetTrigger render={
        <Button variant="outline" className="rounded-xl gap-2 border-gray-200 font-bold bg-white">
          <BookOpen className="h-4 w-4 text-primary" /> Gestisci corsi 📚
        </Button>
      } />
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl font-black">Gestione Corsi</SheetTitle>
        </SheetHeader>
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nuovo Corso</label>
            <div className="flex gap-2">
              <Input
                placeholder="es. 7mo A, 9no B..."
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="rounded-xl border-gray-200"
              />
              <Button
                onClick={handleCreateCourse}
                disabled={isCreating || !newCourseName.trim()}
                className="rounded-xl bg-primary hover:bg-primary-dark"
              >
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">I tuoi corsi ({courses.length})</label>
             <div className="space-y-2">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                    <span className="font-bold text-gray-700">{course.name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteCourse(course.id)}
                      disabled={deletingId === course.id}
                      className="text-gray-400 hover:text-secondary hover:bg-secondary/5 rounded-xl"
                    >
                      {deletingId === course.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
                {courses.length === 0 && (
                  <p className="text-sm text-gray-400 italic py-4 text-center">Nessun corso creato.</p>
                )}
             </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
