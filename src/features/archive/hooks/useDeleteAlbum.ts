import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAlbum } from "@/store/saveApi";

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const deleteAlbumMutation = useMutation({
    mutationFn: ({ albumId }: { albumId: number }) => {
      return deleteAlbum(albumId);
    },
    onSuccess: () => {
      setToast({ message: "삭제되었습니다.", visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
      
      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["archivedAlbums"] });
    },
    onError: (error) => {
      console.error("앨범 삭제 실패:", error);
      setToast({ message: "삭제에 실패했습니다.", visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
    },
  });

  return {
    deleteAlbum: deleteAlbumMutation.mutate,
    isDeleting: deleteAlbumMutation.isPending,
    error: deleteAlbumMutation.error,
    toast,
  };
};
