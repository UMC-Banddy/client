import { Outlet } from "react-router-dom";
import BottomBar from "@/widgets/Layout/BottomBar";

export default function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <header className="p-4 bg-black text-white text-xl font-bold">
        Banddy
      </header>
      <main className="flex-1 flex flex-col items-center justify-center pb-16">
        <Outlet />
      </main>
      <footer className="p-2 bg-black text-white text-center text-xs">
        © 2024 Banddy
      </footer>
      <BottomBar />
    </div>
  );
}
