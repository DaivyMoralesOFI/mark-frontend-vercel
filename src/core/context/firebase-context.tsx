import { auth, firestore } from "@/core/config/firebase-database";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { createContext, useContext, ReactNode } from "react";

interface FirebaseContextType {
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  return (
    <FirebaseContext.Provider value={{ auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase debe ser usado dentro de un FirebaseProvider");
  }
  return context;
};

export default FirebaseProvider;
