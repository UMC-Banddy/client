import { useQuery } from "@tanstack/react-query";
import { getArchivedArtists } from "@/store/artistApi";
import { authStore } from "@/store/authStore";
import { type ArchiveArtist } from "@/types/artist";

export const useArchivedArtists = () => {
  const { data: artists = [], isLoading, error } = useQuery<ArchiveArtist[]>({
    queryKey: ["archivedArtists"],
    queryFn: async () => {
      try {
        const response = await getArchivedArtists();
        console.log("Archived Artists API Response:", response);
        
        // 안전한 배열 처리
        if (response?.result && Array.isArray(response.result)) {
          return response.result;
        }
        
        console.warn("Archived Artists API returned non-array result:", response);
        return [];
      } catch (error) {
        console.error("Archived Artists API Error:", error);
        throw error;
      }
    },
    enabled: !!authStore.accessToken,
  });

  return { 
    artists, 
    isLoading, 
    error: error?.message || null 
  };
}; 