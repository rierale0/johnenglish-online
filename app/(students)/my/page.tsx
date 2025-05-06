// app/(students)/my/page.tsx
"use client";
import React, { useEffect } from "react"; // Añadido useEffect
import { useRouter } from 'next/navigation'; // Para redirección
import Header from "@/app/global-components/Header";
import { useAuth } from "@/app/(firebase auth)/context/AuthContext";

export default function StudentDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirige si no está logueado y ya no está cargando
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center h-screen bg-[#222222]">
          <p className="text-white text-xl">Cargando dashboard...</p>
          {/* Aquí podrías poner un spinner más elaborado */}
        </div>
      </div>
    );
  }

  if (!user) {
    // Aunque useEffect redirige, es bueno tener un fallback para no renderizar el dashboard
    return null; 
  }

  const userName = user.displayName || user.email; // Usar displayName o email

  return (
    <div className="min-h-screen bg-[#222222] text-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">
          Bienvenido a tu Dashboard, {userName}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta: Mis Cursos */}
          <div className="bg-[#333333] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* <FaBook className="text-4xl text-blue-400 mb-4" /> */}
            <h2 className="text-2xl font-semibold mb-3">Mis Cursos</h2>
            <p className="text-gray-300 mb-4">
              Accede a los cursos en los que estás inscrito y continúa tu aprendizaje.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
              Ver mis cursos
            </button>
          </div>

          {/* Tarjeta: Mi Progreso */}
          <div className="bg-[#333333] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* <FaChartLine className="text-4xl text-green-400 mb-4" /> */}
            <h2 className="text-2xl font-semibold mb-3">Mi Progreso</h2>
            <p className="text-gray-300 mb-4">
              Realiza un seguimiento de tu avance y mira cuán lejos has llegado.
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors">
              Ver mi progreso
            </button>
          </div>

          {/* Tarjeta: Próximas Clases/Eventos */}
          <div className="bg-[#333333] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* <FaCalendarAlt className="text-4xl text-yellow-400 mb-4" /> */}
            <h2 className="text-2xl font-semibold mb-3">Próximas Clases</h2>
            <p className="text-gray-300 mb-4">
              Consulta el horario de tus próximas clases en vivo o eventos.
            </p>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition-colors">
              Ver calendario
            </button>
          </div>
          
          {/* Tarjeta: Recursos Adicionales */}
          <div className="bg-[#333333] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* <FaLightbulb className="text-4xl text-purple-400 mb-4" /> */}
            <h2 className="text-2xl font-semibold mb-3">Recursos</h2>
            <p className="text-gray-300 mb-4">
              Material de estudio, ejercicios y herramientas para mejorar tu inglés.
            </p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition-colors">
              Explorar recursos
            </button>
          </div>

          {/* Tarjeta: Configuración de Cuenta */}
          <div className="bg-[#333333] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* <FaCog className="text-4xl text-gray-400 mb-4" /> */}
            <h2 className="text-2xl font-semibold mb-3">Configuración</h2>
            <p className="text-gray-300 mb-4">
              Administra los detalles de tu perfil y preferencias de la cuenta.
            </p>
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors">
              Ir a configuración
            </button>
          </div>

          {/* Puedes añadir más tarjetas aquí */}
          <div className="bg-[#333333] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-semibold mb-3">Noticias y Anuncios</h2>
            <p className="text-gray-300">
              Mantente al día con las últimas novedades de English with John.
            </p>
            {/* Aquí podrías listar algunos anuncios */}
          </div>
        </div>
      </main>
    </div>
  );
}
