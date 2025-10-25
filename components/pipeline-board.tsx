"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Phone, Mail, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ContactDialog } from "@/components/contact-dialog"

interface Contact {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  company: string | null
  position: string | null
  source: string | null
  stage: string
  stage_order: number
  notes: string | null
  created_at: string
  updated_at: string
  assigned_to_profile?: { full_name: string } | null
  created_by_profile?: { full_name: string } | null
}

interface PipelineBoardProps {
  initialContacts: Contact[]
}

const STAGES = [
  { id: "new", label: "Nuevo", color: "bg-blue-500" },
  { id: "contacted", label: "Contactado", color: "bg-purple-500" },
  { id: "follow_up", label: "Seguimiento", color: "bg-amber-500" },
  { id: "purchased", label: "Compró", color: "bg-green-500" },
  { id: "lost", label: "Perdido", color: "bg-red-500" },
]

export function PipelineBoard({ initialContacts }: PipelineBoardProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [draggedContact, setDraggedContact] = useState<Contact | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const supabase = createClient()

  const handleDragStart = (contact: Contact) => {
    setDraggedContact(contact)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (stage: string) => {
    if (!draggedContact) return

    const stageIndex = STAGES.findIndex((s) => s.id === stage)

    try {
      const { error } = await supabase
        .from("contacts")
        .update({ stage, stage_order: stageIndex, updated_at: new Date().toISOString() })
        .eq("id", draggedContact.id)

      if (error) throw error

      setContacts((prev) =>
        prev.map((c) => (c.id === draggedContact.id ? { ...c, stage, stage_order: stageIndex } : c)),
      )
    } catch (error) {
      console.error("Error updating contact stage:", error)
    }

    setDraggedContact(null)
  }

  const getContactsByStage = (stage: string) => {
    return contacts.filter((c) => c.stage === stage)
  }

  const handleCreateContact = () => {
    setSelectedContact(null)
    setIsCreating(true)
    setIsDialogOpen(true)
  }

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact)
    setIsCreating(false)
    setIsDialogOpen(true)
  }

  const handleContactSaved = (contact: Contact) => {
    if (isCreating) {
      setContacts((prev) => [contact, ...prev])
    } else {
      setContacts((prev) => prev.map((c) => (c.id === contact.id ? contact : c)))
    }
    setIsDialogOpen(false)
  }

  return (
    <>
      <div className="mb-4">
        <Button onClick={handleCreateContact}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Contacto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const stageContacts = getContactsByStage(stage.id)
          return (
            <div
              key={stage.id}
              className="flex flex-col gap-3"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
            >
              <div className="flex items-center gap-2">
                <div className={cn("h-3 w-3 rounded-full", stage.color)} />
                <h3 className="font-semibold">{stage.label}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {stageContacts.length}
                </Badge>
              </div>

              <div className="space-y-2 min-h-[200px]">
                {stageContacts.map((contact) => (
                  <Card
                    key={contact.id}
                    draggable
                    onDragStart={() => handleDragStart(contact)}
                    onClick={() => handleEditContact(contact)}
                    className="cursor-move hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">{contact.full_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      {contact.company && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{contact.company}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span className="truncate">{contact.phone}</span>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                      )}
                      {contact.source && (
                        <Badge variant="outline" className="text-xs">
                          {contact.source}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <ContactDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        contact={selectedContact}
        onSave={handleContactSaved}
      />
    </>
  )
}
