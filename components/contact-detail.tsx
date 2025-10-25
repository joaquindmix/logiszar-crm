"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  User,
  Edit,
  Plus,
  MessageSquare,
  PhoneCall,
  Video,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ActivityDialog } from "@/components/activity-dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Contact {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  company: string | null
  position: string | null
  source: string | null
  stage: string
  notes: string | null
  created_at: string
  updated_at: string
  assigned_to_profile?: { id: string; full_name: string; email: string } | null
  created_by_profile?: { full_name: string } | null
}

interface Activity {
  id: string
  type: string
  subject: string | null
  description: string
  created_at: string
  created_by_profile?: { full_name: string } | null
}

interface Deal {
  id: string
  quantity: number
  unit_price: number
  currency: string
  total_amount: number
  status: string
  notes: string | null
  created_at: string
  product?: { name: string; unit: string } | null
  created_by_profile?: { full_name: string } | null
}

interface ContactDetailProps {
  contact: Contact
  activities: Activity[]
  deals: Deal[]
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

const ACTIVITY_ICONS: Record<string, any> = {
  call: PhoneCall,
  whatsapp: MessageSquare,
  email: Mail,
  note: FileText,
  meeting: Video,
}

const ACTIVITY_LABELS: Record<string, string> = {
  call: "Llamada",
  whatsapp: "WhatsApp",
  email: "Email",
  note: "Nota",
  meeting: "Reunión",
}

export function ContactDetail({ contact, activities, deals }: ContactDetailProps) {
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)
  const [localActivities, setLocalActivities] = useState(activities)
  const router = useRouter()

  const handleActivitySaved = (activity: Activity) => {
    setLocalActivities([activity, ...localActivities])
    setIsActivityDialogOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/contacts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{contact.full_name}</h1>
          <p className="text-muted-foreground">{contact.position || "Contacto"}</p>
        </div>
        <Badge variant="secondary" className={cn("font-normal", STAGE_COLORS[contact.stage])}>
          {STAGE_LABELS[contact.stage]}
        </Badge>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Contact info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contact.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <a href={`mailto:${contact.email}`} className="text-sm text-primary hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Teléfono</p>
                    <a href={`tel:${contact.phone}`} className="text-sm text-primary hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {contact.company && (
                <div className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Empresa</p>
                    <p className="text-sm text-muted-foreground">{contact.company}</p>
                  </div>
                </div>
              )}

              {contact.source && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Fuente</p>
                    <Badge variant="outline" className="mt-1">
                      {contact.source}
                    </Badge>
                  </div>
                </div>
              )}

              <Separator />

              {contact.assigned_to_profile && (
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Asignado a</p>
                    <p className="text-sm text-muted-foreground">{contact.assigned_to_profile.full_name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Creado</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(contact.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {contact.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column - Timeline and deals */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="deals">Oportunidades ({deals.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Actividades</h3>
                <Button onClick={() => setIsActivityDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Actividad
                </Button>
              </div>

              <div className="space-y-4">
                {localActivities.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No hay actividades registradas
                    </CardContent>
                  </Card>
                ) : (
                  localActivities.map((activity) => {
                    const Icon = ACTIVITY_ICONS[activity.type] || FileText
                    return (
                      <Card key={activity.id}>
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{ACTIVITY_LABELS[activity.type]}</Badge>
                                  {activity.subject && <span className="font-medium">{activity.subject}</span>}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(activity.created_at), "d MMM, HH:mm", { locale: es })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              {activity.created_by_profile && (
                                <p className="text-xs text-muted-foreground">
                                  Por {activity.created_by_profile.full_name}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="deals" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Oportunidades de Venta</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Oportunidad
                </Button>
              </div>

              <div className="space-y-4">
                {deals.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No hay oportunidades registradas
                    </CardContent>
                  </Card>
                ) : (
                  deals.map((deal) => (
                    <Card key={deal.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{deal.product?.name || "Producto"}</h4>
                              <Badge
                                variant={
                                  deal.status === "won"
                                    ? "default"
                                    : deal.status === "lost"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {deal.status === "won" ? "Ganada" : deal.status === "lost" ? "Perdida" : "Pendiente"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {deal.quantity} {deal.product?.unit || "unidades"}
                            </p>
                            {deal.notes && <p className="text-sm text-muted-foreground">{deal.notes}</p>}
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(deal.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">
                              {deal.currency} ${deal.total_amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {deal.currency} ${deal.unit_price.toLocaleString()} / {deal.product?.unit}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ActivityDialog
        open={isActivityDialogOpen}
        onOpenChange={setIsActivityDialogOpen}
        contactId={contact.id}
        onSave={handleActivitySaved}
      />
    </div>
  )
}
