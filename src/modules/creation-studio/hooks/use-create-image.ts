import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCreationsStatus,
  getImageCreated,
  setCreateImage,
} from "@/modules/creation-studio/service/create-image-service";
import { CreateImage } from "@/modules/creation-studio/schemas/create-image";
import {
  SubscriptionCallback,
  useFirebaseSubscription,
} from "@/core/hooks/use-firebase-query";
import { queryKeys } from "@/core/lib/query-keys";
import { CreationStore } from "@/modules/creation-studio/schemas/create-image";
import { FirebaseSubscriptionError } from "@/modules/creation-studio/service/firebase-services";
import { useState } from "react";

/**
 * Hook for creating images - ONLY handles the mutation, no subscription
 * Use useCreationStatus separately to listen to creation status
 */
export const useCreateImage = () => {
  const mutation = useMutation({
    mutationKey: queryKeys.creationStudio.createImage(),
    mutationFn: (imageSchema: CreateImage) => setCreateImage(imageSchema),
  });

  return {
    ...mutation,
    uuid: mutation.data?.uuid,
  };
};

export const useGetCreatedImage = (
  uuid: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.creationStudio.getImageCreated(uuid),
    queryFn: () => getImageCreated(uuid),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

export function useCreationStatus(uuid: string) {
  const [subscriptionError, setSubscriptionError] =
    useState<FirebaseSubscriptionError | null>(null);

  const query = useFirebaseSubscription<CreationStore[]>({
    queryKey: queryKeys.creationStudio.creations(uuid),
    subscribe: (onNext: SubscriptionCallback<CreationStore[]>) => {
      return getCreationsStatus(uuid, (data, error) => {
        if (error) {
          setSubscriptionError(error);
          console.error("❌ Subscription error:", error);
        } else {
          setSubscriptionError(null);
        }

        if (data) {
          onNext(data);
        }
      });
    },
    enabled: !!uuid,
  });

  return {
    ...query,
    mapData: query.data ?? null,
    hasData: !!query.data && query.data.length > 0,
    isProcessing:
      query.data?.[0]?.status?.toLowerCase() !== "done" || !query.data,
    isDone: query.data?.[0]?.status?.toLowerCase() === "done",
    status: query.data?.[0] ?? null,
    // New error states
    subscriptionError,
    hasSubscriptionError: !!subscriptionError,
    isNotFound: subscriptionError?.type === "NOT_FOUND",
    isValidationError: subscriptionError?.type === "VALIDATION_ERROR",
  };
}
