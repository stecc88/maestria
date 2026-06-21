import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Mail, User, Key, ChevronLeft, UserCheck } from "lucide-react"
import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/date"
import ApprovalActions from "../components/ApprovalActions"

export default async function AdminApprovalsPage() {
  const supabase = createAdminClient()

  // Fetch ALL pending users list
  const { data: pendingUsers } = await supabase
    .from("profiles")
    .select(`
      *,
      teachers (
        teacher_code
      )
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Richieste di Approvazione</h1>
          <p className="text-gray-500">Controlla e gestisci i nuovi account registrati sulla piattaforma.</p>
        </div>
      </div>

      <div className="space-y-4">
        {pendingUsers && pendingUsers.length > 0 ? (
          pendingUsers.map((user) => (
            <Card key={user.id} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{user.full_name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          Registrato il {formatDate(user.created_at, "d MMMM yyyy HH:mm")}
                        </div>
                        {user.role === 'teacher' && user.teachers && (
                          <div className="flex items-center gap-2 text-sm font-medium text-primary col-span-2">
                            <Key className="h-4 w-4" />
                            Codice Insegnante: {Array.isArray(user.teachers) ? user.teachers[0]?.teacher_code : user.teachers.teacher_code}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={`capitalize px-3 py-1 text-sm ${
                      user.role === 'teacher' ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-blue-200 bg-blue-50 text-blue-700'
                    }`}>
                      {user.role === 'teacher' ? 'Insegnante' : 'Studente'}
                    </Badge>
                    <ApprovalActions userId={user.id} userName={user.full_name} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-2 bg-transparent py-20">
            <CardContent className="text-center">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCheck className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tutto in ordine</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Non ci sono richieste in sospeso al momento. I nuovi utenti appariranno qui.
              </p>
              <Link href="/admin" className="mt-8 block">
                <Button variant="outline">Torna alla Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
