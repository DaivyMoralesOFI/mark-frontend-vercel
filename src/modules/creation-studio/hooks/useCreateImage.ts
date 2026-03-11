import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getImageCreated,
  setCreateImage,
  setEditImage,
  setRegenerateCopy,
} from "@/modules/creation-studio/services/createImageService";
import { CreateImage, EditImage, RegenerateCopy } from "@/modules/creation-studio/schemas/CreateImage";
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
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};
