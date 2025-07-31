import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { 
  saveTrack, 
  saveArtist, 
  saveAlbum, 
  deleteTrack, 
  deleteArtist, 
  deleteAlbum 
} from "@/store/saveApi";
import { authStore } from "@/store/authStore";
import { getArchivedTracks } from "@/store/trackApi";
import { getArchivedArtists } from "@/store/artistApi";
import { getArchivedAlbums } from "@/store/albumApi";

export const useSaveItem = () => {
  const queryClient = useQueryClient();

  // 아카이브된 아이템들을 가져오는 쿼리들
  const { data: archivedTracks = [] } = useQuery({
    queryKey: ["archivedTracks"],
    queryFn: async () => {
      const response = await getArchivedTracks();
      return response.result;
    },
    enabled: !!authStore.accessToken,
  });

  const { data: archivedArtists = [] } = useQuery({
    queryKey: ["archivedArtists"],
    queryFn: async () => {
      const response = await getArchivedArtists();
      return response.result;
    },
    enabled: !!authStore.accessToken,
  });

  const { data: archivedAlbums = [] } = useQuery({
    queryKey: ["archivedAlbums"],
    queryFn: async () => {
      const response = await getArchivedAlbums();
      return response.result;
    },
    enabled: !!authStore.accessToken,
  });

  const saveMutation = useMutation({
    mutationFn: async ({ spotifyId, type }: { spotifyId: string; type: "track" | "artist" | "album" }) => {
      switch (type) {
        case "track":
          return await saveTrack(spotifyId);
        case "artist":
          return await saveArtist(spotifyId);
        case "album":
          return await saveAlbum(spotifyId);
      }
    },
    onSuccess: () => {
      // 관련 쿼리들 무효화하여 자동 갱신
      queryClient.invalidateQueries({ queryKey: ["archivedTracks"] });
      queryClient.invalidateQueries({ queryKey: ["archivedArtists"] });
      queryClient.invalidateQueries({ queryKey: ["archivedAlbums"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: "track" | "artist" | "album"; id: number }) => {
      switch (type) {
        case "track":
          return await deleteTrack(id);
        case "artist":
          return await deleteArtist(id);
        case "album":
          return await deleteAlbum(id);
      }
    },
    onSuccess: () => {
      // 관련 쿼리들 무효화하여 자동 갱신
      queryClient.invalidateQueries({ queryKey: ["archivedTracks"] });
      queryClient.invalidateQueries({ queryKey: ["archivedArtists"] });
      queryClient.invalidateQueries({ queryKey: ["archivedAlbums"] });
    },
  });

  const saveItem = async (spotifyId: string, type: "track" | "artist" | "album") => {
    if (!authStore.accessToken) {
      throw new Error("인증이 필요합니다.");
    }
    return saveMutation.mutateAsync({ spotifyId, type });
  };

  const deleteItem = async (spotifyId: string, type: "track" | "artist" | "album") => {
    if (!authStore.accessToken) {
      throw new Error("인증이 필요합니다.");
    }

    // spotifyId로 해당 아이템의 id 찾기
    let itemId: number | undefined;

    switch (type) {
      case "track":
        itemId = archivedTracks.find(item => item.spotifyId === spotifyId)?.trackId;
        break;
      case "artist":
        itemId = archivedArtists.find(item => item.spotifyId === spotifyId)?.artistId;
        break;
      case "album":
        itemId = archivedAlbums.find(item => item.spotifyId === spotifyId)?.albumId;
        break;
    }

    if (!itemId) {
      throw new Error("삭제할 아이템을 찾을 수 없습니다.");
    }

    return deleteMutation.mutateAsync({ type, id: itemId });
  };

  // spotifyId로 저장된 아이템인지 확인하는 함수
  const isSaved = (spotifyId: string, type: "track" | "artist" | "album"): boolean => {
    switch (type) {
      case "track":
        return archivedTracks.some(item => item.spotifyId === spotifyId);
      case "artist":
        return archivedArtists.some(item => item.spotifyId === spotifyId);
      case "album":
        return archivedAlbums.some(item => item.spotifyId === spotifyId);
      default:
        return false;
    }
  };

  return {
    saveItem,
    deleteItem,
    isSaved,
    isLoading: saveMutation.isPending || deleteMutation.isPending,
    error: saveMutation.error?.message || deleteMutation.error?.message || null,
  };
}; 