import { useQuery } from "@tanstack/react-query";
import { getTracksInFolder } from "@/store/trackApi";
import type { TracksInFolderResponse } from "@/types/track";

export const useTracksInFolder = (folderId: number | null) => {
  const { data, isLoading, error } = useQuery<TracksInFolderResponse>({
    queryKey: ["tracksInFolder", folderId],
    queryFn: () => getTracksInFolder(folderId!),
    enabled: !!folderId, // folderId가 있을 때만 실행
  });

  return {
    tracks: data?.result || [],
    isLoading,
    error: error?.message || null,
  };
};
