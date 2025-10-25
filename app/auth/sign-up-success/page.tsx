import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Registro Exitoso!</CardTitle>
            <CardDescription>Tu cuenta ha sido creada correctamente</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Hemos enviado un correo de confirmación a tu email. Por favor, verifica tu correo para activar tu cuenta.
            </p>
            <p className="text-sm text-muted-foreground">
              Una vez confirmado, podrás{" "}
              <Link href="/auth/login" className="text-primary underline underline-offset-4 hover:text-primary/80">
                iniciar sesión
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
