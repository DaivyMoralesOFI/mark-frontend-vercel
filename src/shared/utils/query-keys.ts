export const queryKeys = {
  /**
   * Monitor queries
   * Jerarquía: monitors > [all|list|detail|profile|realtime]
   */
  creationStudio: {
    all: ["creation-studio"] as const,
    createImage: () =>
      [...queryKeys.creationStudio.all, "create-image"] as const,
    creations: (uuid: string) =>
      [...queryKeys.creationStudio.all, "creations", uuid] as const,
    getImageCreated: (uuid: string) =>
      [...queryKeys.creationStudio.all, "get-image-created", uuid] as const,
  } as const,
};
