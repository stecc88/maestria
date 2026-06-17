"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

interface DeleteTaskButtonProps {
  taskId: string
  taskTitle: string
  variant?: "outline" | "ghost" | "destructive" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  label?: string
}

export function DeleteTaskButton({
  taskId,
  taskTitle,
  variant = "outline",
  size = "default",
  className,
  label = "Elimina"
}: DeleteTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch("/api/tasks/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Errore durante l'eliminazione del compito")
      }

      toast.success("Compito eliminato con successo")
      setIsOpen(false)
      router.push("/teacher/tasks")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-50 rounded-xl">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold">Elimina Compito</h3>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Sei sicuro di voler eliminare il compito <span className="font-bold text-gray-900">&quot;{taskTitle}&quot;</span>?
              <br /><br />
              Questa azione è <span className="font-bold">irreversibile</span> e cancellerà anche tutti gli invii degli studenti associati.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="flex-1 rounded-xl font-bold py-6"
              >
                Annulla
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl font-bold py-6 gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" /> Elimina
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setIsOpen(true)}
      className={cn(
        variant === "outline" && "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700",
        "gap-2 rounded-xl font-bold",
        className
      )}
    >
      <Trash2 className="h-4 w-4" /> {label}
    </Button>
  )
}
