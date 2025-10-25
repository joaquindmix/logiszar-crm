"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string | null
  unit: string
  dilution_ratio: string | null
  base_price_ars: number | null
  base_price_usd: number | null
  is_active: boolean
}

interface ProductsGridProps {
  products: Product[]
  isAdmin: boolean
}

export function ProductsGrid({ products }: ProductsGridProps) {
  const activeProducts = products.filter((p) => p.is_active)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeProducts.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="py-8 text-center text-muted-foreground">No hay productos disponibles</CardContent>
        </Card>
      ) : (
        activeProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {product.unit === "liter" ? "Litro" : "Kilo"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.description && <p className="text-sm text-muted-foreground">{product.description}</p>}

              {product.dilution_ratio && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dilución:</span>
                  <span className="font-medium">{product.dilution_ratio}</span>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t">
                {product.base_price_ars && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Precio ARS:</span>
                    <span className="text-lg font-bold">$ {product.base_price_ars.toLocaleString()}</span>
                  </div>
                )}
                {product.base_price_usd && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Precio USD:</span>
                    <span className="text-lg font-bold">US$ {product.base_price_usd.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
