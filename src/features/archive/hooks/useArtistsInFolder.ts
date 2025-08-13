import { useQuery } from "@tanstack/react-query";
import { getArtistsInFolder } from "@/store/artistApi";
import { type ArtistsInFolderResponse } from "@/types/artist";

export const useArtistsInFolder = (folderId: number | null) => {
  const { data, isLoading, error } = useQuery<ArtistsInFolderResponse>({
    queryKey: ["artistsInFolder", folderId],
    queryFn: () => getArtistsInFolder(folderId!),
    enabled: !!folderId, // folderId가 있을 때만 실행
  });

  return {
    artists: data?.result || [],
    isLoading,
    error: error?.message || null,
  };
};
