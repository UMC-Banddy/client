import { useQuery } from "@tanstack/react-query";
import { getSimilarArtists } from "@/store/artistApi";
import { authStore } from "@/store/authStore";
import { type SimilarArtist } from "@/types/artist";

export const useSimilarArtists = () => {
  const { data: artists = [], isLoading, error, refetch } = useQuery<SimilarArtist[]>({
    queryKey: ["similarArtists"],
    queryFn: async () => {
      const response = await getSimilarArtists();
      return response;
    },
    enabled: !!authStore.accessToken,
  });

  return {
    artists,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}; 