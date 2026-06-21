"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Plus, Trash2, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

interface Course {
  id: string
  name: string
}

interface CourseManagerSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courses: Course[]
}

export function CourseManagerSheet({ open, onOpenChange, courses }: CourseManagerSheetProps) {
  const router = useRouter()
  const [newCourseName, setNewCourseName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!newCourseName.trim()) return
    setIsCreating(true)
    try {
      const response = await fetch("/api/courses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCourseName.trim() }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Errore durante la creazione")

      toast.success("Corso creato")
      setNewCourseName("")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (courseId: string) => {
    setDeletingId(courseId)
    try {
      const response = await fetch("/api/courses/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Errore durante l'eliminazione")

      toast.success("Corso eliminato")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-6 space-y-6">
        <SheetHeader className="space-y-2 text-left">
          <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <SheetTitle className="text-2xl font-black text-gray-900">Gestisci corsi</SheetTitle>
          <SheetDescription className="text-gray-500">
            Crea e organizza i corsi per dividere i tuoi studenti (es. &quot;7mo&quot;, &quot;9no&quot;).
          </SheetDescription>
        </SheetHeader>

        <div className="flex gap-2">
          <Input
            placeholder="Es: 7mo grado"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="bg-gray-50 border-gray-100 rounded-xl"
          />
          <Button
            onClick={handleCreate}
            disabled={isCreating || !newCourseName.trim()}
            className="bg-primary hover:bg-primary-dark rounded-xl shrink-0 gap-2 font-bold"
          >
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Crea
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
            Corsi esistenti ({courses.length})
          </p>

          {courses.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-medium">Non hai ancora creato nessun corso</p>
            </div>
          ) : (
            <div className="space-y-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl"
                >
                  <span className="font-bold text-gray-900 text-sm">{course.name}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(course.id)}
                    disabled={deletingId === course.id}
                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    {deletingId === course.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
