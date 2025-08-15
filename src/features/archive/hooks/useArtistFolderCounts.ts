import { useQuery } from "@tanstack/react-query";
import { getArtistFolderCounts } from "@/store/artistApi";

export const useArtistFolderCounts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["artistFolderCounts"],
    queryFn: getArtistFolderCounts,
  });

  return {
    artistCounts: data?.result || {},
    isLoading,
    error: error?.message || null,
  };
};
