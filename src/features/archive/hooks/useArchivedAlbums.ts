import { useQuery } from "@tanstack/react-query";
import { getArchivedAlbums } from "@/store/albumApi";
import { authStore } from "@/store/authStore";
import { type ArchivedAlbum } from "@/types/album";

export const useArchivedAlbums = () => {
  const { data: albums = [], isLoading, error } = useQuery<ArchivedAlbum[]>({
    queryKey: ["archivedAlbums"],
    queryFn: async () => {
      try {
        const response = await getArchivedAlbums();
        console.log("Archived Albums API Response:", response);
        
        // 안전한 배열 처리
        if (response?.result && Array.isArray(response.result)) {
          return response.result;
        }
        
        console.warn("Archived Albums API returned non-array result:", response);
        return [];
      } catch (error) {
        console.error("Archived Albums API Error:", error);
        throw error;
      }
    },
    enabled: !!authStore.accessToken,
  });

  return { 
    albums, 
    isLoading, 
    error: error?.message || null 
  };
}; 