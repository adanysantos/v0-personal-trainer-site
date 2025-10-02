"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, User, Calendar } from "lucide-react"
import type { WorkoutPlan } from "@/lib/types"
import { deleteWorkout } from "@/lib/workout-data"
import { useToast } from "@/hooks/use-toast"

interface WorkoutCardProps {
  workout: WorkoutPlan
  onEdit?: (workout: WorkoutPlan) => void
  showActions?: boolean
}

export function WorkoutCard({ workout, onEdit, showActions = false }: WorkoutCardProps) {
  const { toast } = useToast()

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este plano de treino?")) {
      deleteWorkout(workout.id)
      toast({
        title: "Plano excluído",
        description: "O plano de treino foi removido com sucesso",
      })
      window.location.reload()
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{workout.title}</CardTitle>
            <CardDescription className="line-clamp-2">{workout.description}</CardDescription>
          </div>
          {showActions && (
            <div className="flex gap-2 ml-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit?.(workout)} className="h-8 w-8">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{workout.studentName}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date(workout.updatedAt).toLocaleDateString("pt-BR")}</span>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm font-medium mb-2">{workout.exercises.length} exercícios</p>
          <div className="flex flex-wrap gap-2">
            {workout.exercises.slice(0, 3).map((exercise) => (
              <Badge key={exercise.id} variant="secondary" className="text-xs">
                {exercise.name}
              </Badge>
            ))}
            {workout.exercises.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{workout.exercises.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
