export const bandKeys = {
  root: ["bands"] as const,
  recommended: () => [...bandKeys.root, "recommended"] as const,
  profile: (bandId: string | number) =>
    [...bandKeys.root, "profile", String(bandId)] as const,
};
