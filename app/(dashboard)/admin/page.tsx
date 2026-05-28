import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle2, LayoutDashboard, ShieldCheck, UserCheck } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const stats = [
    { label: "Usuarios Totales", value: "---", icon: Users, color: "text-blue-600" },
    { label: "Pendientes", value: "---", icon: UserCheck, color: "text-orange-600" },
    { label: "Aprobados", value: "---", icon: CheckCircle2, color: "text-primary" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard Amministratore</h1>
          <p className="text-gray-500">Benvenuto al pannello di controllo di Maestria.</p>
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

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden group">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-xl">Aprobaciones Pendientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Revisa y aprueba las solicitudes de nuevos profesores que quieren unirse a la plataforma.
            </p>
            <Link href="/admin/approvals" className="block w-full">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 font-bold py-6 rounded-xl text-white">
                Ver solicitudes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden group">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Gestión de Usuarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Administra todos los usuarios registrados, cambia roles o gestiona permisos de la plataforma.
            </p>
            <Link href="/admin/users" className="block w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-6 rounded-xl text-white">
                Gestionar usuarios
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
