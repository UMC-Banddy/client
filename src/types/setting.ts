// 설정 아이템 타입
export interface SettingItem {
  icon: string;
  title: string;
  onClick?: () => void;
}

// 회원탈퇴 API 응답 타입
export interface WithdrawalResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}

// 회원탈퇴 요청 타입
export interface WithdrawalRequest {
  memberId: number;
  refreshToken: string;
}
