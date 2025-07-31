import { useQuery } from "@tanstack/react-query";
import { getArchivedTracks } from "@/store/trackApi";
import { authStore } from "@/store/authStore";
import { type ArchivedTrack } from "@/types/track";

export const useArchivedTracks = () => {
  const { data: tracks = [], isLoading, error, refetch } = useQuery<ArchivedTrack[]>({
    queryKey: ["archivedTracks"],
    queryFn: async () => {
      const response = await getArchivedTracks();
      return response.result;
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