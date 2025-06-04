"use client"

import { BookOpen } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/app/(firebase auth)/context/AuthContext"

import Header from "@/app/global-components/Header"
import MyCourseContent from "@/components/MyCourse"
import Footer from "@/app/global-components/Footer"

// Sidebar items
const sidebarItems = [
  { icon: BookOpen, label: "My Course" },
]

// Componentes por cada sección
function MyCourse() {
  return <MyCourseContent />
}
function Report() {
  return <div>Contenido de Report</div>
}
function Subscription() {
  return <div>Contenido de Subscription</div>
}
function HelpCenter() {
  return <div>Contenido de Help Center</div>
}
function SettingsSection() {
  return <div>Contenido de Settings</div>
}

// Mapear sección activa a componente
const sectionComponents = [
  MyCourse, Report, Subscription, HelpCenter, SettingsSection,
]

export default function Dashboard() {
  const [activeIndex, setActiveIndex] = useState(0)
  const ActiveComponent = sectionComponents[activeIndex]

  const { user, loading: authLoading } = useAuth()

  // Esperar a que Firebase cargue el estado del usuario
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#222222]">
        <div className="text-white text-lg animate-pulse">Cargando...</div>
      </div>
    )
  }

  // Si no hay usuario, redirigir o mostrar algo apropiado
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#222222]">
        <p className="text-white">Debes iniciar sesión para acceder a tu curso</p>
      </div>
    )
  }

  // Usuario cargado y autenticado: renderizar el dashboard
  return (
    <div className="min-h-screen bg-[#2C2A4A]">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-[#343154] min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${activeIndex === idx
                        ? "bg-[#4F518C] text-white"
                        : "text-gray-100 hover:bg-gray-50 hover:text-gray-900"}
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <ActiveComponent />
        </main>
      </div>
      <Footer />
    </div>
  )
}
