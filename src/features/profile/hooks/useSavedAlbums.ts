import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";
import type { SavedAlbumResponse } from "@/types/album";

export const useSavedAlbums = (memberId: number | null) => {
  const { data: albums = [], isLoading, error } = useQuery<SavedAlbumResponse[]>({
    queryKey: ["savedAlbums", memberId],
    queryFn: async () => {
      const response = await API.get(API_ENDPOINTS.PROFILE.OTHER_ALBUMS(memberId!.toString()));
      return response.data;
    },
    enabled: !!authStore.accessToken && !!memberId,
  });

  return {
    albums,
    isLoading,
    error: error?.message || null,
  };
}; 