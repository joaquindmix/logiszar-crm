"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Phone, Building2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Contact {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  company: string | null
  position: string | null
  source: string | null
  stage: string
  created_at: string
  assigned_to_profile?: { full_name: string } | null
}

interface ContactsTableProps {
  initialContacts: Contact[]
}

const STAGE_LABELS: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  follow_up: "Seguimiento",
  purchased: "Compró",
  lost: "Perdido",
}

const STAGE_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  contacted: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  follow_up: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  purchased: "bg-green-500/10 text-green-700 dark:text-green-400",
  lost: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export function ContactsTable({ initialContacts }: ContactsTableProps) {
  const [contacts] = useState<Contact[]>(initialContacts)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase()
    return (
      contact.full_name.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.phone?.toLowerCase().includes(query) ||
      contact.company?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar contactos por nombre, email, teléfono o empresa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Fuente</TableHead>
              <TableHead>Asignado a</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No se encontraron contactos
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/dashboard/contacts/${contact.id}`} className="font-medium hover:underline">
                      {contact.full_name}
                    </Link>
                    {contact.position && <p className="text-sm text-muted-foreground">{contact.position}</p>}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.company && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span>{contact.company}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("font-normal", STAGE_COLORS[contact.stage])}>
                      {STAGE_LABELS[contact.stage]}
                    </Badge>
                  </TableCell>
                  <TableCell>{contact.source && <Badge variant="outline">{contact.source}</Badge>}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {contact.assigned_to_profile?.full_name || "-"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
