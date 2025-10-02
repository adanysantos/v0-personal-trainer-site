"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Dumbbell, Calendar } from "lucide-react"
import { getCurrentUser, getWorkouts, getStudents } from "@/lib/workout-data"
import { WorkoutCard } from "@/components/workout-card"
import { WorkoutDialog } from "@/components/workout-dialog"
import type { WorkoutPlan } from "@/lib/types"

export default function InstructorDashboard() {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<WorkoutPlan | null>(null)
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "instructor") {
      router.push("/")
      return
    }

    loadWorkouts()
  }, [router])

  const loadWorkouts = () => {
    setWorkouts(getWorkouts())
  }

  const handleCreateNew = () => {
    setEditingWorkout(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (workout: WorkoutPlan) => {
    setEditingWorkout(workout)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingWorkout(null)
    loadWorkouts()
  }

  const students = getStudents()
  const totalWorkouts = workouts.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Alunos</CardTitle>
              <Users className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{students.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Planos de Treino</CardTitle>
              <Dumbbell className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalWorkouts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ativos Hoje</CardTitle>
              <Calendar className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Workouts Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Planos de Treino</h2>
            <p className="text-muted-foreground">Gerencie os treinos dos seus alunos</p>
          </div>
          <Button onClick={handleCreateNew} className="gap-2 bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4" />
            Novo Plano
          </Button>
        </div>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum plano de treino ainda</h3>
              <p className="text-muted-foreground mb-4">Comece criando o primeiro plano para seus alunos</p>
              <Button onClick={handleCreateNew} className="gap-2 bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4" />
                Criar Primeiro Plano
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} onEdit={handleEdit} showActions />
            ))}
          </div>
        )}
      </main>

      <WorkoutDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        workout={editingWorkout}
        onClose={handleDialogClose}
      />
    </div>
  )
}
