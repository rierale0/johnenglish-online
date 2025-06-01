"use client";

import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import Image from "next/image";

type ClassItem = {
  id: number;
  title: string;
  datetime: string; // ISO datetime string
  duration: string;
  level: string;
  meetLink: string;
  notes: string;
};

interface NextClassesListProps {
  classes: ClassItem[];
}

export const NextClassesList: React.FC<NextClassesListProps> = ({
  classes,
}) => {
  const [visibleCount, setVisibleCount] = useState(2);
  const [locale, setLocale] = useState("es-ES");
  const [countryCode, setCountryCode] = useState("ES");

  useEffect(() => {
    const resolved = Intl.DateTimeFormat().resolvedOptions().locale;
    setLocale(resolved);
    const parts = resolved.split("-");
    if (parts.length > 1) setCountryCode(parts[1].toUpperCase());
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleJoinMeeting = (meetLink: string) => {
    window.open(meetLink, "_blank");
  };

  const handleViewNotes = (notes: string) => {
    window.open(notes, "_blank");
  };

  const visibleClasses = classes.slice(0, visibleCount);

  return (
    <div className="max-w-4xl">
      <div>
        {visibleClasses.map((classItem) => (
          <Card
            key={classItem.id}
            className="hover:shadow-sm transition-shadow duration-200 rounded-none"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-3 py-2 gap-2 text-sm">
              {/* Bloque izquierdo: título, nivel, fecha y hora */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                {/* Título + nivel */}
                <div className="flex flex-col min-w-[130px]">
                  <span className="font-semibold text-sm">
                    {classItem.title}
                  </span>
                  <Badge className="text-xs px-2 py-0.5 mt-0.5 w-fit">
                    {classItem.level}
                  </Badge>
                </div>

                {/* Fecha + hora */}
                <div className="flex flex-col gap-1 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(classItem.datetime)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="flex items-center">
                      {formatTime(classItem.datetime)} ({classItem.duration})
                      <Image
                        src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
                        alt={countryCode}
                        width={20}
                        height={14}
                        className="inline-block ml-2"
                      />
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones a la derecha */}
              <div className="flex flex-col sm:flex-row gap-2 sm:shrink-0 pt-2 sm:pt-0">
                <Button
                  onClick={() => handleJoinMeeting(classItem.meetLink)}
                  className="h-8 px-3 text-sm gap-1.5 justify-center"
                  size="sm"
                >
                  <Image
                    src="/google-meet.svg"
                    width={16}
                    height={16}
                    alt="Google Meet icon"
                  />
                  Iniciar
                </Button>

                <Button
                  onClick={() => handleViewNotes(classItem.notes)}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-sm gap-1.5 justify-center"
                  disabled={!classItem.notes}
                >
                  <Image
                    src="/notion.png"
                    width={16}
                    height={16}
                    alt="Notion icon"
                  />
                  Notas
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {classes.length > visibleCount && (
        <div className="flex justify-center mt-6 dark">
          <Button
            onClick={() => setVisibleCount((prev) => prev + 2)}
            variant="outline"
            className="flex items-center gap-2"
          >
            Mostrar más
          </Button>
        </div>
      )}

      {classes.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No hay clases programadas
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Las próximas clases aparecerán aquí cuando estén disponibles.
          </p>
        </div>
      )}
    </div>
  );
};
