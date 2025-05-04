"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// Importa signInWithPopup y GoogleAuthProvider
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase/config'; // Importa tu instancia de auth
import Link from 'next/link'; // Para el enlace a la página de inicio de sesión
import Header from '@/app/global-components/Header';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Validación simple de contraseña
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // El listener onAuthStateChanged en AuthContext se encargará del estado global
      // Redirige al usuario a la página principal después del registro exitoso
      router.push('/');
    } catch (err: any) {
      console.error("Firebase Auth Error:", err);
      // Manejo de errores comunes de Firebase Auth para el registro
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email ya está registrado. Intenta iniciar sesión.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El formato del email no es válido.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es demasiado débil.');
      } else {
        setError('Ocurrió un error al intentar registrar la cuenta. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Nueva función para manejar el registro con Google
  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      // El listener onAuthStateChanged en AuthContext se encargará del estado global
      // Redirige al usuario a la página principal después del registro exitoso
      router.push('/');
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      // Manejo de errores comunes de Google Sign-In
      if (err.code === 'auth/popup-closed-by-user') {
        setError('El proceso de inicio de sesión con Google fue cancelado.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('Ya existe una cuenta con este email usando otro método de inicio de sesión.');
      } else {
        setError('Ocurrió un error al intentar iniciar sesión con Google. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div><Header />
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Crear Cuenta</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Repite la contraseña"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>

        {/* Separador */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O continúa con</span>
          </div>
        </div>

        {/* Botón de Google Sign-Up */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className={`w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
              loading
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
          >
            <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
              <path fill="#FFC107" d="M15.204 8.206h-.537v-.028h-6v2.667h3.767A3.998 3.998 0 0 1 4.667 9.51a4 4 0 0 1 4-4c1.02 0 1.947.385 2.653 1.013l1.886-1.885a6.64 6.64 0 0 0-4.54-1.794 6.667 6.667 0 1 0 6.538 5.36"/>
              <path fill="#FB5B5B" d="m2.769 6.408 2.19 1.607A4 4 0 0 1 8.667 5.51c1.02 0 1.947.385 2.653 1.013l1.886-1.885a6.64 6.64 0 0 0-4.54-1.794A6.66 6.66 0 0 0 2.77 6.408"/>
              <path fill="#4CAF50" d="M8.667 16.178a6.64 6.64 0 0 0 4.47-1.73l-2.064-1.746a3.97 3.97 0 0 1-2.406.81 4 4 0 0 1-3.761-2.65l-2.174 1.676a6.66 6.66 0 0 0 5.935 3.64"/>
              <path fill="#1976D2" d="M15.204 8.206h-.537v-.028h-6v2.667h3.767a4 4 0 0 1-1.362 1.857h.001l2.063 1.745c-.146.133 2.197-1.602 2.197-4.936a6.7 6.7 0 0 0-.13-1.305"/>
            </svg>            Registrarse con Google
          </button>
        </div>

        <p className="text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
}