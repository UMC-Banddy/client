import React from "react";
import oasisImage from "@/assets/images/oasis.png";

interface ArtistCardProps {
  id: number;
  name: string;
  image?: string;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  className?: string;
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  id,
  name,
  image = oasisImage,
  isSelected = false,
  onSelect,
  className = "",
}) => {
  const handleClick = () => {
    onSelect?.(id);
  };

  return (
    <div
      className={`flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105 ${className}`}
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={image}
          alt={name}
          className={`w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 2xl:w-48 2xl:h-48 rounded-full object-cover transition-all duration-200 ${
            isSelected ? "opacity-30" : "opacity-100"
          }`}
        />
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 bg-[#B71C1C] rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
      <span className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-white text-center max-w-[112px] sm:max-w-[128px] md:max-w-[144px] lg:max-w-[160px] xl:max-w-[176px] 2xl:max-w-[192px] font-medium leading-tight">
        {name}
      </span>
    </div>
  );
};

export default ArtistCard;
