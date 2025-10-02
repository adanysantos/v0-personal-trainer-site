import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Conta criada com sucesso!</CardTitle>
          <CardDescription className="text-base">Verifique seu email para confirmar sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Enviamos um email de confirmação para o endereço fornecido. Por favor, clique no link do email para ativar
            sua conta antes de fazer login.
          </p>
          <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
            <Link href="/">Voltar para o login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
