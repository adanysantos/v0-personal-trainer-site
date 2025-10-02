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
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="text-center">
              Enviamos um email de confirmação para o endereço fornecido. Por favor, clique no link do email para ativar
              sua conta antes de fazer login.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
              <p className="font-medium text-orange-900">O email não chegou?</p>
              <ul className="list-disc list-inside space-y-1 text-orange-800">
                <li>Verifique sua pasta de spam ou lixo eletrônico</li>
                <li>Aguarde alguns minutos - pode demorar um pouco</li>
                <li>Verifique se digitou o email corretamente</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="font-medium text-blue-900">💡 Modo de desenvolvimento</p>
              <p className="text-blue-800 text-xs">
                Se você está testando em desenvolvimento, o Supabase pode não enviar emails reais. Verifique o console
                do Supabase ou os logs do servidor para encontrar o link de confirmação.
              </p>
            </div>
          </div>

          <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
            <Link href="/">Voltar para o login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
