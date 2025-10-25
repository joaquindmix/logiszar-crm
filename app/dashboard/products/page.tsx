import { createClient } from "@/lib/supabase/server"
import { ProductsGrid } from "@/components/products-grid"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase.from("products").select("*").order("name", { ascending: true })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id || "")
    .single()

  const isAdmin = profile?.role === "admin"

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">Catálogo de productos de cloro</p>
        </div>
        {isAdmin && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        )}
      </div>

      <ProductsGrid products={products || []} isAdmin={isAdmin} />
    </div>
  )
}
