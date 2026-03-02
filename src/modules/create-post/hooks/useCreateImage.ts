import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCreationsStatus,
  getImageCreated,
  setCreateImage,
  setEditImage,
} from "@/modules/create-post/services/createImageService";
import { CreateImage, EditImage, CreationStore } from "@/modules/create-post/schemas/CreateImage";
import {
  SubscriptionCallback,
  useFirebaseSubscription,
} from "@/core/hooks/useFirebaseQuery";
import { queryKeys } from "@/core/config/query-keys";
import { FirebaseSubscriptionError } from "@/modules/create-post/services/firebaseServices";
import { useState } from "react";

/**
 * Hook for creating images - ONLY handles the mutation, no subscription
 * Use useCreationStatus separately to listen to creation status
 */
export const useCreateImage = () => {
  const mutation = useMutation({
    mutationKey: queryKeys.creation_studio.create_image(),
    mutationFn: (imageSchema: CreateImage) => setCreateImage(imageSchema),
  });

  return {
    ...mutation,
    uuid: mutation.data?.uuid,
  };
};

export const useEditImage = () => {
  const mutation = useMutation({
    mutationKey: queryKeys.creation_studio.edit_image(),
    mutationFn: (editParam: EditImage) => setEditImage(editParam),
  });

  return mutation;
};

export const useGetCreatedImage = (
  uuid: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.creation_studio.get_image(uuid),
    queryFn: () => getImageCreated(uuid),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

export function useCreationStatus(uuid: string) {
  const [subscriptionError, setSubscriptionError] =
    useState<FirebaseSubscriptionError | null>(null);

  const query = useFirebaseSubscription<CreationStore[]>({
    queryKey: queryKeys.creation_studio.creations(uuid),
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
