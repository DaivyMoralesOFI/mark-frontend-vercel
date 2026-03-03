export const queryKeys = {
  /**
   * Monitor queries
   * Jerarquía: monitors > [all|list|detail|profile|realtime]
   */
  creation_studio: {
    all: ["studio"] as const,
    create_image: () =>
      [...queryKeys.creation_studio.all, "create-image"] as const,
    get_image: (uuid: string) =>
      [...queryKeys.creation_studio.all, "get-image", uuid] as const,
    edit_image: () =>
      [...queryKeys.creation_studio.all, "edit-image"] as const,
    creations: (uuid: string) =>
      [...queryKeys.creation_studio.all, "creations", uuid] as const,
  },
  brands: {
    all: ["brands"] as const,
    list: () => [...queryKeys.brands.all, "list"] as const,
    getBrand: (uuid: string) =>
      [...queryKeys.brands.all, "get-brand", uuid] as const,
    setBrand: () => [...queryKeys.brands.all, "set-brand"] as const,
  },
};
