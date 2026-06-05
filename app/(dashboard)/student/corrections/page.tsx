import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function CorrectionsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const adminSupabase = createAdminClient()

  const { data: writings } = await adminSupabase
    .from("writings")
    .select("id")
    .eq("student_id", user.id)

  const writingIds = writings?.map((w: any) => w.id) || []

  const { data: corrections } = writingIds.length > 0
    ? await adminSupabase
        .from("corrections")
        .select("*, writings(*)")
        .in("writing_id", writingIds)
        .order("created_at", { ascending: false })
    : { data: [] }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Le mie correzioni</h1>
        <p className="text-gray-500 mt-1">Storico di tutti i tuoi testi corretti dall'IA</p>
      </div>

      {!corrections || corrections.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📝</p>
          <p className="font-medium text-lg">Non hai ancora inviato nessun testo</p>
          <Link
            href="/student/write"
            className="text-primary font-bold hover:underline mt-4 inline-block"
          >
            Invia il tuo primo testo →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {corrections.map((correction: any) => (
            <Link
              key={correction.id}
              href={`/student/corrections/${correction.id}`}
            >
              <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900 capitalize text-lg">
                      {correction.writings?.writing_type?.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(correction.created_at).toLocaleDateString("it-IT", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                    {correction.writings?.target_level && (
                      <p className="text-xs text-gray-400">
                        Livello obiettivo: {correction.writings.target_level}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-4xl font-black text-primary">
                        {correction.overall_score}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">/ 100</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-full">
                        {correction.detected_level}
                      </div>
                      {correction.exam_compliant ? (
                        <span className="text-xs text-green-600 font-medium">✅ Conforme</span>
                      ) : (
                        <span className="text-xs text-orange-500 font-medium">⚠️ Da migliorare</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
