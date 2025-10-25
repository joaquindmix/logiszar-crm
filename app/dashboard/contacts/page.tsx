import { createClient } from "@/lib/supabase/server"
import { ContactsTable } from "@/components/contacts-table"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import Link from "next/link"

export default async function ContactsPage() {
  const supabase = await createClient()

  const { data: contacts } = await supabase
    .from("contacts")
    .select(
      `
      *,
      assigned_to_profile:profiles!contacts_assigned_to_fkey(full_name),
      created_by_profile:profiles!contacts_created_by_fkey(full_name)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground">Gestiona todos tus contactos y leads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>
          <Button asChild>
            <Link href="/dashboard/contacts/new">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Contacto
            </Link>
          </Button>
        </div>
      </div>

      <ContactsTable initialContacts={contacts || []} />
    </div>
  )
}
