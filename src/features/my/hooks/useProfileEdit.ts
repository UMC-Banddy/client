import { useMutation, useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/features/setting/hooks/useCurrentUser";
import { getMemberProfile, uploadProfileMedia, updateProfile } from "@/store/profileApi";

// 현재 사용자의 프로필 데이터 조회
export function useProfileData() {
  const { data: currentUser } = useCurrentUser();
  
  return useQuery({
    queryKey: ["profile", "member", currentUser?.memberId],
    queryFn: () => getMemberProfile(currentUser?.memberId || 0),
    enabled: !!currentUser?.memberId,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 프로필 미디어 업로드
export function useUploadProfileMedia() {
  return useMutation({
    mutationFn: uploadProfileMedia,
  });
}

// 프로필 업데이트
export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
  });
}
