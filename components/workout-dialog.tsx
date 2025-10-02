"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import type { WorkoutPlan, Exercise } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface WorkoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workout?: WorkoutPlan | null
  onClose: () => void
}

interface Student {
  id: string
  name: string
  email: string
}

export function WorkoutDialog({ open, onOpenChange, workout, onClose }: WorkoutDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [studentId, setStudentId] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await supabase.from("profiles").select("id, name, email").eq("role", "student")
      if (data) {
        setStudents(data)
      }
    }
    fetchStudents()
  }, [supabase])

  useEffect(() => {
    if (workout) {
      setTitle(workout.title)
      setDescription(workout.description)
      setStudentId(workout.studentId)
      setExercises(workout.exercises)
    } else {
      setTitle("")
      setDescription("")
      setStudentId("")
      setExercises([])
    }
  }, [workout])

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Date.now().toString(),
        name: "",
        sets: 3,
        reps: "10-12",
        rest: "60s",
        notes: "",
      },
    ])
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((e) => e.id !== id))
  }

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises(exercises.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const handleSave = async () => {
    if (!title || !studentId || exercises.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos e adicione pelo menos um exercício",
        variant: "destructive",
      })
      return
    }

    const student = students.find((s) => s.id === studentId)
    if (!student) return

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const workoutData = {
      instructor_id: user.id,
      student_id: studentId,
      student_name: student.name,
      title,
      description,
      exercises,
    }

    if (workout) {
      const { error } = await supabase.from("workout_plans").update(workoutData).eq("id", workout.id)
      if (error) {
        toast({
          title: "Erro ao atualizar",
          description: "Não foi possível atualizar o plano de treino",
          variant: "destructive",
        })
        return
      }
    } else {
      const { error } = await supabase.from("workout_plans").insert(workoutData)
      if (error) {
        toast({
          title: "Erro ao criar",
          description: "Não foi possível criar o plano de treino",
          variant: "destructive",
        })
        return
      }
    }

    toast({
      title: workout ? "Plano atualizado" : "Plano criado",
      description: workout ? "O plano de treino foi atualizado com sucesso" : "Novo plano de treino criado",
    })

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{workout ? "Editar Plano de Treino" : "Novo Plano de Treino"}</DialogTitle>
          <DialogDescription>
            {workout ? "Atualize as informações do plano de treino" : "Crie um novo plano de treino para seu aluno"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="student">Aluno</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título do Treino</Label>
            <Input
              id="title"
              placeholder="Ex: Treino A - Peito e Tríceps"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o objetivo deste treino..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Exercícios</Label>
              <Button type="button" variant="outline" size="sm" onClick={addExercise} className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                Adicionar Exercício
              </Button>
            </div>

            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="p-4 border rounded-lg space-y-3 bg-muted/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Exercício {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(exercise.id)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <Label>Nome do Exercício</Label>
                    <Input
                      placeholder="Ex: Supino Reto"
                      value={exercise.name}
                      onChange={(e) => updateExercise(exercise.id, "name", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Séries</Label>
                    <Input
                      type="number"
                      placeholder="3"
                      value={exercise.sets}
                      onChange={(e) => updateExercise(exercise.id, "sets", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label>Repetições</Label>
                    <Input
                      placeholder="10-12"
                      value={exercise.reps}
                      onChange={(e) => updateExercise(exercise.id, "reps", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Descanso</Label>
                    <Input
                      placeholder="60s"
                      value={exercise.rest}
                      onChange={(e) => updateExercise(exercise.id, "rest", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Observações</Label>
                    <Input
                      placeholder="Opcional"
                      value={exercise.notes || ""}
                      onChange={(e) => updateExercise(exercise.id, "notes", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {exercises.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum exercício adicionado ainda</p>
                <p className="text-sm">Clique em "Adicionar Exercício" para começar</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
            {workout ? "Atualizar" : "Criar"} Plano
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
