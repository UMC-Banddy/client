import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArtistFolder } from "@/store/artistApi";

export const useCreateArtistFolder = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const createFolderMutation = useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) =>
      createArtistFolder(name, color),
    onSuccess: (data, variables) => {
      setToast({ message: `'${variables.name}'가 추가되었습니다.`, visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
      queryClient.invalidateQueries({ queryKey: ["artistFolders"] });
    },
    onError: (error) => {
      console.error("폴더 생성 실패:", error);
      setToast({ message: "폴더 생성에 실패했습니다.", visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
    },
  });

  return {
    createFolder: createFolderMutation.mutate,
    isCreating: createFolderMutation.isPending,
    error: createFolderMutation.error,
    toast,
  };
};
