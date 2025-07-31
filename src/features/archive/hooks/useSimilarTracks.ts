import { useQuery } from "@tanstack/react-query";
import { getSimilarTracks } from "@/store/trackApi";
import { authStore } from "@/store/authStore";
import { type SimilarTrack } from "@/types/track";

export const useSimilarTracks = () => {
  const { data: tracks = [], isLoading, error, refetch } = useQuery<SimilarTrack[]>({
    queryKey: ["similarTracks"],
    queryFn: async () => {
      const response = await getSimilarTracks();
      return response;
    },
    enabled: !!authStore.accessToken,
  });

  return {
    tracks,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}; 