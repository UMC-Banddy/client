import { useQuery } from "@tanstack/react-query";
import { getArtistFolders } from "@/store/artistApi";
import { type ArtistFoldersResponse } from "@/types/artist";

export const useArtistFolders = () => {
  const { data, isLoading, error } = useQuery<ArtistFoldersResponse>({
    queryKey: ["artistFolders"],
    queryFn: getArtistFolders,
  });

  return {
    folders: data?.result || [],
    isLoading,
    error: error?.message || null,
  };
};
