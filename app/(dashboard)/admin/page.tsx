import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle2, ShieldCheck, UserCheck, Clock, Mail, User, Key, Sparkles, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/date"
import ApprovalActions from "./components/ApprovalActions"
import { cn } from "@/lib/utils"

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  // Fetch stats in parallel
  const [
    { count: totalUsers },
    { count: pendingUsersCount },
    { count: approvedUsersCount },
    { data: pendingUsers }
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("profiles").select("*, teachers (teacher_code)").eq("status", "pending").order("created_at", { ascending: false }).limit(5)
  ])

  const stats = [
    {
      label: "Utenti Totali",
      value: totalUsers?.toString() || "0",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      label: "In Attesa",
      value: pendingUsersCount?.toString() || "0",
      icon: UserCheck,
      color: "text-orange-600",
      bg: "bg-orange-50",
      gradient: "from-orange-400 to-orange-600"
    },
    {
      label: "Approvati",
      value: approvedUsersCount?.toString() || "0",
      icon: CheckCircle2,
      color: "text-primary",
      bg: "bg-primary/10",
      gradient: "from-primary to-primary-dark"
    },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-10 py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-gray-900 text-white px-4 py-2 rounded-2xl border border-gray-800 shadow-xl">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Console Admin</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              Controllo <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Sistema</span> 🛠️
            </h1>
            <p className="text-muted-foreground font-bold text-lg max-w-2xl leading-relaxed">
              Monitora la crescita della piattaforma e gestisci le approvazioni dei nuovi docenti.
            </p>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <Card key={stat.label} className="group relative overflow-hidden border-none shadow-xl shadow-gray-200/50 bg-card rounded-3xl hover:shadow-2xl transition-all duration-500">
              <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity", stat.gradient)} />
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className={cn("p-4 rounded-2xl group-hover:rotate-6 transition-transform shadow-sm", stat.bg, stat.color)}>
                     <stat.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <p className="text-4xl font-black text-foreground tracking-tight">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Pending Approvals List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                Richieste in Sospeso
              </h2>
              <Link href="/admin/approvals">
                <Button variant="ghost" className="text-[10px] font-black text-primary transition-colors bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 shadow-sm">
                  VEDI TUTTE
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {pendingUsers && pendingUsers.length > 0 ? (
                pendingUsers.map((user, i) => (
                  <Card key={user.id} className="group border-none shadow-lg shadow-gray-200/50 bg-card rounded-3xl hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-5">
                          <div className="h-14 w-14 rounded-2xl bg-muted border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-primary/5 transition-colors">
                            <User className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors">{user.full_name}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                <div className="p-1 bg-muted rounded-md">
                                  <Mail className="h-3 w-3" />
                                </div>
                                {user.email}
                              </div>
                              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                <div className="p-1 bg-muted rounded-md">
                                  <Clock className="h-3 w-3" />
                                </div>
                                {formatDate(user.created_at, "d MMM yyyy")}
                              </div>
                              {user.role === 'teacher' && user.teachers && (
                                <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest sm:col-span-2 mt-1">
                                  <div className="p-1 bg-primary/10 rounded-md">
                                    <Key className="h-3 w-3" />
                                  </div>
                                  Codice: {Array.isArray(user.teachers) ? user.teachers[0]?.teacher_code : user.teachers.teacher_code}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                          <Badge className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border shadow-sm",
                            user.role === 'teacher' ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-blue-200 bg-blue-50 text-blue-700'
                          )}>
                            {user.role === 'teacher' ? 'Insegnante' : 'Studente'}
                          </Badge>
                          <ApprovalActions userId={user.id} userName={user.full_name} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-white/50 rounded-3xl border-4 border-dashed border-border">
                  <UserCheck className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                  <p className="text-muted-foreground font-black uppercase tracking-widest">Nessuna approvazione pendente</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links & Tips */}
          <div className="lg:col-span-4 space-y-10">
            <Card className="border-none shadow-2xl shadow-blue-500/10 bg-card overflow-hidden rounded-3xl group relative">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <Users className="h-32 w-32 text-blue-600" />
              </div>
              <CardHeader className="p-10 pb-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-inner">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-black text-foreground tracking-tight">Gestione Utenti</CardTitle>
              </CardHeader>
              <CardContent className="px-10 pb-10 space-y-6">
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Accedi all&apos;elenco completo degli iscritti per gestire ruoli, permessi e visualizzare i dettagli dei profili.
                </p>
                <Link href="/admin/users" className="block w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 font-black h-14 rounded-2xl text-xs tracking-[0.2em] shadow-xl shadow-blue-200 transition-all hover:translate-y-[-2px]">
                    VAI ALLA LISTA
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-primary/10 bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 opacity-10">
                <Sparkles className="h-40 w-40 text-primary" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-card rounded-xl shadow-sm">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-black text-foreground tracking-tight">Consiglio Admin</h3>
              </div>
              <p className="text-sm text-muted-foreground font-bold leading-relaxed relative z-10">
                Verifica sempre il codice classe dei docenti prima dell&apos;approvazione per mantenere l&apos;integrità del sistema educativo.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
