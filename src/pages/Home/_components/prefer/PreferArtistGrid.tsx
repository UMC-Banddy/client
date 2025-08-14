import React, { useMemo } from "react";
import fallbackImg from "@/assets/images/guitar-boy.svg";

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
}) => {
  const uniqueArtists = useMemo(() => {
    const seen = new Set<string>();
    return artists.filter((a) => {
      const key = (a.name || "").toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [artists]);

  return (
    <div className={`grid grid-cols-3 ${gapY} ${gapX} w-full max-w-md mx-auto`}>
      {uniqueArtists.map((artist) => (
        <div key={artist.id} className="flex flex-col items-center">
          <img
            src={artist.image || fallbackImg}
            alt={artist.name}
            className={`${thumbSize} rounded-full object-cover mb-2`}
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              if (t.src !== fallbackImg) t.src = fallbackImg;
            }}
          />
          <div className="text-white text-base text-center leading-tight break-keep max-w-[6rem] font-hakgyoansim">
            {artist.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreferArtistGrid;
