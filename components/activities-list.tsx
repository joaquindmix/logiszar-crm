"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, PhoneCall, MessageSquare, Mail, FileText, Video } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Activity {
  id: string
  type: string
  subject: string | null
  description: string
  created_at: string
  contact?: {
    id: string
    full_name: string
    company: string | null
  } | null
  created_by_profile?: { full_name: string } | null
}

interface ActivitiesListProps {
  initialActivities: Activity[]
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

const ACTIVITY_COLORS: Record<string, string> = {
  call: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  whatsapp: "bg-green-500/10 text-green-700 dark:text-green-400",
  email: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  note: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  meeting: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
}

export function ActivitiesList({ initialActivities }: ActivitiesListProps) {
  const [activities] = useState<Activity[]>(initialActivities)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.contact?.full_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || activity.type === filterType

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar actividades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="call">Llamadas</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="email">Emails</SelectItem>
            <SelectItem value="meeting">Reuniones</SelectItem>
            <SelectItem value="note">Notas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">No se encontraron actividades</CardContent>
          </Card>
        ) : (
          filteredActivities.map((activity) => {
            const Icon = ACTIVITY_ICONS[activity.type] || FileText
            return (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className={ACTIVITY_COLORS[activity.type]}>
                            {ACTIVITY_LABELS[activity.type]}
                          </Badge>
                          {activity.subject && <span className="font-medium">{activity.subject}</span>}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(activity.created_at), "d MMM yyyy, HH:mm", { locale: es })}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">{activity.description}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {activity.contact && (
                          <Link
                            href={`/dashboard/contacts/${activity.contact.id}`}
                            className="hover:text-primary hover:underline"
                          >
                            {activity.contact.full_name}
                            {activity.contact.company && ` - ${activity.contact.company}`}
                          </Link>
                        )}
                        {activity.created_by_profile && <span>Por {activity.created_by_profile.full_name}</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
