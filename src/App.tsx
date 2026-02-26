import { ThemeProvider } from "@/core/router/router";
import FirebaseProvider from "./core/context/FirebaseContext";
import AppRoutes from "./core/routes/routes";
import { QueryProvider } from "./core/providers/QueryProviders";
import { AuthProvider } from "@/modules/auth/store/AuthProvider";
import { Toaster } from "@/shared/components/ui/Sonner";

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
