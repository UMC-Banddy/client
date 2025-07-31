import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = "/login",
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
    } else if (!requireAuth && accessToken) {
      // 인증이 필요없는 페이지(로그인, 회원가입)인데 토큰이 있으면 홈으로
      navigate("/");
    }

    setIsLoading(false);
  }, [snap.isAuthenticated, requireAuth, navigate, redirectTo]);

  // 로딩 중이면 null 반환
  if (isLoading) {
    return null;
  }

  // 조건에 맞지 않으면 null 반환
  if (requireAuth && !localStorage.getItem("accessToken")) {
    return null;
  }

  if (!requireAuth && localStorage.getItem("accessToken")) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
