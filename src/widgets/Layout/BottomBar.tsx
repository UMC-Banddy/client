import { Link, useLocation } from "react-router-dom";
import homeIcon from "@/assets/icons/bottombar/home.svg";
import noHomeIcon from "@/assets/icons/bottombar/no_home.svg";
import searchIcon from "@/assets/icons/bottombar/search.svg";
import noSearchIcon from "@/assets/icons/bottombar/no_search.svg";
import chatIcon from "@/assets/icons/bottombar/chat.svg";
import noChatIcon from "@/assets/icons/bottombar/no_chat.svg";
import myIcon from "@/assets/icons/bottombar/my.svg";
import noMyIcon from "@/assets/icons/bottombar/no_my.svg";
import "@/App.css";

const navs = [
  {
    label: "홈",
    activeIcon: homeIcon,
    inactiveIcon: noHomeIcon,
    path: "/",
  },
  {
    label: "탐색",
    activeIcon: searchIcon,
    inactiveIcon: noSearchIcon,
    path: "/explore",
  },
  {
    label: "밴드생성",
    activeIcon: chatIcon,
    inactiveIcon: noChatIcon,
    path: "/band/create",
  },
  {
    label: "마이",
    activeIcon: myIcon,
    inactiveIcon: noMyIcon,
    path: "/my",
  },
];

const BottomBar = () => {
  const location = useLocation();
  return (
    <div className="w-full">
      <nav
        className="
          fixed bottom-0 left-0 w-full z-50
          custom-bottom-gradient rounded-t-2xl
          h-[12.2vh] flex items-center
        "
        aria-label="하단 내비게이션 바"
      >
        <div className="w-full max-w-md mx-auto flex justify-around items-center h-full">
          {navs.map((nav) => {
            let active = false;
            if (nav.path === "/") {
              active = location.pathname === "/";
            } else if (nav.path === "/my") {
              active =
                location.pathname.startsWith("/my") ||
                location.pathname.startsWith("/profile-other/");
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
                  src={active ? nav.activeIcon : nav.inactiveIcon}
                  alt={nav.label + " 아이콘"}
                  // className="w-[12vw] h-[12vw] min-w-6 min-h-6 transition-opacity"
                  className="
                    w-[12vw] h-[12vw] min-w-6 min-h-6
                    md:w-12 md:h-12
                    transition-opacity
                  "
                />
                <span
                  className={`
                    w-[6px] h-[6px] rounded-full bg-[#E9E9E9] mt-1 transition-all
                    ${active ? "opacity-100" : "opacity-0"}
                  `}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default BottomBar;
