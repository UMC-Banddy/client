import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import homeIcon from "@/assets/icons/bottom-home.svg";
import searchIcon from "@/assets/icons/bottom-search.svg";
import joinIcon from "@/assets/icons/bottom-join.svg";
import profileIcon from "@/assets/icons/bottom-profile.svg";

const navs = [
  { label: "홈", icon: homeIcon, path: "/" },
  { label: "탐색", icon: searchIcon, path: "/explore" },
  { label: "밴드생성", icon: joinIcon, path: "/band/create" },
  { label: "마이", icon: profileIcon, path: "/my" },
];

const BottomBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav
      className="fixed bottom-[0px] left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white shadow-[0_-2px_16px_0_rgba(0,0,0,0.12)] rounded-t-2xl flex gap-2 md:gap-4 justify-between items-center px-4 py-2 md:px-8 md:py-4"
      aria-label="하단 내비게이션 바"
    >
      {navs.map((nav) => {
        const active = location.pathname === nav.path;
        return (
          <button
            key={nav.path}
            onClick={() => navigate(nav.path)}
            className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition text-xs md:text-sm font-['IBM Plex Sans'] outline-none focus:ring-2 focus:ring-[#FF3B30] whitespace-nowrap ${
              active ? "text-[#FF3B30]" : "text-[#8E8E93]"
            }`}
            aria-label={nav.label}
            tabIndex={0}
          >
            <img
              src={nav.icon}
              alt={nav.label + " 아이콘"}
              width={24}
              height={24}
              style={{
                filter: active
                  ? "brightness(10) drop-shadow(0 0 4px #fff)"
                  : "opacity(0.5)",
                marginBottom: 2,
                transition: "filter 0.2s, opacity 0.2s",
              }}
            />
            <span>{nav.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomBar;
