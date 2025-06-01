"use client"

import {
  BookOpen,
  BarChart3,
  HelpCircle,
  Settings,
  CreditCard,
} from "lucide-react"


import { useState } from "react"
import { useAuth } from "@/app/(firebase auth)/context/AuthContext";
import Header from "@/app/global-components/Header";



import MyCourseContent from "@/components/MyCourse"
import Footer from "@/app/global-components/Footer"

const sidebarItems = [
  { icon: BookOpen, label: "My Course" },
   // { icon: BarChart3, label: "Report" },
  // { icon: CreditCard, label: "Subscription" },
  // { icon: HelpCircle, label: "Help Center" },
  // { icon: Settings, label: "Settings" },
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
  MyCourse, Report, Subscription, HelpCenter, SettingsSection
]

export default function Dashboard() {

  // 0: My Course, 1: Report, etc.
  const [activeIndex, setActiveIndex] = useState(0)
  const ActiveComponent = sectionComponents[activeIndex]


  return (
    <div className="min-h-screen bg-[#2C2A4A]">
      {/* Header */}
      <Header/>

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

        {/* Main Content */}
        <main className="flex-1 p-6">
        <ActiveComponent />
        </main>
      </div>
      <Footer/>
    </div>
  )
}
