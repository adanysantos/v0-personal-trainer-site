export type UserRole = "instructor" | "student"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
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
  student_id: string
  student_name: string
  title: string
  description: string
  exercises: Exercise[]
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  name: string
  email: string
  role: UserRole
  created_at: string
}
