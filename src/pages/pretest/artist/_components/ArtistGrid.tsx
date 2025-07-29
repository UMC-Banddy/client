import React from "react";
import ArtistCard from "./ArtistCard";

interface Artist {
  id: string;
  name: string;
  image?: string;
}

interface ArtistGridProps {
  artists: Artist[];
  selectedArtists: string[];
  onArtistSelect: (id: string) => void;
  className?: string;
}

const ArtistGrid: React.FC<ArtistGridProps> = ({
  artists,
  selectedArtists,
  onArtistSelect,
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:gap-x-6 md:gap-y-12 lg:gap-x-8 lg:gap-y-14 xl:gap-x-10 xl:gap-y-16 2xl:gap-x-12 2xl:gap-y-20 ${className}`}
    >
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          id={artist.id}
          name={artist.name}
          image={artist.image}
          isSelected={selectedArtists.includes(artist.id)}
          onSelect={onArtistSelect}
        />
      ))}
    </div>
  );
};

export default ArtistGrid;
