"use client";

import {
  Video,
  Clock,
} from "lucide-react";

import { useAuth } from "@/app/(firebase auth)/context/AuthContext";

import GlassCard from "@/components/GlassCard";
import NotionTable from "@/components/NotionTable";
import Courses from "@/components/home/Courses";
import { useEffect, useState } from "react";

const fallbackLiveClassData = {
  icon: "/google-meet-meeting-communication-team.svg",
  platform: "Google Meet",
  link: "https://meet.google.com/okm-cqvu-mcx",
  datetime: "2025-06-03T18:30:00Z",
};

interface ClassDataItem {
  status: string;
  datetime: string;
  page_id: string; // Make page_id required
  class_title: string; // Make class_title required
  course: string; // Make course required
  recording: string | null; // Make recording explicitly string | null
  icon: string | null; // Make icon explicitly string | null
}

export default function MyCourse() {

  const { user } = useAuth();
  const displayName = user?.displayName || "";
  const firstName = displayName.split(" ")[0] || "";

  const [classData, setClassData] = useState<ClassDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [hasStudentAccess, setHasStudentAccess] = useState(true); // New state variable

  // Encuentra la siguiente clase programada
  const nextLiveClass = classData
    .filter((c) => c.status && c.status.toLowerCase() === "scheduled" && c.datetime)
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())[0] || null;

  // Carga la data de clases
  useEffect(() => {
    fetch("/api/classes")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.hasAccess === false) {
          setHasStudentAccess(false);
        } else {
          const processedData = Array.isArray(data) ? data.map(c => ({
            ...c,
            status: c.status || "unassigned",
            page_id: c.page_id || "", // Ensure page_id is always a string
            class_title: c.class_title || "", // Ensure class_title is always a string
            course: c.course || "", // Ensure course is always a string
            recording: c.recording || null, // Ensure recording is always string or null
            icon: c.icon || null, // Ensure icon is always string or null
          })) : [];
          setClassData(processedData);
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos de clases:", error);
        setHasStudentAccess(false); // Assume no access on fetch error
      })
      .finally(() => setLoading(false));
  }, []);

  // Carga el enlace de reunión personalizado
  useEffect(() => {
    fetch("/api/meeting-link")
      .then(res => res.json())
      .then(data => {
        if (data.meeting_link) setMeetingLink(data.meeting_link);
        else setMeetingLink(null);
      });
  }, []);

  // Elige el link a mostrar (prioridad: personalizado > próxima clase programada > fallback)
  const classJoinLink =
    meetingLink ||
    (nextLiveClass?.page_id ? `https://notion.so/${nextLiveClass.page_id.replace(/-/g, "")}` : null) ||
    fallbackLiveClassData.link;

  // Elige la fecha a mostrar
  const classJoinDate =
    nextLiveClass?.datetime
      ? new Intl.DateTimeFormat("es-ES", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(nextLiveClass.datetime))
      : "Fecha pendiente";

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <svg
            className="animate-spin h-10 w-10 mb-3 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <p className="text-gray-300 text-base font-medium">Cargando...</p>
        </div>
      ) : !hasStudentAccess ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-extrabold text-center mb-6 leading-tight bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent drop-shadow-lg">
            ¡Bienvenido a English with John! 👋
          </h2>
          <p className="text-sm md:text-2xl text-center max-w-2xl mb-12 text-gray-200 leading-relaxed">
            Parece que aún no tienes clases asignadas. Explora mis cursos especializados o agenda una clase gratuita para empezar tu viaje de aprendizaje.
          </p>
          <Courses />
        </div>
      ) : (
        <div className="flex">
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <div className="lg:col-span-3 space-y-6">
                <h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-white/60 to-white bg-clip-text text-transparent animate-fade-in">
                  Hi, {firstName}!
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GlassCard className="hover:border-indigo-400/50 transition-all duration-300">
                    <a
                      href={classJoinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative z-10 p-6"
                      title="Unirse a la reunión"
                    >
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-indigo-500/20 rounded-lg ring-2 ring-indigo-400/30">
                          <Video className="w-8 h-8 text-indigo-300" />
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-white">
                            {nextLiveClass ? nextLiveClass.class_title : "Unirse a la clase"}
                          </p>
                          <p className="text-sm text-white/70 -mt-1">
                            {nextLiveClass ? nextLiveClass.course : "Google Meet"}
                          </p>
                          <p className="flex items-center text-sm text-indigo-300 font-medium gap-1.5 mt-2">
                            <Clock height={14} />
                            <span>{classJoinDate}</span>
                          </p>
                        </div>
                      </div>
                    </a>
                  </GlassCard>
                </div>
              </div>
            </div>
            <hr className="my-4 border-[#353259]" />
            <section>
              <h2 className="text-lg text-white font-bold mb-4 hidden md:block">Tus clases</h2>
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <svg
                    className="animate-spin h-10 w-10 mb-3 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <p className="text-gray-300 text-base font-medium">Cargando clases...</p>
                </div>
              ) : (
                <NotionTable data={classData} />
              )}
            </section>
          </main>
        </div>
      )}
    </div>
  );
}
