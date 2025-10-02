"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import type { WorkoutPlan } from "@/lib/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface WorkoutDetailCardProps {
  workout: WorkoutPlan
}

export function WorkoutDetailCard({ workout }: WorkoutDetailCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{workout.title}</CardTitle>
            <CardDescription className="text-orange-50">{workout.description}</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {workout.exercises.length} exercícios
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-orange-50 mt-4">
          <Calendar className="w-4 h-4" />
          <span>Atualizado em {new Date(workout.updatedAt).toLocaleDateString("pt-BR")}</span>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {workout.exercises.map((exercise, index) => (
            <AccordionItem key={exercise.id} value={exercise.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{exercise.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets} séries × {exercise.reps} reps
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-11 pt-2 space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Séries</p>
                      <p className="text-lg font-bold">{exercise.sets}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Repetições</p>
                      <p className="text-lg font-bold">{exercise.reps}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Descanso</p>
                      <p className="text-lg font-bold">{exercise.rest}</p>
                    </div>
                  </div>

                  {exercise.notes && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-orange-900 mb-1">Observações do Instrutor</p>
                      <p className="text-sm text-orange-800">{exercise.notes}</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
