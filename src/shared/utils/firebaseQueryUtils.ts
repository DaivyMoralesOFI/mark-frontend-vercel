import { queryClient } from "./queryClient";
import { queryKeys } from "./queryKeys";
import type { QueryKey } from "@tanstack/react-query";

/**
 * Utilidades de integración entre Firebase y TanStack Query
 *
 * Proporciona helpers para:
 * - Manejo de errores de Firestore
 * - Invalidación de queries
 * - Transformación de datos
 * - Wrapping de funciones de Firebase
 */

/**
 * Códigos de error comunes de Firestore
 */
export const FIRESTORE_ERROR_CODES = {
  PERMISSION_DENIED: "permission-denied",
  NOT_FOUND: "not-found",
  ALREADY_EXISTS: "already-exists",
  RESOURCE_EXHAUSTED: "resource-exhausted",
  FAILED_PRECONDITION: "failed-precondition",
  ABORTED: "aborted",
  OUT_OF_RANGE: "out-of-range",
  UNIMPLEMENTED: "unimplemented",
  INTERNAL: "internal",
  UNAVAILABLE: "unavailable",
  DATA_LOSS: "data-loss",
  UNAUTHENTICATED: "unauthenticated",
  INVALID_ARGUMENT: "invalid-argument",
  DEADLINE_EXCEEDED: "deadline-exceeded",
  CANCELLED: "cancelled",
} as const;

/**
 * Tipo para errores de Firestore
 */
export interface FirestoreError extends Error {
  code: (typeof FIRESTORE_ERROR_CODES)[keyof typeof FIRESTORE_ERROR_CODES];
  message: string;
}

/**
 * Verifica si un error es de Firestore
 */
export function isFirestoreError(error: unknown): error is FirestoreError {
  return (
    error instanceof Error && "code" in error && typeof error.code === "string"
  );
}

/**
 * Maneja errores de Firestore y retorna mensajes user-friendly
 */
export function handleFirestoreError(error: unknown): string {
  if (!isFirestoreError(error)) {
    return error instanceof Error ? error.message : "Unknown error occurred";
  }

  const errorMessages: Record<string, string> = {
    [FIRESTORE_ERROR_CODES.PERMISSION_DENIED]:
      "No tienes permisos para acceder a este recurso",
    [FIRESTORE_ERROR_CODES.NOT_FOUND]:
      "El recurso solicitado no fue encontrado",
    [FIRESTORE_ERROR_CODES.ALREADY_EXISTS]: "El recurso ya existe",
    [FIRESTORE_ERROR_CODES.RESOURCE_EXHAUSTED]:
      "Se excedió el límite de recursos. Intenta más tarde",
    [FIRESTORE_ERROR_CODES.FAILED_PRECONDITION]:
      "No se cumplen las condiciones necesarias",
    [FIRESTORE_ERROR_CODES.ABORTED]:
      "La operación fue cancelada. Intenta nuevamente",
    [FIRESTORE_ERROR_CODES.UNAVAILABLE]:
      "El servicio no está disponible. Verifica tu conexión",
    [FIRESTORE_ERROR_CODES.UNAUTHENTICATED]:
      "Debes iniciar sesión para acceder a este recurso",
    [FIRESTORE_ERROR_CODES.INVALID_ARGUMENT]:
      "Los datos proporcionados son inválidos",
    [FIRESTORE_ERROR_CODES.DEADLINE_EXCEEDED]:
      "La operación tardó demasiado. Intenta nuevamente",
    [FIRESTORE_ERROR_CODES.CANCELLED]: "La operación fue cancelada",
    [FIRESTORE_ERROR_CODES.INTERNAL]: "Error interno del servidor",
    [FIRESTORE_ERROR_CODES.DATA_LOSS]: "Se perdieron datos. Contacta soporte",
  };

  return errorMessages[error.code] || error.message;
}

/**
 * Determina si un error de Firestore debe reintentar
 */
export function shouldRetryFirestoreError(error: unknown): boolean {
  if (!isFirestoreError(error)) {
    return true; // Reintentar errores desconocidos
  }

  const noRetryErrors: string[] = [
    FIRESTORE_ERROR_CODES.PERMISSION_DENIED,
    FIRESTORE_ERROR_CODES.NOT_FOUND,
    FIRESTORE_ERROR_CODES.UNAUTHENTICATED,
    FIRESTORE_ERROR_CODES.INVALID_ARGUMENT,
    FIRESTORE_ERROR_CODES.ALREADY_EXISTS,
  ];

  return !noRetryErrors.includes(error.code);
}

/**
 * Invalida todas las queries de monitors (útil después de login/logout)
 */
export async function invalidateAllCreationStudioQueries() {
  await queryClient.invalidateQueries({
    queryKey: queryKeys.creationStudio.all,
  });
}

/**
 * Limpia el cache completamente (útil en logout)
 */
export function clearAllQueries() {
  queryClient.clear();
}

/**
 * Wrapper genérico para convertir callbacks de Firebase a Promises
 */
export function firebaseCallbackToPromise<T>(
  firebaseFn: (
    onSuccess: (data: T | null) => void,
    onError: (error: Error) => void,
  ) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    firebaseFn(
      (data) => {
        if (data !== null) {
          resolve(data);
        } else {
          reject(new Error("No data received from Firebase"));
        }
      },
      (error) => {
        reject(error);
      },
    );
  });
}

/**
 * Wrapper para queries de Firebase que retornan promesas directamente
 */
export async function executeFirebaseQuery<T>(
  queryFn: () => Promise<T | null>,
  options?: {
    throwOnNull?: boolean;
    defaultValue?: T;
  },
): Promise<T> {
  const { throwOnNull = true, defaultValue } = options || {};

  try {
    const result = await queryFn();

    if (result === null) {
      if (throwOnNull && !defaultValue) {
        throw new Error("Query returned null");
      }
      return defaultValue as T;
    }

    return result;
  } catch (error) {
    const errorMessage = handleFirestoreError(error);
    throw new Error(errorMessage);
  }
}

/**
 * Helper para obtener datos del cache sin triggear un fetch
 */
export function getCachedQueryData<T>(queryKey: QueryKey): T | undefined {
  return queryClient.getQueryData<T>(queryKey);
}

/**
 * Helper para actualizar datos en el cache manualmente (optimistic updates)
 */
export function setCachedQueryData<T>(queryKey: QueryKey, data: T): void {
  queryClient.setQueryData<T>(queryKey, data);
}

/**
 * Helper para actualizar parcialmente datos en el cache
 */
export function updateCachedQueryData<T>(
  queryKey: QueryKey,
  updater: (oldData: T | undefined) => T,
): void {
  queryClient.setQueryData<T>(queryKey, updater);
}

/**
 * Resetea una query específica (útil para forzar refetch)
 */
export async function resetQuery(queryKey: QueryKey): Promise<void> {
  await queryClient.resetQueries({ queryKey });
}

/**
 * Cancela queries en progreso (útil para cleanup en navegación)
 */
export async function cancelQueries(queryKey: QueryKey): Promise<void> {
  await queryClient.cancelQueries({ queryKey });
}

/**
 * Verifica si una query está siendo fetched actualmente
 */
export function isQueryFetching(queryKey: QueryKey): boolean {
  return queryClient.isFetching({ queryKey }) > 0;
}

/**
 * Helper para debugging: obtener info de todas las queries
 */
export function getQueryCacheInfo() {
  const cache = queryClient.getQueryCache();
  return {
    totalQueries: cache.getAll().length,
    queries: cache.getAll().map((query) => ({
      queryKey: query.queryKey,
      state: query.state.status,
      dataUpdatedAt: query.state.dataUpdatedAt,
      errorUpdatedAt: query.state.errorUpdatedAt,
      fetchStatus: query.state.fetchStatus,
    })),
  };
}

/**
 * Logger de errores para desarrollo
 */
export function logQueryError(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    console.error(
      `[Firebase Query Error]${context ? ` (${context})` : ""}:`,
      error,
    );

    if (isFirestoreError(error)) {
      console.error("Firestore Error Code:", error.code);
      console.error("User-friendly message:", handleFirestoreError(error));
    }
  }
}
