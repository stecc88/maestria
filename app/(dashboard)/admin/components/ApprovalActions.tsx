"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ApprovalActionsProps {
  userId: string;
  userName: string;
}

export default function ApprovalActions({ userId, userName }: ApprovalActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al aprobar usuario");
      }

      toast.success(`${userName} ha sido aprobado correctamente`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Por favor, ingresa un motivo para el rechazo");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, reason: rejectionReason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al rechazar usuario");
      }

      toast.success(`${userName} ha sido rechazado`);
      setShowRejectModal(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleApprove}
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Aprobar
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowRejectModal(true)}
          disabled={loading}
          className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
        >
          <X className="h-4 w-4" />
          Rechazar
        </Button>
      </div>

      {/* Simple Rejection Modal Overlay */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-xl font-bold">Rechazar Solicitud</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Indica el motivo del rechazo para <strong>{userName}</strong>. Este mensaje se le enviará por notificación.
            </p>

            <textarea
              className="w-full h-32 p-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Ej: El código de profesor no es válido o la información está incompleta."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={loading}
            />

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowRejectModal(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleReject}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Confirmar Rechazo
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
