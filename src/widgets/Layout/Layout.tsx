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
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div className="relative min-h-screen min-h-[100dvh] flex flex-col bg-[#121212] overflow-hidden w-full">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center  w-full max-w-md mx-auto gap-y-8">
        <Outlet />
      </main>
      {!hideBottomBar && <BottomBar />}
    </div>
  );
}
