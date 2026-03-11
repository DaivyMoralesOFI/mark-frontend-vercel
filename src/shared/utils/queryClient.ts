import { QueryClient, DefaultOptions } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

/**
 * Configuración optimizada para TanStack Query
 *
 * Estrategias de caché:
 * - Historical data: 5-10 minutos
 * - Profile data: 10-15 minutos
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Datos considerados frescos por 5 minutos (default para historical data)
    staleTime: 1000 * 60 * 5,

    // Mantener datos en cache por 10 minutos
    gcTime: 1000 * 60 * 10,

    // Reintentar failed queries
    retry: (failureCount, error) => {
      // No reintentar errores de cliente (400-499)
      if (error instanceof Error && "status" in error) {
        const status = (error as any).status;
        if (status >= 400 && status < 500) return false;
      }

      // Reintentar hasta 3 veces para errores de red/timeout
      return failureCount < 3;
    },

    // Delay entre reintentos con backoff exponencial (1s, 2s, 4s, max 30s)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch cuando la ventana recupera focus
    refetchOnWindowFocus: true,

    // Refetch cuando se reconecta a internet
    refetchOnReconnect: true,

    // No refetch automático en mount si hay datos en cache
    refetchOnMount: false,

    // Network mode: online-only
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
