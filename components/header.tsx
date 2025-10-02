"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dumbbell, LogOut } from "lucide-react"
import { logout, getCurrentUser } from "@/lib/workout-data"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const router = useRouter()
  const { toast } = useToast()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    })
    router.push("/")
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">FitPro Trainer</h1>
            {user && (
              <p className="text-sm text-muted-foreground">
                {user.role === "instructor" ? "Painel do Instrutor" : "Meus Treinos"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
