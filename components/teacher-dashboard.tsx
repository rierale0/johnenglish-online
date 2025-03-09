"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, ChevronLeft, Menu, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Class } from "@/types"

interface TeacherDashboardProps {
  classes: Class[]
  selectedClassId: string | null
  onSelectClass: (classId: string) => void
}

export function TeacherDashboard({ classes, selectedClassId, onSelectClass }: TeacherDashboardProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-40 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-0 z-30 w-full transform bg-background transition-transform duration-200 ease-in-out md:relative md:w-64 md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex h-full flex-col border-r">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Panel del Profesor</h1>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(false)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-4">
            <h2 className="mb-2 font-medium">Mis Clases</h2>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {classes.map((classItem) => (
                <button
                  key={classItem.id}
                  onClick={() => {
                    onSelectClass(classItem.id)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full rounded-md px-3 py-2 text-left text-sm transition-colors
                    ${selectedClassId === classItem.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                  `}
                >
                  <div className="font-medium">{classItem.name}</div>
                  <div className="flex items-center text-xs">
                    <Calendar className="mr-1 h-3 w-3" />
                    {format(new Date(classItem.date), "PPP", { locale: es })}
                  </div>
                  <div className="flex items-center text-xs">
                    <Users className="mr-1 h-3 w-3" />
                    {classItem.students.length} estudiantes
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}

