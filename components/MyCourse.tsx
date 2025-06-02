"use client";

import {
  Video,
  Clock,
  Globe,
} from "lucide-react";

import { useAuth } from "@/app/(firebase auth)/context/AuthContext";

import { Card } from "@/components/ui/card";
import NotionTable from "@/components/NotionTable";
import { useEffect, useState } from "react";

const fallbackLiveClassData = {
  icon: "/google-meet-meeting-communication-team.svg",
  platform: "Google Meet",
  link: "https://meet.google.com/okm-cqvu-mcx",
  datetime: "2025-06-03T18:30:00Z",
};

export default function MyCourse() {

  const { user } = useAuth();
  const displayName = user?.displayName || "";
  const firstName = displayName.split(" ")[0] || "";

  const [classData, setClassData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);

  // Encuentra la siguiente clase programada
  const nextLiveClass = classData
    .filter((c) => c.status === "Programado" && c.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;

  // Carga la data de clases
  useEffect(() => {
    fetch("/api/classes")
      .then((res) => res.json())
      .then((data) => setClassData(Array.isArray(data) ? data : []))
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
    (nextLiveClass?.link && nextLiveClass.link !== "" ? nextLiveClass.link : null) ||
    fallbackLiveClassData.link;

  // Elige la fecha a mostrar
  const classJoinDate =
    nextLiveClass?.date
      ? new Intl.DateTimeFormat("es-ES", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(nextLiveClass.date))
      : "Fecha pendiente";

  return (
    <div className="min-h-screen">
      <div className="flex">
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3 space-y-6">
<h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-white/60 to-white bg-clip-text text-transparent animate-fade-in">
  Hi, {firstName}!
</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

               
                <Card className="relative overflow-hidden group shadow-sm border-0 bg-white transition-all duration-300 hover:shadow-md">
                  <a
                    href={classJoinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative z-10 p-6"
                    title="Unirse a la reunión"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Video />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          Unirse a la clase
                        </p>
                        <div className="flex items-center text-gray-600 gap-1">
                          <Globe height={14} />
                          <p className="text-sm">Google Meet</p>
                        </div>
                        <p className="flex items-center text-[14px] text-green-600 font-medium gap-1">
                          <Clock height={14} />
                          Próxima clase:&nbsp;
                          <span className="text-gray-500">{classJoinDate}</span>
                        </p>
                      </div>
                    </div>
                  </a>
                  {/* Fondo animado */}
                  <div className="absolute bottom-0 left-0 w-full h-0 bg-gray-50 z-0 transition-all duration-300 group-hover:h-full" />
                </Card>
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
    </div>
  );
}
