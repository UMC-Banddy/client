import React from "react";

interface ArtistCardProps {
  name: string;
  image: string;
  className?: string;
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  name,
  image,
  className = "",
}) => {
  return (
    <div className={`text-center ${className}`}>
      <img
        src={image}
        alt={name}
        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 rounded-full object-cover mx-auto mb-2"
      />
      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-black">
        {name}
      </p>
    </div>
  );
};

export default ArtistCard;
