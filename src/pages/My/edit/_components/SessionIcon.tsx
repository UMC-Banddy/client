import React from "react";
import { MicImg, DrumImg } from "@/shared/components/images";

interface SessionIconProps {
  icon: string;
  className?: string;
}

const SessionIcon: React.FC<SessionIconProps> = ({ icon, className = "" }) => {
  const getIconComponent = () => {
    switch (icon) {
      case "🎤":
        return <MicImg size={32} color="red" />;
      case "🥁":
        return <DrumImg size={32} color="red" />;
      default:
        return (
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-13 2xl:h-13 bg-[#B71C1C] rounded-full flex items-center justify-center ${className}`}
          >
            <span className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
              {icon}
            </span>
          </div>
        );
    }
  };

  return getIconComponent();
};

export default SessionIcon;
