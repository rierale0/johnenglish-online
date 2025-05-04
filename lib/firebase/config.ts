import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Si planeas usar Firestore u otros servicios, impórtalos aquí
// import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase para la aplicación web
// Asegúrate de reemplazar esto con tus propias credenciales
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };
  

// Inicializar Firebase
// Comprobamos si ya existe una instancia para evitar inicializarla múltiples veces (importante en Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// Si usas otros servicios, inicialízalos aquí
// const db = getFirestore(app);

export { app, auth }; // Exporta 'db' si lo necesitas