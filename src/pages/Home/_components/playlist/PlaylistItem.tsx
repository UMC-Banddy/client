import React from "react";
// import VolumeOffIcon from "@/assets/icons/volume-off.svg?react";

interface PlaylistItemProps {
  image: string;
  title: string;
  artist: string;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  image,
  title,
  artist,
}) => (
  <div className="flex items-center w-full py-2">
    <img
      src={image}
      alt={title}
      className="w-16 h-16 object-cover bg-white mr-4" // 이미지 크기 키움
    />
    <div className="flex-1 flex flex-col justify-center pl-1">
      <span className="text-white font-hakgyoansim text-lg leading-tight">
        {title}
      </span>
      <span className="text-gray-300 text-base">{artist}</span>
    </div>
    {/* <VolumeOffIcon className="w-6 h-6 text-gray-300 ml-2" /> */}
  </div>
);

export default PlaylistItem;
