import { useQuery } from "@tanstack/react-query";
import { getArchivedArtists } from "@/store/artistApi";
import { authStore } from "@/store/authStore";
import { type ArchiveArtist } from "@/types/artist";

export const useArchivedArtists = () => {
  const { data: artists = [], isLoading, error } = useQuery<ArchiveArtist[]>({
    queryKey: ["archivedArtists"],
    queryFn: async () => {
      const response = await getArchivedArtists();
      return response.result;
    },
    enabled: !!authStore.accessToken,
  });

  return { 
    artists, 
    isLoading, 
    error: error?.message || null 
  };
}; 