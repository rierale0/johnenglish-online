"use client"

import { useState } from "react"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { ClassAttendance } from "@/components/class-attendance"
import type { Class } from "@/types"
import { mockClasses } from "@/lib/mock-data"

export function DashboardPage() {
  const [classes, setClasses] = useState<Class[]>(mockClasses)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)

  const selectedClass = selectedClassId ? classes.find((c) => c.id === selectedClassId) : null

  const handleAttendanceChange = (classId: string, studentId: string, isPresent: boolean) => {
    setClasses((prevClasses) =>
      prevClasses.map((c) => {
        if (c.id === classId) {
          return {
            ...c,
            students: c.students.map((student) => {
              if (student.id === studentId) {
                return { ...student, isPresent }
              }
              return student
            }),
          }
        }
        return c
      }),
    )
  }

  const handleSaveAttendance = (classId: string) => {
    // In a real app, this would save to a database
    console.log("Saving attendance for class:", classId)

    // Show success message by updating the class
    setClasses((prevClasses) =>
      prevClasses.map((c) => {
        if (c.id === classId) {
          return {
            ...c,
            lastSaved: new Date().toLocaleString(),
          }
        }
        return c
      }),
    )
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <TeacherDashboard classes={classes} selectedClassId={selectedClassId} onSelectClass={setSelectedClassId} />
      <main className="flex-1 p-4 md:p-6">
        {selectedClass ? (
          <ClassAttendance
            classData={selectedClass}
            onAttendanceChange={handleAttendanceChange}
            onSave={handleSaveAttendance}
          />
        ) : (
          <div className="flex h-[80vh] items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700">Seleccione una clase</h2>
              <p className="text-muted-foreground mt-2">Elija una clase del menú para registrar la asistencia</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

