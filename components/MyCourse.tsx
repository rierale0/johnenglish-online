"use client";

import {
  Video,
  Clock,
  Globe,
} from "lucide-react";

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
            <h2 className="text-lg text-white font-bold mb-4">Tus clases</h2>
            {loading ? (
              <div className="text-center text-gray-400">Cargando clases...</div>
            ) : (
              <NotionTable data={classData} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
