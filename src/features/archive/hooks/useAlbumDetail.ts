import { useQuery } from "@tanstack/react-query";
import { getAlbumDetail } from "@/store/albumApi";

export const useAlbumDetail = (albumId: string | null) => {
  return useQuery({
    queryKey: ["albumDetail", albumId],
    queryFn: () => getAlbumDetail(albumId!),
    enabled: !!albumId,
  });
};
