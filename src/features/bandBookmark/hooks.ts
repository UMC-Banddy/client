import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addBandBookmark, getBandBookmarks, removeBandBookmark } from "./api";
import type { BandBookmarkItem } from "./types";

export const bandBookmarkKeys = {
  root: ["bandBookmarks"] as const,
  list: () => ["bandBookmarks"] as const,
};

export function useBandBookmarks() {
  return useQuery({
    queryKey: bandBookmarkKeys.list(),
    queryFn: getBandBookmarks,
    staleTime: 60 * 1000,
  });
}

export function useAddBandBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bandId: number) => addBandBookmark(bandId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: bandBookmarkKeys.list() }),
  });
}

export function useRemoveBandBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bandId: number) => removeBandBookmark(bandId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: bandBookmarkKeys.list() }),
  });
}

export function useToggleBandBookmark() {
  const add = useAddBandBookmark();
  const remove = useRemoveBandBookmark();

  const toggle = async (bandId: number, nextBookmarked: boolean) => {
    if (nextBookmarked) {
      await add.mutateAsync(bandId);
    } else {
      await remove.mutateAsync(bandId);
    }
  };

  return toggle;
}

export function useIsBookmarked(bandId: number) {
  const { data } = useBandBookmarks();
  const list = Array.isArray(data) ? (data as BandBookmarkItem[]) : [];
  return list.some((b) => b.bandId === bandId);
}
