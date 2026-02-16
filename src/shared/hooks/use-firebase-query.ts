import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { firebaseQueryOptions } from "@/core/lib/query-client";

/**
 * Tipos para callbacks de Firebase onSnapshot
 */
type SubscriptionCallback<T> = (data: T | null) => void;
type ErrorCallback = (error: Error) => void;
type UnsubscribeFunction = () => void;

/**
 * Tipo para funciones de suscripción de Firebase
 */
type FirebaseSubscriptionFn<T> = (
  onNext: SubscriptionCallback<T>,
  onError: ErrorCallback,
) => UnsubscribeFunction;

export function useFirebaseQuery<TData = unknown, TError = Error>(
  options: UseQueryOptions<TData, TError> & {
    type?: "realtime" | "historical" | "profile" | "dynamic";
  },
) {
  const { type = "dynamic", ...queryOptions } = options;

  // Merge con configuración específica de Firebase
  const mergedOptions: UseQueryOptions<TData, TError> = {
    ...firebaseQueryOptions[type],
    ...queryOptions,
  };

  return useQuery<TData, TError>(mergedOptions);
}

export function useFirebaseSubscription<
  TData = unknown,
  TError = Error,
>(options: {
  queryKey: UseQueryOptions<TData, TError>["queryKey"];
  subscribe:
    | FirebaseSubscriptionFn<TData>
    | ((onNext: SubscriptionCallback<TData>) => Promise<UnsubscribeFunction>);
  enabled?: boolean;
  onError?: (error: TError) => void;
  onSuccess?: (data: TData) => void;
}) {
  const { queryKey, subscribe, enabled = true, onError, onSuccess } = options;
  const unsubscribeRef = useRef<UnsubscribeFunction | null>(null);
  const queryClient = useQueryClient();
  const isFirstDataRef = useRef(true);

  // Usar useQuery con configuración de realtime
  const query = useQuery<TData, TError>({
    queryKey,
    queryFn: () =>
      new Promise<TData>(async (resolve, reject) => {
        // Cleanup de suscripción anterior si existe
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }

        isFirstDataRef.current = true;

        try {
          // Crear nueva suscripción (puede ser sync o async)
          const unsubscribe = await subscribe(
            (data) => {
              if (data !== null) {
                // Si es la primera vez, resolver la Promise para inicializar el query
                if (isFirstDataRef.current) {
                  isFirstDataRef.current = false;
                  resolve(data);
                } else {
                  // Para actualizaciones subsecuentes, actualizar directamente el cache
                  queryClient.setQueryData(queryKey, data);
                }

                // Llamar callback de éxito en todas las actualizaciones
                onSuccess?.(data);
              }
            },
            (error) => {
              reject(error);
              onError?.(error as TError);
            },
          );

          // Guardar función de cleanup
          unsubscribeRef.current = unsubscribe;
        } catch (error) {
          reject(error);
          onError?.(error as TError);
        }
      }),
    ...firebaseQueryOptions.realtime,
    enabled,
    // Importante: no refetch automáticamente, la suscripción maneja updates
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // Cleanup al desmontar o cuando se deshabilita
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [enabled]);

  return query;
}

export function useFirebaseMultiSubscription<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TError = Error,
>(options: {
  subscriptions: Array<{
    key: string;
    subscribe: FirebaseSubscriptionFn<unknown>;
  }>;
  enabled?: boolean;
  onError?: (error: TError) => void;
}) {
  const { subscriptions, enabled = true, onError } = options;
  const unsubscribersRef = useRef<Map<string, UnsubscribeFunction>>(new Map());
  const queryClient = useQueryClient();
  const isInitializedRef = useRef(false);

  const queryKey = ["multi-subscription", ...subscriptions.map((s) => s.key)];

  const query = useQuery<TData, TError>({
    queryKey,
    queryFn: () =>
      new Promise<TData>((resolve, reject) => {
        const combinedData: Record<string, unknown> = {};
        let resolvedCount = 0;
        const totalSubscriptions = subscriptions.length;

        // Cleanup suscripciones anteriores
        unsubscribersRef.current.forEach((unsub) => unsub());
        unsubscribersRef.current.clear();
        isInitializedRef.current = false;

        // Crear todas las suscripciones
        subscriptions.forEach(({ key, subscribe }) => {
          const unsubscribe = subscribe(
            (data) => {
              if (data !== null) {
                combinedData[key] = data;

                // Si ya se inicializó, actualizar el cache directamente
                if (isInitializedRef.current) {
                  queryClient.setQueryData(
                    queryKey,
                    (oldData: TData | undefined) => {
                      return { ...oldData, [key]: data } as TData;
                    },
                  );
                } else {
                  // Contar cuántas suscripciones han emitido
                  resolvedCount++;

                  // Resolver cuando todas las suscripciones han emitido al menos una vez
                  if (resolvedCount === totalSubscriptions) {
                    isInitializedRef.current = true;
                    resolve(combinedData as TData);
                  }
                }
              }
            },
            (error) => {
              reject(error);
              onError?.(error as TError);
            },
          );

          unsubscribersRef.current.set(key, unsubscribe);
        });
      }),
    ...firebaseQueryOptions.realtime,
    enabled,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      unsubscribersRef.current.forEach((unsub) => unsub());
      unsubscribersRef.current.clear();
    };
  }, [enabled]);

  return query;
}

/**
 * Hook para mutations de Firebase (setDoc, updateDoc, deleteDoc, addDoc)
 *
 * Proporciona invalidación automática de queries relacionadas
 *
 * Nota: Para simplificar, este hook NO sobrescribe callbacks existentes.
 * Si necesitas invalidación automática, usa los helpers de firebase-query-utils
 * directamente en tus callbacks de onSuccess/onSettled.
 *
 * @example
 * ```tsx
 * const updateMonitor = useMutation({
 *   mutationFn: (data) => updateMonitorProfile(monitorId, data),
 *   onSuccess: () => {
 *     invalidateMonitorQueries(monitorId);
 *   }
 * })
 * ```
 */
export function useFirebaseMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
  return useMutation<TData, TError, TVariables, TContext>(options);
}

/**
 * Tipos de export para uso externo
 */
export type {
  SubscriptionCallback,
  ErrorCallback,
  UnsubscribeFunction,
  FirebaseSubscriptionFn,
};
