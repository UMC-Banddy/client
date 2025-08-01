import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";
import type { SavedTrackResponse } from "@/types/track";

export const useSavedTracks = (memberId: number | null) => {
  const { data: tracks = [], isLoading, error } = useQuery<SavedTrackResponse[]>({
    queryKey: ["savedTracks", memberId],
    queryFn: async () => {
      const response = await API.get(API_ENDPOINTS.PROFILE.OTHER_TRACKS(memberId!.toString()));
      return response.data;
    },
    enabled: !!authStore.accessToken && !!memberId,
  });

  return {
    tracks,
    isLoading,
    error: error?.message || null,
  };
}; 