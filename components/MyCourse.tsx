'use client';

import { Video, Clock } from 'lucide-react';
import { useAuth } from '@/app/(firebase auth)/context/AuthContext';
import GlassCard from '@/components/GlassCard';
import Courses from '@/components/home/Courses';
import { useEffect, useState } from 'react';

export default function MyCourse() {
  const { user } = useAuth();
  const displayName = user?.displayName || '';
  const firstName = displayName.split(' ')[0] || '';

  const [loading, setLoading] = useState(true);
  const [isRegisteredStudent, setIsRegisteredStudent] = useState(true);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [classTitle, setClassTitle] = useState<string | null>(null);
  const [classDate, setClassDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setIsRegisteredStudent(false);
      return;
    }

    setLoading(true);
    fetch('/api/meeting-link')
      .then(res => {
        if (res.status === 404) {
          setIsRegisteredStudent(false);
          return null; // Stop the promise chain
        }
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setIsRegisteredStudent(true);
          setMeetingLink(data.meeting_link || null);
          setClassTitle(data.class_title || null);

          if (data.datetime) {
            const formattedDate = new Intl.DateTimeFormat("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(data.datetime));
            setClassDate(formattedDate);
          } else {
            setClassDate("Fecha no especificada");
          }
        }
      })
      .catch(error => {
        console.error('Error fetching student data:', error);
        setIsRegisteredStudent(false); // Fallback to non-student view on any error
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  // Loading View
  if (loading) {
    return (
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
    );
  }

  // Non-Registered Student View
  if (!isRegisteredStudent) {
    return (
      <div className="flex flex-col justify-center min-h-screen text-white">
        <Courses />
      </div>
    );
  }

  // Registered Student View
  return (
    <div className="min-h-screen">
      <div className="flex">
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3 space-y-6">
              <h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-white/60 to-white bg-clip-text text-transparent animate-fade-in">
                Hi, {firstName}!
              </h1>
              {meetingLink ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GlassCard className="hover:border-indigo-400/50 transition-all duration-300">
                    <a
                      href={meetingLink}
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
                            {classTitle || 'Unirse a la clase'}
                          </p>
                          <p className="text-sm text-white/70 -mt-1">
                            Google Meet
                          </p>
                          <p className="flex items-center text-sm text-indigo-300 font-medium gap-1.5 mt-2">
                            <Clock height={14} />
                            <span>{classDate || 'Clase en vivo'}</span>
                          </p>
                        </div>
                      </div>
                    </a>
                  </GlassCard>
                </div>
              ) : (
                <div className="p-6 bg-white/5 rounded-lg ring-1 ring-white/10">
                  <p className="text-center text-gray-300">
                    No tienes ninguna clase en vivo programada ahora mismo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}