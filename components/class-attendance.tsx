"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Check, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import type { Class } from "@/types"

interface ClassAttendanceProps {
  classData: Class
  onAttendanceChange: (classId: string, studentId: string, isPresent: boolean) => void
  onSave: (classId: string) => void
}

export function ClassAttendance({ classData, onAttendanceChange, onSave }: ClassAttendanceProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      onSave(classData.id)
      setIsSaving(false)

      toast({
        title: "Asistencia guardada",
        description: "Los registros de asistencia han sido actualizados",
      })
    }, 800)
  }

  const presentCount = classData.students.filter((student) => student.isPresent).length
  const totalStudents = classData.students.length
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{classData.name}</CardTitle>
        <CardDescription>
          {format(new Date(classData.date), "PPPP", { locale: es })}
          {classData.lastSaved && (
            <span className="ml-2 text-xs text-muted-foreground">· Último guardado: {classData.lastSaved}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Registro de Asistencia</h3>
            <p className="text-sm text-muted-foreground">
              {presentCount} de {totalStudents} estudiantes presentes ({attendanceRate}%)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                classData.students.forEach((student) => {
                  onAttendanceChange(classData.id, student.id, true)
                })
              }}
            >
              <Check className="mr-1 h-4 w-4" /> Todos presentes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                classData.students.forEach((student) => {
                  onAttendanceChange(classData.id, student.id, false)
                })
              }}
            >
              <X className="mr-1 h-4 w-4" /> Todos ausentes
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Estudiante</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classData.students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Checkbox
                    checked={student.isPresent}
                    onCheckedChange={(checked) => {
                      onAttendanceChange(classData.id, student.id, !!checked)
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.id}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      student.isPresent
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {student.isPresent ? "Presente" : "Ausente"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>Guardando...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Asistencia
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

