"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, TrendingUp, Target } from "lucide-react"
import { WorkoutDetailCard } from "@/components/workout-detail-card"
import type { WorkoutPlan } from "@/lib/types"
import { createBrowserClient } from "@/lib/supabase/client"

export const dynamic = "force-dynamic"

export default function StudentDashboard() {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (!profile || profile.role !== "student") {
        router.push("/")
        return
      }

      setUserName(profile.name)

      const { data: plans } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("student_id", user.id)
        .order("updated_at", { ascending: false })

      if (plans) {
        setWorkouts(plans as WorkoutPlan[])
      }

      setLoading(false)
    }

    loadData()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="w-12 h-12 text-orange-500 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando seus treinos...</p>
        </div>
      </div>
    )
  }

  const totalExercises = workouts.reduce((acc, workout) => acc + workout.exercises.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Header userName={userName} />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Planos Ativos</CardTitle>
              <Target className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{workouts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Treinos disponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Exercícios</CardTitle>
              <Dumbbell className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalExercises}</div>
              <p className="text-xs text-muted-foreground mt-1">Em todos os planos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Progresso</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground mt-1">Planos sincronizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Workouts Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Meus Planos de Treino</h2>
          <p className="text-muted-foreground">Acompanhe seus treinos personalizados</p>
        </div>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum treino disponível</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Seu instrutor ainda não criou nenhum plano de treino para você. Entre em contato para receber seu
                primeiro treino personalizado!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {workouts.map((workout) => (
              <WorkoutDetailCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
