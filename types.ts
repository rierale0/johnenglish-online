export interface Student {
  id: string
  name: string
  isPresent: boolean
}

export interface Class {
  id: string
  name: string
  date: string
  students: Student[]
  lastSaved?: string
}

export interface Teacher {
  name: string
  email: string
  classes: Class[]
}