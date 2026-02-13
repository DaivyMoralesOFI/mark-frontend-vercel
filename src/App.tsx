import { ThemeProvider } from "./shared/router";
import FirebaseProvider from "./core/context/firebase-context";
import AppRoutes from "./core/routes/routes";
import { QueryProvider } from "./core/providers/query-providers";

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <FirebaseProvider>
          <AppRoutes />
        </FirebaseProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
