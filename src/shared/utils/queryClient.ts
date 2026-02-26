import { QueryClient, DefaultOptions } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

/**
 * Configuración optimizada para TanStack Query con Firebase
 * Adaptada para aplicaciones de monitoreo en tiempo real con Firestore
 *
 * Estrategias de caché:
 * - Real-time data (onSnapshot): staleTime infinito
 * - Historical data: 5-10 minutos
 * - Profile data: 10-15 minutos
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Datos considerados frescos por 5 minutos (default para historical data)
    staleTime: 1000 * 60 * 5,

    // Mantener datos en cache por 10 minutos
    gcTime: 1000 * 60 * 10,

    // Reintentar failed queries con lógica específica para Firebase
    retry: (failureCount, error) => {
      // No reintentar errores de cliente (400-499)
      if (error instanceof Error && "status" in error) {
        const status = (error as any).status;
        if (status >= 400 && status < 500) return false;
      }

      // Firebase Firestore errors específicos que no deben reintentar
      if (error instanceof Error) {
        const firestoreNoRetryErrors = [
          "permission-denied",
          "unauthenticated",
          "invalid-argument",
          "not-found",
        ];

        if (
          firestoreNoRetryErrors.some((code) => error.message?.includes(code))
        ) {
          return false;
        }
      }

      // Reintentar hasta 3 veces para errores de red/timeout
      return failureCount < 3;
    },

    // Delay entre reintentos con backoff exponencial (1s, 2s, 4s, max 30s)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch cuando la ventana recupera focus (útil para datos en tiempo real)
    refetchOnWindowFocus: true,

    // Refetch cuando se reconecta a internet (crítico para Firebase)
    refetchOnReconnect: true,

    // No refetch automático en mount si hay datos en cache
    refetchOnMount: false,

    // Network mode: online-only (Firebase requiere conexión)
    networkMode: "online",

    // Refetch interval para mantener datos frescos (deshabilitado por default)
    // Se puede habilitar por query individual para polling
    refetchInterval: false,

    // Mantener queries anteriores mientras se cargan nuevos datos
    placeholderData: (previousData: unknown) => previousData,
  },

  mutations: {
    // Reintentar mutaciones fallidas una vez
    retry: 1,

    // Network mode para mutations
    networkMode: "online",

    // Tiempo de espera antes de considerar una mutación como fallida
    gcTime: 1000 * 60 * 5, // 5 minutos
  },
};

/**
 * Cliente de TanStack Query configurado para la aplicación
 * Singleton compartido por toda la app
 */
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

/**
 * Re-export de query keys desde el archivo dedicado
 * Para retrocompatibilidad y facilidad de uso
 */
export { queryKeys };

/**
 * Re-export de utilidades de Firebase
 */
export {
  invalidateAllCreationStudioQueries,
  clearAllQueries,
  handleFirestoreError,
  isFirestoreError,
  logQueryError,
} from "./firebaseQueryUtils";

/**
 * Configuraciones específicas para diferentes tipos de datos de Firebase
 * Usar estas opciones al crear queries individuales
 */
export const firebaseQueryOptions = {
  /**
   * Para datos en tiempo real (onSnapshot subscriptions)
   * - staleTime: Infinity (los datos siempre están frescos por la suscripción)
   * - gcTime: 30 minutos (mantener en cache mientras la pestaña está abierta)
   * - refetchOnWindowFocus: false (no refetch, la suscripción ya lo maneja)
   */
  realtime: {
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false, // onSnapshot maneja reconexiones automáticamente
    refetchOnMount: false,
  },

  /**
   * Para datos históricos (reports, sensor averages)
   * - staleTime: 10 minutos (datos históricos no cambian frecuentemente)
   * - gcTime: 30 minutos
   */
  historical: {
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  /**
   * Para perfiles de monitores
   * - staleTime: 15 minutos (configuración de dispositivos es estática)
   * - gcTime: 1 hora
   */
  profile: {
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  /**
   * Para datos que cambian frecuentemente pero no son real-time
   * - staleTime: 30 segundos
   * - gcTime: 5 minutos
   */
  dynamic: {
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },
} as const;
