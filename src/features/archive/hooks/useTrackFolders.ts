import { useQuery } from "@tanstack/react-query";
import { getTrackFolders } from "@/store/trackApi";
import type { TrackFoldersResponse } from "@/types/track";

export const useTrackFolders = () => {
  const { data, isLoading, error } = useQuery<TrackFoldersResponse>({
    queryKey: ["trackFolders"],
    queryFn: getTrackFolders,
  });

  return {
    folders: data?.result || [],
    isLoading,
    error: error?.message || null,
  };
};
