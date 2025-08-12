import { useLocation, useNavigate } from "react-router-dom";
import whiteStar from "@/assets/logos/white-star.svg";
import backIcon from "@/assets/icons/back.svg";

const routeNameMap: Record<string, string> = {
  "/": "Home",
  "/search": "Search",
  "/band": "Band",
  "/my": "My",
  "/my/notifications": "Notifications",
  "/my/archive": "Archive",
  "/my/archive/add": "Archive",
  "/join/saved-band": "JOIN",
  // 필요시 추가
};

const nonHeaderRouteNames = [
  "/join",
  "/join/band-recruit/:id",
  "/join/create-chat",
  "/join/create-chat/2",
  "/join/create-band",
  "/join/create-band/genre",
  "/join/create-band/artist",
  "/join/create-band/song",
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routeName = routeNameMap[location.pathname] || "";
  const depth = location.pathname.split("/").filter(Boolean).length;

  // Check if current path matches any non-header routes (including dynamic routes)
  const isNonHeaderRoute = nonHeaderRouteNames.some((route) =>
    route.includes(":")
      ? location.pathname.startsWith(route.split(":")[0])
      : route === location.pathname
  );

  if (isNonHeaderRoute) {
    return null;
  }

  if (depth >= 2 && !routeName) {
    // 뒤로가기 버튼만
    return (
      <header className="w-full h-14 flex items-center px-4 ">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center focus:outline-none"
        >
          <img src={backIcon} alt="Back" className="w-8 h-8" />
        </button>
      </header>
    );
  } else if (depth >= 2 && routeName) {
    // 뒤로가기 버튼 + routeName
    return (
      <header className="w-full h-14 flex items-center px-4 ">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center focus:outline-none"
        >
          <img src={backIcon} alt="Back" className="w-8 h-8" />
        </button>
        <span
          className="ml-4 text-white text-xl font-bold italic"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {routeName}
        </span>
      </header>
    );
  } else {
    // (depth < 2) 로고 + routeName
    return (
      <header className="w-full h-14 flex items-center px-4 ">
        <img src={whiteStar} alt="Banddy Logo" className="w-8 h-8" />
        <span
          className="ml-4 text-white text-xl font-bold italic"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {routeName}
        </span>
      </header>
    );
  }
};

export default Header;
