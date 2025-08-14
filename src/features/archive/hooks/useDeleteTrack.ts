import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrack, deleteTrackFromFolder } from "@/store/trackApi";

export const useDeleteTrack = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const deleteTrackMutation = useMutation({
    mutationFn: ({ trackId, folderId }: { trackId: number; folderId?: number }) => {
      if (folderId) {
        return deleteTrackFromFolder(folderId, trackId);
      } else {
        return deleteTrack(trackId);
      }
    },
    onSuccess: (data, variables) => {
      setToast({ message: "삭제되었습니다.", visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
      
      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["archivedTracks"] });
      if (variables.folderId) {
        queryClient.invalidateQueries({ queryKey: ["tracksInFolder", variables.folderId] });
      }
    },
    onError: (error) => {
      console.error("곡 삭제 실패:", error);
      setToast({ message: "삭제에 실패했습니다.", visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
    },
  });

  return {
    deleteTrack: deleteTrackMutation.mutate,
    isDeleting: deleteTrackMutation.isPending,
    error: deleteTrackMutation.error,
    toast,
  };
};
