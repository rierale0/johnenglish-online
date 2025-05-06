"use client"; // Necesario para usar hooks como useContext y usePathname
import React, { useState }from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'; // <--- Importa usePathname
import { useAuth } from "@/app/(firebase auth)/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname(); // <--- Obtiene la ruta actual
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Opcional: Redirigir al usuario después del logout, por ejemplo a la home
      // router.push('/'); // Necesitarías importar y usar useRouter de 'next/navigation'
      console.log("User logged out");
      router.push('/'); // Redirige a la página principal tras el login exitoso
    } catch (error) {
      console.error("Error signing out: ", error); // <--- Línea seleccionada por el usuario
      // Manejar el error, quizás mostrar un mensaje al usuario
    }
  };

  // Determina si mostrar el botón de Acceder
  const showLoginButton = !user && pathname !== '/login' && pathname !== '/signup';

  return (
    <nav className="flex justify-between items-center px-4 md:px-8 lg:px-8 py-6">
      <Link href="/"> {/* Cambiado <a> por <Link> para navegación Next.js */}
        <span className="flex items-center gap-1 cursor-pointer"> {/* Añadido cursor-pointer */}
          <Image 
            src={"/favicon.png"} 
            height={30} 
            width={30} 
            alt="Logo" 
            className="w-[30px] h-[30px] object-contain"
          /> {/* Asegúrate que la ruta del favicon sea correcta desde public */}
          <p className="text-m text-white font-bold">
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
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2"
              >
                <Image
                  src={user?.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <svg 
                  className={`w-4 h-4 text-gray-300 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link href="/profile">
                      <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Mi Perfil
                      </span>
                    </Link>
                    <Link href="/settings">
                      <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Configuración
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Salir
                    </button>
                  </div>
                </div>
              )}
            </div>
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
