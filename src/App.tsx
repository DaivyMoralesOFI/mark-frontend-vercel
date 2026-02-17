import { ThemeProvider } from "@/core/router/router";
import FirebaseProvider from "./core/context/firebase-context";
import AppRoutes from "./core/routes/routes";
import { QueryProvider } from "./core/providers/query-providers";
import { AuthProvider } from "@/domains/auth/store/authProvider";
import { Toaster } from "@/shared/components/ui/sonner";

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <FirebaseProvider>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
          </AuthProvider>
        </FirebaseProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
