import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  // 공개 페이지(requireAuth=false)에서도 로그인된 사용자를 허용할지 여부
  // true면 로그인 사용자를 홈으로 리다이렉트하지 않음
  allowAuthedOnPublic?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = "/login",
  allowAuthedOnPublic = false,
}) => {
  const snap = useSnapshot(authStore);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 토큰이 localStorage에 있는지 확인
    const accessToken = localStorage.getItem("accessToken");

    if (requireAuth && !accessToken) {
      // 인증이 필요한 페이지인데 토큰이 없으면 로그인 페이지로
      navigate(redirectTo);
    } else if (!requireAuth && accessToken && !allowAuthedOnPublic) {
      // 인증이 필요없는 페이지인데(로그인, 회원가입 등)
      // allowAuthedOnPublic=false면 로그인 사용자를 홈으로 리다이렉트
      navigate("/");
    }

    setIsLoading(false);
  }, [snap.isAuthenticated, requireAuth, navigate, redirectTo, allowAuthedOnPublic]);

  // 로딩 중이면 null 반환
  if (isLoading) {
    return null;
  }

  // 조건에 맞지 않으면 null 반환
  if (requireAuth && !localStorage.getItem("accessToken")) {
    return null;
  }

  if (!requireAuth && localStorage.getItem("accessToken") && !allowAuthedOnPublic) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
