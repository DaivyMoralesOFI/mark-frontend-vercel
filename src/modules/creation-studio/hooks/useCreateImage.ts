import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getImageCreated,
  setCreateImage,
  setEditCopy,
  setEditImage,
  setRegenerateCopy,
  getAllCreations,
} from "@/modules/creation-studio/services/createImageService";
import {
  CreateImage,
  EditCopy,
  EditImage,
  GenerationStore,
  RegenerateCopy,
} from "@/modules/creation-studio/schemas/CreateImage";
import { queryKeys } from "@/core/config/query-keys";

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
    mutationKey: queryKeys.creation_studio.edit_image(),
    mutationFn: (editPayload: EditImage) => setEditImage(editPayload),
  });

  return {
    ...mutation,
    imgUrl: mutation.data?.img_url,
  };
};

export const useEditCopy = () => {
  return useMutation({
    mutationKey: queryKeys.creation_studio.edit_copy(),
    mutationFn: (params: EditCopy) => setEditCopy(params),
  });
};

export const useRegenerateCopy = () => {
  const mutation = useMutation({
    mutationKey: queryKeys.creation_studio.regenerate_copy(),
    mutationFn: (params: RegenerateCopy) => setRegenerateCopy(params),
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
    staleTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Keep polling while pending/processing; stop once done or errored
      if (!status || status === "pending" || status === "processing") return 3000;
      return false;
    },
    ...options,
  });
};

const mapGenerationToStore = (
  generation?: Awaited<ReturnType<typeof getImageCreated>>,
): GenerationStore[] => {
  if (!generation) return [];

  const toStore = (item: {
    uuid: string;
    parent_uuid?: string | null;
    creation_uuid?: string;
    content?: string;
    copy?: string;
    type?: string;
    prompt?: string;
    status: string;
    created_at?: string;
  }): GenerationStore => {
    const isCopyGen = item.type === "copy" || item.type === "carousel";
    const isUrl = (str?: string | null) => str?.startsWith("http");

    return {
      uuid: item.uuid,
      parent_uuid: item.parent_uuid ?? null,
      creation_uuid: item.creation_uuid ?? null,
      img_url: isUrl(item.content) ? item.content : null,
      copy: isCopyGen 
        ? (item.copy || item.content || null) 
        : (!isUrl(item.content) ? (item.content ?? item.copy ?? null) : (item.copy ?? null)),
      gen_type: item.type ?? null,
      prompt: item.prompt ?? null,
      status: item.status ?? null,
      create_at: item.created_at,
    };
  };

  if (generation.slices && generation.slices.length > 0) {
    const mainStore = toStore(generation);
    return [
      mainStore,
      ...generation.slices.map((s) => {
        const stored = toStore(s);
        // If the slice has no parent_uuid, link it to the main generation
        if (!stored.parent_uuid) {
          stored.parent_uuid = mainStore.uuid;
        }
        return stored;
      }),
    ];
  }

  return [toStore(generation)];
};

export const useCreations = () => {
  return useQuery({
    queryKey: queryKeys.creation_studio.creations_list(),
    queryFn: getAllCreations,
    staleTime: 1000 * 30,
    retry: false,
  });
};

export const useCreationStatus = (uuid: string) => {
  const query = useGetCreatedImage(uuid, { enabled: !!uuid });
  const status = query.data?.status;

  return {
    isProcessing:
      query.isFetching || status === "pending" || status === "processing",
    isDone: status === "done",
    hasSubscriptionError: !!query.error,
    subscriptionError: query.error,
  };
};

export const useGenerationStatus = (uuid: string) => {
  const query = useGetCreatedImage(uuid, { enabled: !!uuid });
  const generations = mapGenerationToStore(query.data);

  return {
    generations,
    hasImage: generations.some((generation) => !!generation.img_url || generation.gen_type === "carousel"),
    isLoading: query.isLoading,
    error: query.error,
    type: query.data?.type,
  };
};
