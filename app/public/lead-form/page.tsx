import { PublicLeadForm } from "@/components/public-lead-form"

export default function PublicLeadFormPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Logizar CRM</h1>
          <p className="text-xl text-muted-foreground">Solicita información sobre nuestros productos de cloro</p>
        </div>

        <PublicLeadForm />
      </div>
    </div>
  )
}
