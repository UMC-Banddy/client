import { Outlet, useLocation } from "react-router-dom";
import BottomBar from "@/widgets/Layout/BottomBar";
import Header from "./Header";

export default function Layout() {
  const location = useLocation();
  const hideBottomBar = [
    "/login",
    "/signup",
    "/signup/verify",
    "/signup/password",
    "/signup/nickname",
    "/signup/profile",
    "/signup/complete",
    "/home/chat",
    "/profile-detail",
  ].some((path) => location.pathname.startsWith(path));
  const hideHeader =
    ["/my/notifications/", "/profile-detail"].some((path) =>
      location.pathname.startsWith(path)
    ) || location.pathname === "/my";

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden w-full bg-[radial-gradient(ellipse_at_center,_#2a2a2a_20%,_#1c1c1c_80%)]">
      {!hideHeader && <Header />}
      <main
        className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto gap-y-8"
        style={{
          paddingBottom: "calc(64px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/*  페이지마다 다를 것 같지만 추후 협의 필요한 지점 */}
        <Outlet />
      </main>
      {!hideBottomBar && <BottomBar />}
    </div>
  );
}
