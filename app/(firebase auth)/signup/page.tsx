"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  AuthError,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { db } from "@/lib/firebase/firebase-client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { createParagraphBlock } from "@/app/global-components/yooptaBlocks";
import Link from "next/link";
import Header from "@/app/global-components/Header";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createUserPage = async (uid: string) => {
    const pageRef = doc(db, "pages", uid);
    const snap = await getDoc(pageRef);

    if (!snap.exists()) {
      const initialBlocks = createParagraphBlock(
        "👋 ¡Bienvenido a tu espacio de notas!"
      );

      const initialPage = {
        title: "Untitled Page",
        icon: "📄",
        coverImage: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        initialBlocks,
      };

      await setDoc(pageRef, initialPage);
    }
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      await createUserPage(uid);
      router.push("/my");
    } catch (err: unknown) {
        console.error("Signup Error:", err);
        if (err && typeof err === 'object' && 'code' in err) {
          const authError = err as AuthError;
          if (authError.code === "auth/email-already-in-use") {
            setError("Este email ya está registrado.");
          } else if (authError.code === "auth/invalid-email") {
            setError("Email no válido.");
          } else if (authError.code === "auth/weak-password") {
            setError("Contraseña muy débil.");
          } else {
            setError("Error al registrar. Intenta de nuevo.");
          }
        } else {
          setError("Ocurrió un error inesperado.");
        }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      await createUserPage(uid);
      router.push("/my");
    } catch (err: unknown) {
      console.error("Google Signup Error:", err);
      if (err && typeof err === 'object' && 'code' in err) {
        const authError = err as AuthError;
        if (authError.code === "auth/popup-closed-by-user") {
          setError("Se cerró la ventana de Google.");
        } else if (authError.code === "auth/account-exists-with-different-credential") {
          setError("Ya existe una cuenta con ese email.");
        } else {
          setError("Error al usar Google. Intenta de nuevo.");
        }
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center py-10">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Crear Cuenta
          </h2>
          <form className="space-y-4" onSubmit={handleSignup}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border px-3 py-2 rounded text-black"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full border px-3 py-2 rounded text-black"
            />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              className="w-full border px-3 py-2 rounded text-black"
            />

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full py-2 bg-white text-gray-800 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center"
          >
            <span className="mr-2">🔵</span> Registrarse con Google
          </button>

          <p className="text-sm text-center text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
