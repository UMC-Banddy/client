import { Link } from "react-router-dom";
import bell from "@/assets/icons/my/bell.svg";
import no_bell from "@/assets/icons/my/no-bell.svg";
import settings from "@/assets/icons/my/settings.svg";

interface HeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  leftLink?: string;
  className?: string;
  hasNotification?: boolean;
}

export default function Header({
  title,
  leftIcon,
  leftLink,
  className = "",
  hasNotification = false,
}: HeaderProps) {
  return (
    <header
      className={`absolute top-[0vh] left-[0vw] w-full h-[13vh] flex items-center justify-between px-[4vw] ${className}`}
    >
      <div className="flex items-center">
        {leftIcon && leftLink ? (
          <Link to={leftLink} className="mr-2 flex items-center justify-center" aria-label="left icon">
            {leftIcon}
          </Link>
        ) : null}
        <span
          className="text-hel-26 text-[#FFFFFF] select-none"
        >
          {title}
        </span>
      </div>
      <div className="flex flex-col items-center gap-[1vh] pt-[7vh]">
        <Link to="/my/notifications" className="flex items-center justify-center relative" aria-label="notifications">
          <img 
            src={hasNotification ? bell : no_bell} 
            alt="bell" 
            className="text-[#FFFFFF] w-[12vw] h-[12vw]" 
          />
        </Link>
        <Link to="/my/setting" className="flex items-center justify-center" aria-label="settings">
          <img 
            src={settings} 
            alt="settings" 
            className="text-[#FFFFFF] w-[12vw] h-[12vw]" 
          />
        </Link>
      </div>
    </header>
  );
}