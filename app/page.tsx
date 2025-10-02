"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell } from "lucide-react"
import { login, initializeData, getCurrentUser } from "@/lib/workout-data"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    initializeData()

    // Check if user is already logged in
    const currentUser = getCurrentUser()
    if (currentUser) {
      router.push(currentUser.role === "instructor" ? "/instructor" : "/student")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = login(email, password)

      if (user) {
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo, ${user.name}`,
        })

        // Redirect based on role
        router.push(user.role === "instructor" ? "/instructor" : "/student")
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">FitPro Trainer</CardTitle>
            <CardDescription className="text-base mt-2">Sistema de Gerenciamento de Treinos</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg space-y-2 text-sm">
            <p className="font-semibold">Contas de teste:</p>
            <div className="space-y-1">
              <p>
                <strong>Instrutor:</strong> instrutor@gym.com / instrutor123
              </p>
              <p>
                <strong>Aluno:</strong> maria@email.com / aluno123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
