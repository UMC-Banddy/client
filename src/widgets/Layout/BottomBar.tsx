import React from "react";
import { Link, useLocation } from "react-router-dom";
import homeIcon from "@/assets/icons/bottom-home.svg";
import searchIcon from "@/assets/icons/bottom-search.svg";
import joinIcon from "@/assets/icons/bottom-join.svg";
import profileIcon from "@/assets/icons/bottom-profile.svg";
import "@/App.css";

const navs = [
  { label: "홈", icon: homeIcon, path: "/" },
  { label: "탐색", icon: searchIcon, path: "/explore" },
  { label: "밴드생성", icon: joinIcon, path: "/band/create" },
  { label: "마이", icon: profileIcon, path: "/my" },
];

const BottomBar = () => {
  const location = useLocation();
  return (
    <div className="mb-[12vh]">
      <nav
        className="
          fixed bottom-[0vh] left-1/2 -translate-x-1/2 w-full z-50
          flex justify-around items-center h-[12.2vh]
          custom-bottom-gradient rounded-t-2xl
        "
        aria-label="하단 내비게이션 바"
      >
        {navs.map((nav) => {
          let active = false;
          if (nav.path === "/") {
            active = location.pathname === "/";
          } else if (nav.path === "/my") {
            active = location.pathname.startsWith("/my") || location.pathname.startsWith("/profile-other/");
          } else {
            active = location.pathname.startsWith(nav.path);
          }
          return (
            <Link
              key={nav.path}
              to={nav.path}
              className="flex flex-col items-center justify-center flex-1 py-2"
              aria-label={nav.label}
            >
              <img
                src={nav.icon}
                alt={nav.label + " 아이콘"}
                className={`
                  w-[12.2vw] h-[12.2vw] max-w-12 max-h-12 min-w-8 min-h-8
                  transition-opacity
                  ${active ? "opacity-100" : "opacity-50"}
                `}
              />
              <span
                className={`
                  w-[1.53vw] h-[1.53vw] rounded-full bg-white mt-1 transition-all
                  ${active ? "opacity-100" : "opacity-0"}
                `}
              />
            </Link>
          );
        })}
      </nav>
      </div>
  );
};

export default BottomBar;