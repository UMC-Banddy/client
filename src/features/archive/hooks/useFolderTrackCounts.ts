import { useQuery } from "@tanstack/react-query";
import { getFolderTrackCounts } from "@/store/trackApi";

export const useFolderTrackCounts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["folderTrackCounts"],
    queryFn: getFolderTrackCounts,
  });

  return {
    trackCounts: data?.result || {},
    isLoading,
    error: error?.message || null,
  };
};
