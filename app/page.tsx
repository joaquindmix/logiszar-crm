import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-balance">
            Logizar <span className="text-primary">CRM</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Sistema de gestión de contactos y ventas para tu negocio de cloro
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/auth/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/sign-up">Crear Cuenta</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">Pipeline Visual</h3>
            <p className="text-sm text-muted-foreground">Gestiona tus leads con un tablero Kanban intuitivo</p>
          </div>
          <div className="p-6 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">Seguimiento Completo</h3>
            <p className="text-sm text-muted-foreground">Registra llamadas, emails y actividades de cada contacto</p>
          </div>
          <div className="p-6 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">Gestión de Productos</h3>
            <p className="text-sm text-muted-foreground">Catálogo de productos con precios en ARS y USD</p>
          </div>
        </div>
      </div>
    </div>
  )
}
