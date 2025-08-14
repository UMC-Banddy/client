import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrackFolder } from "@/store/trackApi";

export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const createFolderMutation = useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) => 
      createTrackFolder(name, color),
    onSuccess: (data, variables) => {
      // 성공 시 토스트 메시지 표시
      setToast({ message: `'${variables.name}'가 추가되었습니다.`, visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
      
      // 폴더 목록 캐시 무효화하여 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["trackFolders"] });
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
