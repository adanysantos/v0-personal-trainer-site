"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Dumbbell, Calendar } from "lucide-react"
import { WorkoutCard } from "@/components/workout-card"
import { WorkoutDialog } from "@/components/workout-dialog"
import type { WorkoutPlan, Profile } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export const dynamic = "force-dynamic"

// --- Hook Personalizado para Lógica de Dados e Autenticação ---
interface DashboardData {
  workouts: WorkoutPlan[]
  students: Profile[]
  isLoading: boolean
  loadData: () => Promise<void>
}

// Define a more specific type for the data coming from the Supabase query.
// This improves type safety and autocompletion.
type WorkoutFromDB = {
  id: string
  student_id: string
  title: string
  description: string | null
  created_at: string
  updated_at: string
  student: {
    full_name: string
  } | null
  exercises: {
    id: string
    name: string
    sets: number
    reps: string
    rest_time: string | null
    notes: string | null
    order_index: number
  }[]
}

// Função utilitária para carregar os dados
const fetchInstructorData = async (instructorId: string, toast: ReturnType<typeof useToast>["toast"]) => {
  const supabase = createClient()
  
  try {
    // 1. Load students (All students, assuming any instructor sees all students for assignment)
    const { data: studentsData, error: studentsError } = await supabase.from("profiles").select("*").eq("user_type", "student")

    if (studentsError) throw studentsError

    // 2. Load workouts with exercises
    const { data: workoutsData, error: workoutsError } = await supabase
      .from("workout_plans")
      .select(`
        *,
        exercises(*),
        student:profiles!workout_plans_student_id_fkey (full_name)
      `)
      .eq("instructor_id", instructorId)
      .order("created_at", { ascending: false })

    if (workoutsError) throw workoutsError

    // Map the database results to the application's WorkoutPlan type with strong typing.
    const formattedWorkouts: WorkoutPlan[] = (workoutsData as WorkoutFromDB[] || []).map((w) => ({
      id: w.id,
      student_id: w.student_id,
      student_name: w.student?.full_name || "Aluno Desconhecido",
      title: w.title,
      description: w.description || "",
      exercises: (w.exercises || [])
        .sort((a, b) => a.order_index - b.order_index)
        .map((e) => ({
        id: e.id,
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        rest: e.rest_time || "",
        notes: e.notes || "",
        })),
      created_at: w.created_at,
      updated_at: w.updated_at,
    }))
    
    return { students: studentsData || [], workouts: formattedWorkouts }

  } catch (error: any) {
    toast({
      title: "Erro ao carregar dados",
      description: error.message,
      variant: "destructive",
    })
    return { students: [], workouts: [] }
  }
}

const useInstructorDashboardData = (): DashboardData => {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([])
  const [students, setStudents] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const loadData = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/")
      return // Interrompe se não houver usuário
    }

    // Check if user is instructor
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

    if (profile?.user_type !== "instructor") {
      router.push("/student")
      return // Interrompe se não for instrutor
    }

    const { students: loadedStudents, workouts: loadedWorkouts } = await fetchInstructorData(user.id, toast)

    setStudents(loadedStudents)
    setWorkouts(loadedWorkouts)
    setIsLoading(false)
  }, [router, toast])


  useEffect(() => {
    // Carrega os dados quando o componente é montado
    loadData()
  }, [loadData])

  return { workouts, students, isLoading, loadData }
}
// -----------------------------------------------------------------


export default function InstructorDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<WorkoutPlan | null>(null)
  
  // Usando o hook para gerenciar dados e estado de loading
  const { workouts, students, isLoading, loadData } = useInstructorDashboardData()

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
    
    // Recarrega os dados após fechar o dialog (se foi criado/editado)
    await loadData()
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Alunos Ativos</CardTitle>
              <Calendar className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{students.length}</div> 
              {/* Mantido students.length, mas este card pode ser melhorado com uma contagem real de ativos */}
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