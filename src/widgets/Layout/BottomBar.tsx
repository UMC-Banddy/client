import { Home, Search, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "홈", to: "/" },
  { icon: Search, label: "검색", to: "/search" },
  { icon: MessageCircle, label: "메시지", to: "/messages" },
  { icon: User, label: "프로필", to: "/profile" },
];

export default function BottomBar() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center h-16 bg-gradient-to-t from-black/90 to-black/60 backdrop-blur-md border-t border-neutral-800 md:hidden">
      {navItems.map(({ icon: Icon, label, to }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={label}
            to={to}
            className="flex flex-col items-center flex-1"
          >
            <Icon
              size={28}
              className={active ? "text-white" : "text-gray-300"}
            />
            <span
              className={`block w-1 h-1 mt-1 rounded-full ${
                active ? "bg-white opacity-100" : "bg-gray-400 opacity-60"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
