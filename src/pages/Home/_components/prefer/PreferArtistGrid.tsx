import React from "react";

interface Artist {
  id: number;
  name: string;
  image: string;
}

interface PreferArtistGridProps {
  artists: Artist[];
  thumbSize?: string; // tailwind class
  gapY?: string; // tailwind class
  gapX?: string; // tailwind class
}

const PreferArtistGrid: React.FC<PreferArtistGridProps> = ({
  artists,
  thumbSize = "w-24 h-24",
  gapY = "gap-y-8",
  gapX = "gap-x-4",
}) => (
  <div className={`grid grid-cols-3 ${gapY} ${gapX} w-full max-w-md mx-auto`}>
    {artists.map((artist) => (
      <div key={artist.id} className="flex flex-col items-center">
        <img
          src={artist.image}
          alt={artist.name}
          className={`${thumbSize} rounded-full object-cover mb-2`}
        />
        <div className="text-white text-base text-center leading-tight break-keep max-w-[6rem] font-hakgyoansim">
          {artist.name}
        </div>
      </div>
    ))}
  </div>
);

export default PreferArtistGrid;
