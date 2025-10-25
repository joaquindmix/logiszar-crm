import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ContactDetail } from "@/components/contact-detail"

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: contact } = await supabase
    .from("contacts")
    .select(
      `
      *,
      assigned_to_profile:profiles!contacts_assigned_to_fkey(id, full_name, email),
      created_by_profile:profiles!contacts_created_by_fkey(full_name)
    `,
    )
    .eq("id", id)
    .single()

  if (!contact) {
    notFound()
  }

  const { data: activities } = await supabase
    .from("activities")
    .select(
      `
      *,
      created_by_profile:profiles!activities_created_by_fkey(full_name)
    `,
    )
    .eq("contact_id", id)
    .order("created_at", { ascending: false })

  const { data: deals } = await supabase
    .from("deals")
    .select(
      `
      *,
      product:products(name, unit),
      created_by_profile:profiles!deals_created_by_fkey(full_name)
    `,
    )
    .eq("contact_id", id)
    .order("created_at", { ascending: false })

  return <ContactDetail contact={contact} activities={activities || []} deals={deals || []} />
}
