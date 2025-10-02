"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Dumbbell, Calendar } from "lucide-react"
import { WorkoutCard } from "@/components/workout-card"
import { WorkoutDialog } from "@/components/workout-dialog"
import type { WorkoutPlan } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export const dynamic = "force-dynamic"

export default function InstructorDashboard() {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<WorkoutPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/")
      return
    }

    // Check if user is instructor
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

    if (profile?.user_type !== "instructor") {
      router.push("/student")
      return
    }

    await loadData(user.id)
  }

  const loadData = async (instructorId: string) => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      // Load students
      const { data: studentsData } = await supabase.from("profiles").select("*").eq("user_type", "student")

      setStudents(studentsData || [])

      // Load workouts with exercises
      const { data: workoutsData } = await supabase
        .from("workout_plans")
        .select(`
          *,
          exercises (*),
          student:profiles!workout_plans_student_id_fkey (full_name)
        `)
        .eq("instructor_id", instructorId)
        .order("created_at", { ascending: false })

      const formattedWorkouts: WorkoutPlan[] = (workoutsData || []).map((w: any) => ({
        id: w.id,
        studentId: w.student_id,
        studentName: w.student?.full_name || "Aluno",
        title: w.title,
        description: w.description || "",
        exercises: (w.exercises || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((e: any) => ({
            id: e.id,
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            rest: e.rest_time || "",
            notes: e.notes || "",
          })),
        createdAt: w.created_at,
        updatedAt: w.updated_at,
      }))

      setWorkouts(formattedWorkouts)
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNew = () => {
    setEditingWorkout(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (workout: WorkoutPlan) => {
    setEditingWorkout(workout)
    setIsDialogOpen(true)
  }

  const handleDialogClose = async () => {
    setIsDialogOpen(false)
    setEditingWorkout(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await loadData(user.id)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="w-12 h-12 text-orange-500 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

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
              <div className="text-3xl font-bold">{workouts.length}</div>
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
        students={students}
        onClose={handleDialogClose}
      />
    </div>
  )
}
