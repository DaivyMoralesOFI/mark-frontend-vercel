import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
};

// Validación de variables de entorno
const requiredEnvVars = [
  "VITE_APP_FIREBASE_API_KEY",
  "VITE_APP_FIREBASE_AUTH_DOMAIN",
  "VITE_APP_FIREBASE_PROJECT_ID",
  "VITE_APP_FIREBASE_STORAGE_BUCKET",
  "VITE_APP_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_APP_FIREBASE_APP_ID",
];

requiredEnvVars.forEach((varName) => {
  if (!import.meta.env[varName]) {
    throw new Error(`La variable de entorno ${varName} es requerida`);
  }
});

const app = initializeApp(firebaseConfig);

export const firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export default app;
