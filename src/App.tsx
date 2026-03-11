import { ThemeProvider } from "@/core/router/router";
import AppRoutes from "./core/routes/routes";
import { QueryProvider } from "./core/providers/QueryProviders";
import { AuthProvider } from "@/domains/auth/store/AuthProvider";
import { Toaster } from "@/shared/components/ui/Sonner";

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="dark" storageKey="app-theme">
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
