import { useEffect } from "react";
import { auth } from "@/lib/firebase/config";
import { onIdTokenChanged } from "firebase/auth";

export function useSyncFirebaseAuthToken() {
  useEffect(() => {
    async function sync() {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true);
        await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Forzar al cargar
    sync();

    // También escuchar cambios
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await fetch("/api/logout", { method: "POST" });
      }
    });

    return unsubscribe;
  }, []);
}
