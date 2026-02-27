import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCreationsStatus,
  getGenerationsStatus,
  getImageCreated,
  setCreateImage,
  setEditImage,
} from "@/modules/create-post/services/createImageService";
import { CreateImage, EditImage } from "@/modules/create-post/schemas/CreateImage";
import {
  SubscriptionCallback,
  useFirebaseSubscription,
} from "@/core/hooks/useFirebaseQuery";
import { queryKeys } from "@/core/config/query-keys";
import { CreationStore, GenerationStore } from "@/modules/create-post/schemas/CreateImage";
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

/**
 * Hook for editing images — calls POST /edit-image
 */
export const useEditImage = () => {
  const mutation = useMutation({
    mutationKey: ["edit_image"],
    mutationFn: (editPayload: EditImage) => setEditImage(editPayload),
  });

  return {
    ...mutation,
    imgUrl: mutation.data?.img_url,
  };
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

/**
 * Hook to listen to the creation document status in Firebase.
 * n8n writes status: "pending" → "active" to creations/{uuid}
 */
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

  const currentStatus = query.data?.[0]?.status?.toLowerCase();

  return {
    ...query,
    mapData: query.data ?? null,
    hasData: !!query.data && query.data.length > 0,
    isProcessing:
      currentStatus !== "done" && currentStatus !== "active",
    isDone: currentStatus === "done" || currentStatus === "active",
    status: query.data?.[0] ?? null,
    // Error states
    subscriptionError,
    hasSubscriptionError: !!subscriptionError,
    isNotFound: subscriptionError?.type === "NOT_FOUND",
    isValidationError: subscriptionError?.type === "VALIDATION_ERROR",
  };
}

/**
 * Hook to listen to the generations subcollection in Firebase.
 * n8n writes img_url to creations/{uuid}/generations/{gen_uuid}
 */
export function useGenerationStatus(creationUuid: string) {
  const query = useFirebaseSubscription<GenerationStore[]>({
    queryKey: [...queryKeys.creation_studio.creations(creationUuid), "generations"],
    subscribe: (onNext: SubscriptionCallback<GenerationStore[]>) => {
      return getGenerationsStatus(creationUuid, (data, error) => {
        if (error) {
          console.error("❌ Generation subscription error:", error);
        }
        if (data) {
          onNext(data);
        }
      });
    },
    enabled: !!creationUuid,
  });

  // Find the latest generation with an img_url (not null, not undefined)
  const latestGeneration = query.data?.find((g) => !!g.img_url) ?? null;

  return {
    ...query,
    generations: query.data ?? [],
    latestGeneration,
    imgUrl: latestGeneration?.img_url ?? null,
    hasImage: !!latestGeneration?.img_url,
  };
}
