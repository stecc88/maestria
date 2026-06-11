import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle2, ShieldCheck, UserCheck, Clock, Mail, User, Key } from "lucide-react"
import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/date"
import ApprovalActions from "./components/ApprovalActions"

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  // Fetch stats
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  const { count: pendingUsersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: approvedUsersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")

  // Fetch pending users list
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
    .limit(5)

  const stats = [
    { label: "Utenti Totali", value: totalUsers?.toString() || "0", icon: Users, color: "text-blue-600" },
    { label: "In sospeso", value: pendingUsersCount?.toString() || "0", icon: UserCheck, color: "text-orange-600" },
    { label: "Approvati", value: approvedUsersCount?.toString() || "0", icon: CheckCircle2, color: "text-primary" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard Amministratore</h1>
          <p className="text-gray-500">Benvenuto nel pannello di controllo di Maestria.</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
           <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>
                   <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approvals List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Approvazioni in sospeso
            </h2>
            <Link href="/admin/approvals">
              <Button variant="ghost" className="text-primary hover:text-primary-dark">
                Vedi tutte
              </Button>
            </Link>
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
                          <h3 className="font-bold text-gray-900">{user.full_name}</h3>
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              Registrato il {formatDate(user.created_at, "d MMMM")}
                            </div>
                            {user.role === 'teacher' && user.teachers && (
                              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                <Key className="h-3 w-3" />
                                Codice: {Array.isArray(user.teachers) ? user.teachers[0]?.teacher_code : user.teachers.teacher_code}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`capitalize ${
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
              <Card className="border-dashed border-2 bg-transparent">
                <CardContent className="p-12 text-center">
                  <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Non ci sono approvazioni in sospeso</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden group">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Gestione Utenti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
                Gestisci tutti gli utenti registrati, cambia i ruoli o gestisci i permessi.
              </p>
              <Link href="/admin/users" className="block w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-6 rounded-xl text-white">
                  Gestisci utenti
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-bold text-primary mb-2">Consiglio Admin</h3>
              <p className="text-sm text-primary/80">
                Ricorda che gli insegnanti devono essere approvati per poter generare codici classe per i propri studenti.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
