import { useQuery } from "@tanstack/react-query";
import { getArchivedAlbums } from "@/store/albumApi";
import { authStore } from "@/store/authStore";
import { type ArchivedAlbum } from "@/types/album";

export const useArchivedAlbums = () => {
  const { data: albums = [], isLoading, error } = useQuery<ArchivedAlbum[]>({
    queryKey: ["archivedAlbums"],
    queryFn: async () => {
      const response = await getArchivedAlbums();
      return response.result;
    },
    enabled: !!authStore.accessToken,
  });

  return { 
    albums, 
    isLoading, 
    error: error?.message || null 
  };
}; 