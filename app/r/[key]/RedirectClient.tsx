"use client";

import { useEffect } from "react";
import Link from "next/link";
import { getRedirectUrl } from "@/lib/redirects";

type Props = { redirectKey: string };

export default function RedirectClient({ redirectKey }: Props) {
  useEffect(() => {
    const url = getRedirectUrl(redirectKey);
    if (url) {
      window.location.href = url;
    }
  }, [redirectKey]);

  const url = getRedirectUrl(redirectKey);
  const notFound = !url;

  if (notFound) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-600">Redirección no encontrada.</p>
        <Link href="/" className="text-[#763EE3] underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4">
      <p className="text-gray-600 animate-pulse">Redirigiendo…</p>
      <p className="text-sm text-gray-500">
        Si no te redirige,{" "}
        <Link href="/" className="text-[#763EE3] underline">
          vuelve al inicio
        </Link>
        .
      </p>
    </div>
  );
}
