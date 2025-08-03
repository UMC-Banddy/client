import { useQuery } from "@tanstack/react-query";
import { getArchivedTracks } from "@/store/trackApi";
import { authStore } from "@/store/authStore";
import { type ArchivedTrack } from "@/types/track";

export const useArchivedTracks = () => {
  const { data: tracks = [], isLoading, error, refetch } = useQuery<ArchivedTrack[]>({
    queryKey: ["archivedTracks"],
    queryFn: async () => {
      try {
        const response = await getArchivedTracks();
        console.log("Archived Tracks API Response:", response);
        
        // 안전한 배열 처리
        if (response?.result && Array.isArray(response.result)) {
          return response.result;
        }
        
        console.warn("Archived Tracks API returned non-array result:", response);
        return [];
      } catch (error) {
        console.error("Archived Tracks API Error:", error);
        throw error;
      }
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