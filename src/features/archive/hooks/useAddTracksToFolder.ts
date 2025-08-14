import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTracksToFolder } from "@/store/trackApi";

export const useAddTracksToFolder = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const addTracksMutation = useMutation({
    mutationFn: ({ folderId, trackIds }: { folderId: number; trackIds: number[]; folderName?: string }) => 
      addTracksToFolder(folderId, trackIds),
    onSuccess: (data, variables) => {
      const folderName = variables.folderName || "폴더";
      setToast({ message: `'${folderName}'에 추가되었습니다.`, visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
      
      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["tracksInFolder", variables.folderId] });
      queryClient.invalidateQueries({ queryKey: ["archivedTracks"] });
      queryClient.invalidateQueries({ queryKey: ["folderTrackCounts"] }); 
    },
    onError: (error) => {
      console.error("폴더에 곡 추가 실패:", error);
      setToast({ message: "폴더에 추가에 실패했습니다.", visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
    },
  });

  return {
    addTracksToFolder: addTracksMutation.mutate,
    isAdding: addTracksMutation.isPending,
    error: addTracksMutation.error,
    toast,
  };
};
