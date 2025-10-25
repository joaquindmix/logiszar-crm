"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Deal {
  id: string
  quantity: number
  unit_price: number
  currency: string
  total_amount: number
  status: string
  notes: string | null
  created_at: string
  contact?: {
    id: string
    full_name: string
    company: string | null
  } | null
  product?: {
    name: string
    unit: string
  } | null
  created_by_profile?: { full_name: string } | null
}

interface DealsTableProps {
  deals: Deal[]
}

export function DealsTable({ deals }: DealsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.contact?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.contact?.company?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || deal.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar oportunidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="won">Ganadas</SelectItem>
            <SelectItem value="lost">Perdidas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contacto</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No se encontraron oportunidades
                </TableCell>
              </TableRow>
            ) : (
              filteredDeals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell>
                    {deal.contact && (
                      <Link href={`/dashboard/contacts/${deal.contact.id}`} className="hover:underline">
                        <div className="font-medium">{deal.contact.full_name}</div>
                        {deal.contact.company && (
                          <div className="text-sm text-muted-foreground">{deal.contact.company}</div>
                        )}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{deal.product?.name || "N/A"}</div>
                    {deal.product && (
                      <div className="text-sm text-muted-foreground">
                        {deal.currency} ${deal.unit_price.toLocaleString()} / {deal.product.unit}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {deal.quantity} {deal.product?.unit || "unidades"}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">
                      {deal.currency} ${deal.total_amount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={deal.status === "won" ? "default" : deal.status === "lost" ? "destructive" : "secondary"}
                    >
                      {deal.status === "won" ? "Ganada" : deal.status === "lost" ? "Perdida" : "Pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(deal.created_at), "d MMM yyyy", { locale: es })}
                    </div>
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
