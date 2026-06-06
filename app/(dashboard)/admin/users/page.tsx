import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Mail, Clock, User, ShieldCheck, ChevronLeft, Search } from "lucide-react"
import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import UserActions from "./components/UserActions"

export default async function AdminUsersPage() {
  const adminSupabase = createAdminClient()

  // Fetch all users
  const { data: users } = await adminSupabase
    .from("profiles")
    .select(`
      *,
      students (
        teacher_id,
        teachers (
            profiles (
                full_name
            )
        )
      )
    `)
    .order("created_at", { ascending: false })

  // Fetch all approved teachers for reassignment
  const { data: teachers } = await adminSupabase
    .from("teachers")
    .select(`
      id,
      profiles (
        full_name
      )
    `)
    .eq("profiles.status", "approved")

  const roleLabels: Record<string, string> = {
    admin: "Amministratore",
    teacher: "Insegnante",
    student: "Studente"
  }

  const statusLabels: Record<string, string> = {
    pending: "In sospeso",
    approved: "Approvato",
    rejected: "Rifiutato"
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Gestione Utenti</h1>
          <p className="text-gray-500">Gestisci tutti gli utenti registrati su Maestria.</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
                type="text"
                placeholder="Cerca per nome o email..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white px-3 py-1">
                Totale: {users?.length || 0}
            </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {users && users.length > 0 ? (
          users.map((user) => (
            <Card key={user.id} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{user.full_name}</h3>
                        {user.status === 'approved' ? (
                            <ShieldCheck className="h-4 w-4 text-primary" />
                        ) : (
                            <Badge variant="outline" className="text-[10px] uppercase px-1.5 py-0 border-orange-200 bg-orange-50 text-orange-600">
                                {statusLabels[user.status] || user.status}
                            </Badge>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          Iscritto il {format(new Date(user.created_at), "d MMMM yyyy", { locale: it })}
                        </div>
                      </div>
                      {user.role === 'student' && user.students && (
                        <div className="text-xs font-medium text-primary mt-1">
                          Insegnante: {(() => {
                            const student = Array.isArray(user.students) ? user.students[0] : user.students;
                            const teacher = Array.isArray(student?.teachers) ? student.teachers[0] : student?.teachers;
                            const profile = Array.isArray(teacher?.profiles) ? teacher.profiles[0] : teacher?.profiles;
                            return (profile as any)?.full_name || 'Non assegnato';
                          })()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={`capitalize ${
                      user.role === 'admin' ? 'bg-secondary text-white' :
                      user.role === 'teacher' ? 'bg-purple-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {roleLabels[user.role] || user.role}
                    </Badge>
                    <UserActions
                        user={user}
                        teachers={teachers?.map(t => {
                          const profile = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles;
                          return { id: t.id, name: (profile as any)?.full_name || "Insegnante" };
                        }) || []}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Nessun utente trovato</p>
          </div>
        )}
      </div>
    </div>
  )
}
