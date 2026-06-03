"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Users, FileText, UserCircle, Mail, Key, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface TeacherProfileFormProps {
  teacher: any;
  stats: {
    studentCount: number;
    taskCount: number;
  };
}

export default function TeacherProfileForm({ teacher, stats }: TeacherProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(teacher.profiles.full_name);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", teacher.id);

    if (error) {
      toast.error("Error al actualizar el perfil");
    } else {
      toast.success("Perfil actualizado correctamente");
      router.refresh();
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(teacher.teacher_code);
    setCopied(true);
    toast.success("Código copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Sidebar Stats */}
      <div className="space-y-6">
        <Card className="border-none shadow-sm bg-primary/5">
          <CardContent className="p-6 text-center">
            <div className="h-24 w-24 rounded-full bg-white mx-auto flex items-center justify-center shadow-sm mb-4">
               <UserCircle className="h-16 w-16 text-primary/20" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{teacher.profiles.full_name}</h3>
            <p className="text-sm text-gray-500 capitalize">{teacher.profiles.role}</p>
            <div className="flex items-center justify-center gap-1 mt-2 text-primary font-bold text-xs uppercase tracking-wider">
               <ShieldCheck className="h-3 w-3" />
               Verificado
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
           <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex flex-col items-center">
                 <Users className="h-5 w-5 text-blue-500 mb-2" />
                 <span className="text-2xl font-bold">{stats.studentCount}</span>
                 <span className="text-[10px] text-gray-400 font-bold uppercase">Alumnos</span>
              </CardContent>
           </Card>
           <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex flex-col items-center">
                 <FileText className="h-5 w-5 text-green-500 mb-2" />
                 <span className="text-2xl font-bold">{stats.taskCount}</span>
                 <span className="text-[10px] text-gray-400 font-bold uppercase">Tareas</span>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Main Forms */}
      <div className="md:col-span-2 space-y-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Datos Personales</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
                   <Mail className="h-4 w-4" />
                   <span className="text-sm font-medium">{teacher.profiles.email}</span>
                </div>
                <p className="text-[10px] text-gray-400">El correo electrónico no puede ser modificado por seguridad.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <div className="relative">
                   <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                   <Input
                     id="name"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     className="pl-10 h-12 rounded-xl"
                   />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full md:w-auto px-12 py-6 rounded-xl font-bold">
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Key className="h-32 w-32" />
          </div>
          <CardContent className="p-8 relative z-10">
            <h3 className="text-xl font-bold mb-2">Código Docente Único</h3>
            <p className="text-primary-foreground/80 text-sm mb-6 max-w-md">
              Comparte este código con tus alumnos para que puedan unirse a tus clases automáticamente al registrarse.
            </p>

            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex-1 font-mono text-2xl font-bold tracking-widest text-center">
                {teacher.teacher_code}
              </div>
              <Button
                onClick={copyToClipboard}
                size="lg"
                className="h-full aspect-square rounded-2xl bg-white text-primary hover:bg-white/90"
              >
                {copied ? <Check className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
