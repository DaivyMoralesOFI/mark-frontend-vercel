import { ThemeProvider } from "@/core/router/router";
import FirebaseProvider from "./core/context/firebase-context";
import AppRoutes from "./core/routes/routes";
import { QueryProvider } from "./core/providers/query-providers";
import { AuthProvider } from "@/domains/auth/store/authProvider";

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <FirebaseProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </FirebaseProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
