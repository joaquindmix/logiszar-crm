import { createClient } from "@/lib/supabase/server"
import { ActivitiesList } from "@/components/activities-list"

export default async function ActivitiesPage() {
  const supabase = await createClient()

  const { data: activities } = await supabase
    .from("activities")
    .select(
      `
      *,
      contact:contacts(id, full_name, company),
      created_by_profile:profiles!activities_created_by_fkey(full_name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Actividades</h1>
        <p className="text-muted-foreground">Historial de todas las interacciones con contactos</p>
      </div>

      <ActivitiesList initialActivities={activities || []} />
    </div>
  )
}
