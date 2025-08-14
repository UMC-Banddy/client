import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteArtist, deleteArtistFromFolder } from "@/store/artistApi";

export const useDeleteArtist = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const deleteArtistMutation = useMutation({
    mutationFn: ({ artistId, folderId }: { artistId: number; folderId?: number }) => {
      if (folderId) {
        return deleteArtistFromFolder(folderId, artistId);
      } else {
        return deleteArtist(artistId);
      }
    },
    onSuccess: (data, variables) => {
      setToast({ message: "삭제되었습니다.", visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
      
      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["archivedArtists"] });
      if (variables.folderId) {
        queryClient.invalidateQueries({ queryKey: ["artistsInFolder", variables.folderId] });
      }
    },
    onError: (error) => {
      console.error("아티스트 삭제 실패:", error);
      setToast({ message: "삭제에 실패했습니다.", visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
    },
  });

  return {
    deleteArtist: deleteArtistMutation.mutate,
    isDeleting: deleteArtistMutation.isPending,
    error: deleteArtistMutation.error,
    toast,
  };
};
