"use client"; // Necesario para usar hooks como useContext y usePathname

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation'; // <--- Importa usePathname
import { useAuth } from "@/app/(firebase auth)/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname(); // <--- Obtiene la ruta actual

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Opcional: Redirigir al usuario después del logout, por ejemplo a la home
      // router.push('/'); // Necesitarías importar y usar useRouter de 'next/navigation'
      console.log("User logged out");
    } catch (error) {
      console.error("Error signing out: ", error); // <--- Línea seleccionada por el usuario
      // Manejar el error, quizás mostrar un mensaje al usuario
    }
  };

  // Determina si mostrar el botón de Acceder
  const showLoginButton = !user && pathname !== '/login' && pathname !== '/signup';

  return (
    <nav className="flex justify-between items-center px-8 md:px-8 lg:px-8 py-6">
      <Link href="/"> {/* Cambiado <a> por <Link> para navegación Next.js */}
        <span className="flex gap-1 cursor-pointer"> {/* Añadido cursor-pointer */}
          <Image src={"/favicon.png"} height={30} width={30} alt="Logo" className="aspect-square" /> {/* Asegúrate que la ruta del favicon sea correcta desde public */}
          <p className="text-m text-white font-bold flex items-center">
            English with John
          </p>
        </span>
      </Link>

      <div className="flex items-center justify-end gap-4">
        {loading ? (
          <div className="h-10 w-20"></div> // Placeholder simple
        ) : user ? (
          // Si el usuario está logueado, muestra "Mi curso" y el botón de Salir
          <> {/* Usamos Fragment para agrupar los elementos */}
            <Link href="/my"> {/* Enlace a Mi Curso */}
              <span className="flex items-center gap-2 text-white font-medium cursor-pointer hover:text-gray-300 transition-colors">
              <Image src="/home/usa-flag.png" width={15} height={15} alt="US Flag"></Image>Mi curso
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition-colors"
            >
              Salir
            </button>
          </>
        ) : showLoginButton ? ( // <--- Usa la variable para la condición
          // Si el usuario no está logueado Y NO está en /login o /signup, muestra Acceder
          <Link href="/login">
            <button className="bg-white text-[#763EE3] px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors">
              Acceder
            </button>
          </Link>
        ) : (
          // Opcional: Muestra un espacio vacío o nada si no se muestra ningún botón
          <div className="h-10 w-20"></div> // Placeholder para mantener el layout
        )}
      </div>
    </nav>
  );
}
