"use client";
import GlassmorphismBackground from "@/components/GlassmorphismBackground";
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFirebaseAuthError = (err: AuthError) => {
    switch (err.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Credenciales incorrectas. Por favor, verifica tu email y contraseña.";
      case "auth/invalid-email":
        return "El formato del email no es válido.";
      case "auth/popup-closed-by-user":
        return "El proceso de inicio de sesión fue cancelado.";
      default:
        return "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";
    }
  };

  // LOGIN CON EMAIL Y CONTRASEÑA
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // La redirección se gestionará por el onAuthStateChanged en AuthContext/useSyncFirebaseAuth
      window.location.href = "/my";
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err) {
        setError(handleFirebaseAuthError(err as AuthError));
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  // LOGIN CON GOOGLE
  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      // La redirección se gestionará por el onAuthStateChanged en AuthContext/useSyncFirebaseAuth
      window.location.href = "/my";
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err) {
        setError(handleFirebaseAuthError(err as AuthError));
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassmorphismBackground>
      <div className="min-h-screen relative overflow-hidden">
        {/* Content */}
        <div className="relative z-10 flex justify-center items-center py-10 min-h-screen">
          <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-center text-white">
              Iniciar Sesión
            </h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/90"
                >
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
                  className="mt-1 block w-full px-3 py-2 border border-white/20 rounded-md shadow-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent sm:text-sm text-white bg-white/10 backdrop-blur-sm"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white/90"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-white/20 rounded-md shadow-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent sm:text-sm text-white bg-white/10 backdrop-blur-sm"
                  placeholder="Tu contraseña"
                />
              </div>

              {error && (
                <p className="text-sm text-red-300 text-center bg-red-500/20 p-2 rounded border border-red-400/30">
                  {error}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading
                      ? "bg-indigo-400/50"
                      : "bg-indigo-600/80 hover:bg-indigo-500/80"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-all duration-300 backdrop-blur-sm`}
                >
                  {loading ? "Iniciando..." : "Iniciar Sesión"}
                </button>
              </div>
            </form>

            {/* Separador y botón de Google */}
            <div className="relative my-4">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-white/70">O también puedes</span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-white/30 rounded-md shadow-sm bg-white/10 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50 transition-all duration-300 backdrop-blur-sm"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="#FFC107"
                    d="M15.204 8.206h-.537v-.028h-6v2.667h3.767A3.998 3.998 0 0 1 4.667 9.51a4 4 0 0 1 4-4c1.02 0 1.947.385 2.653 1.013l1.886-1.885a6.64 6.64 0 0 0-4.54-1.794 6.667 6.667 0 1 0 6.538 5.36"
                  />
                  <path
                    fill="#FB5B5B"
                    d="m2.769 6.408 2.19 1.607A4 4 0 0 1 8.667 5.51c1.02 0 1.947.385 2.653 1.013l1.886-1.885a6.64 6.64 0 0 0-4.54-1.794A6.66 6.66 0 0 0 2.77 6.408"
                  />
                  <path
                    fill="#4CAF50"
                    d="M8.667 16.178a6.64 6.64 0 0 0 4.47-1.73l-2.064-1.746a3.97 3.97 0 0 1-2.406.81 4 4 0 0 1-3.761-2.65l-2.174 1.676a6.66 6.66 0 0 0 5.935 3.64"
                  />
                  <path
                    fill="#1976D2"
                    d="M15.204 8.206h-.537v-.028h-6v2.667h3.767a4 4 0 0 1-1.362 1.857h.001l2.063 1.745c-.146.133 2.197-1.602 2.197-4.936a6.7 6.7 0 0 0-.13-1.305"
                  />
                </svg>
                <span>Iniciar sesión con Google</span>
              </button>
            </div>

            <p className="text-sm text-center text-white/70">
              ¿No tienes cuenta?{" "}
              <a
                href="/signup"
                className="font-medium text-indigo-300 hover:text-indigo-200 transition-colors duration-200"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </GlassmorphismBackground>
  );
}
