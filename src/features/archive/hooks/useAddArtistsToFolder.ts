import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addArtistsToFolder } from "@/store/artistApi";

export const useAddArtistsToFolder = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const addArtistsMutation = useMutation({
    mutationFn: ({ folderId, artistIds }: { folderId: number; artistIds: number[]; folderName?: string }) => 
      addArtistsToFolder(folderId, artistIds),
    onSuccess: (data, variables) => {
      const folderName = variables.folderName || "폴더";
      setToast({ message: `'${folderName}'에 추가되었습니다.`, visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
      
      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["artistsInFolder", variables.folderId] });
      queryClient.invalidateQueries({ queryKey: ["archivedArtists"] });
      queryClient.invalidateQueries({ queryKey: ["artistFolderCounts"] }); 
    },
    onError: (error) => {
      console.error("폴더에 아티스트 추가 실패:", error);
      setToast({ message: "폴더에 추가에 실패했습니다.", visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
    },
  });

  return {
    addArtistsToFolder: addArtistsMutation.mutate,
    isAdding: addArtistsMutation.isPending,
    error: addArtistsMutation.error,
    toast,
  };
};
