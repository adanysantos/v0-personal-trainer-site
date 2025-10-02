import type { User, WorkoutPlan } from "./types"

// Mock users data
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Carlos Silva",
    email: "instrutor@gym.com",
    role: "instructor",
    password: "instrutor123",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    role: "student",
    password: "aluno123",
  },
  {
    id: "3",
    name: "João Oliveira",
    email: "joao@email.com",
    role: "student",
    password: "aluno123",
  },
]

// Mock workout plans data
export const MOCK_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: "1",
    studentId: "2",
    studentName: "Maria Santos",
    title: "Treino A - Peito e Tríceps",
    description: "Foco em hipertrofia de membros superiores",
    exercises: [
      {
        id: "1",
        name: "Supino Reto",
        sets: 4,
        reps: "8-12",
        rest: "90s",
        notes: "Controlar a descida",
      },
      {
        id: "2",
        name: "Supino Inclinado",
        sets: 3,
        reps: "10-12",
        rest: "60s",
      },
      {
        id: "3",
        name: "Tríceps Pulley",
        sets: 3,
        reps: "12-15",
        rest: "45s",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    studentId: "3",
    studentName: "João Oliveira",
    title: "Treino B - Costas e Bíceps",
    description: "Desenvolvimento de dorsal e braços",
    exercises: [
      {
        id: "1",
        name: "Puxada Frontal",
        sets: 4,
        reps: "8-12",
        rest: "90s",
      },
      {
        id: "2",
        name: "Remada Curvada",
        sets: 4,
        reps: "8-10",
        rest: "90s",
        notes: "Manter costas retas",
      },
      {
        id: "3",
        name: "Rosca Direta",
        sets: 3,
        reps: "10-12",
        rest: "60s",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// LocalStorage keys
const STORAGE_KEYS = {
  USERS: "pt_users",
  WORKOUTS: "pt_workouts",
  CURRENT_USER: "pt_current_user",
}

// Initialize localStorage with mock data
export function initializeData() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS))
  }

  if (!localStorage.getItem(STORAGE_KEYS.WORKOUTS)) {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(MOCK_WORKOUT_PLANS))
  }
}

// User functions
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  return data ? JSON.parse(data) : []
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return data ? JSON.parse(data) : null
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

export function login(email: string, password: string): User | null {
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.password === password)
  if (user) {
    setCurrentUser(user)
  }
  return user || null
}

export function logout() {
  setCurrentUser(null)
}

// Workout functions
export function getWorkouts(): WorkoutPlan[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS)
  return data ? JSON.parse(data) : []
}

export function getWorkoutsByStudent(studentId: string): WorkoutPlan[] {
  return getWorkouts().filter((w) => w.studentId === studentId)
}

export function getWorkoutById(id: string): WorkoutPlan | null {
  return getWorkouts().find((w) => w.id === id) || null
}

export function saveWorkout(workout: Omit<WorkoutPlan, "id" | "createdAt" | "updatedAt"> | WorkoutPlan) {
  const workouts = getWorkouts()

  if ("id" in workout) {
    // Update existing
    const index = workouts.findIndex((w) => w.id === workout.id)
    if (index !== -1) {
      workouts[index] = {
        ...workout,
        updatedAt: new Date().toISOString(),
      }
    }
  } else {
    // Create new
    const newWorkout: WorkoutPlan = {
      ...workout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    workouts.push(newWorkout)
  }

  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts))
}

export function deleteWorkout(id: string) {
  const workouts = getWorkouts().filter((w) => w.id !== id)
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts))
}

export function getStudents(): User[] {
  return getUsers().filter((u) => u.role === "student")
}
