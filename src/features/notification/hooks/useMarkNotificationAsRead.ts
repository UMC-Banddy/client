import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/store/notificationApi";

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, notificationId }: { type: string; notificationId: number }) => {
      await markNotificationAsRead(type, notificationId);
    },
    onSuccess: () => {
      // 알림 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}; 