"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  UserCog,
  UserPlus,
  Loader2,
  AlertTriangle,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserActionsProps {
  user: any;
  teachers: { id: string, name: string }[];
}

export default function UserActions({ user, teachers }: UserActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [newRole, setNewRole] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Errore durante l'eliminazione dell'utente");
      }

      toast.success("Utente eliminato correttamente");
      setShowDeleteConfirm(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Errore durante l'aggiornamento del ruolo");
      }

      toast.success("Ruolo aggiornato correttamente");
      setShowRoleConfirm(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = async () => {
    if (!selectedTeacher) return;
    setLoading(true);
    try {
      const response = await fetch("/api/admin/reassign-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user.id, newTeacherId: selectedTeacher }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Errore durante la riassegnazione dello studente");
      }

      toast.success("Studente riassegnato correttamente");
      setShowReassignModal(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const roleLabels: Record<string, string> = {
    student: "Studente",
    teacher: "Insegnante",
    admin: "Admin"
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {user.role === 'student' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowReassignModal(true)}
            className="text-primary border-primary/20 hover:bg-primary/5 gap-1.5"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Riassegna
          </Button>
        )}
        <Select
            onValueChange={(val) => {
                setNewRole(val);
                setShowRoleConfirm(true);
            }}
            value={user.role}
        >
            <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Ruolo" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="student">Studente</SelectItem>
                <SelectItem value="teacher">Insegnante</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
        </Select>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-xl font-bold">Elimina Utente</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Sei sicuro di voler eliminare <strong>{user.full_name}</strong>? Questa azione è permanente e cancellerà tutti i dati associati.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
                Annulla
              </Button>
              <Button onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Sì, Elimina
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Modal */}
      {showRoleConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Cambia Ruolo</h3>
            <p className="text-gray-600 mb-6">
              Confermi il cambio di ruolo per <strong>{user.full_name}</strong> in <span className="font-bold">{roleLabels[newRole] || newRole}</span>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowRoleConfirm(false)} disabled={loading}>
                Annulla
              </Button>
              <Button onClick={handleUpdateRole} disabled={loading} className="bg-primary text-white">
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Conferma
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Student Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Riassegna Studente</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowReassignModal(false)}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <p className="text-gray-600 mb-4 text-sm">
                Seleziona un nuovo insegnante per <strong>{user.full_name}</strong>.
            </p>

            <div className="space-y-4">
                <Select onValueChange={(value) => setSelectedTeacher(value)} value={selectedTeacher || undefined}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleziona un insegnante" />
                    </SelectTrigger>
                    <SelectContent>
                        {teachers.map(teacher => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <Button variant="ghost" onClick={() => setShowReassignModal(false)} disabled={loading}>
                Annulla
              </Button>
              <Button onClick={handleReassign} disabled={loading || !selectedTeacher} className="bg-primary text-white">
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Riassegna Studente
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
