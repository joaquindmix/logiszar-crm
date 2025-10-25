import { createClient } from "@/lib/supabase/server"
import { DealsTable } from "@/components/deals-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default async function DealsPage() {
  const supabase = await createClient()

  const { data: deals } = await supabase
    .from("deals")
    .select(
      `
      *,
      contact:contacts(id, full_name, company),
      product:products(name, unit),
      created_by_profile:profiles!deals_created_by_fkey(full_name)
    `,
    )
    .order("created_at", { ascending: false })

  // Calculate metrics
  const totalDeals = deals?.length || 0
  const wonDeals = deals?.filter((d) => d.status === "won") || []
  const pendingDeals = deals?.filter((d) => d.status === "pending") || []

  const totalRevenue = wonDeals.reduce((sum, deal) => {
    if (deal.currency === "ARS") {
      return sum + deal.total_amount
    }
    return sum
  }, 0)

  const totalRevenueUSD = wonDeals.reduce((sum, deal) => {
    if (deal.currency === "USD") {
      return sum + deal.total_amount
    }
    return sum
  }, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Oportunidades</h1>
          <p className="text-muted-foreground">Gestiona las oportunidades de venta</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Oportunidad
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-muted-foreground">Total Oportunidades</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{wonDeals.length}</div>
            <p className="text-xs text-muted-foreground">Ganadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">ARS ${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ingresos en Pesos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">USD ${totalRevenueUSD.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ingresos en Dólares</p>
          </CardContent>
        </Card>
      </div>

      <DealsTable deals={deals || []} />
    </div>
  )
}
