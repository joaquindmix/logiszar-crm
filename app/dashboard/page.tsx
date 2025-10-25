import { createClient } from "@/lib/supabase/server"
import { PipelineBoard } from "@/components/pipeline-board"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch contacts grouped by stage
  const { data: contacts } = await supabase
    .from("contacts")
    .select(
      `
      *,
      assigned_to_profile:profiles!contacts_assigned_to_fkey(full_name),
      created_by_profile:profiles!contacts_created_by_fkey(full_name)
    `,
    )
    .order("stage_order", { ascending: true })
    .order("updated_at", { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pipeline de Ventas</h1>
        <p className="text-muted-foreground">Gestiona tus leads y oportunidades</p>
      </div>

      <PipelineBoard initialContacts={contacts || []} />
    </div>
  )
}
