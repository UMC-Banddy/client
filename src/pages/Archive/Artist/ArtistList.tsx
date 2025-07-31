import React from "react";

interface ArtistListItem {
  image: string;
  title: string;
  externalUrl?: string;
}

interface ArtistListProps {
  items: ArtistListItem[];
}

export default function ArtistList({ items }: ArtistListProps) {
  const handleArtistClick = (externalUrl?: string) => {
    if (externalUrl) {
      window.open(externalUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-col gap-[12px] mb-[3vh]">
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleArtistClick(item.externalUrl)}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-[14vw] h-[14vw] max-w-[55px] max-h-[55px] rounded-full object-cover mr-[16px]"
          />
          <span className="text-[#FFFFFF] text-hakgyo-r-16">{item.title}</span>
        </div>
      ))}
    </div>
  );
} 