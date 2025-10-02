export type UserRole = "instructor" | "student"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  password: string
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  notes?: string
}

export interface WorkoutPlan {
  id: string
  studentId: string
  studentName: string
  title: string
  description: string
  exercises: Exercise[]
  createdAt: string
  updatedAt: string
}
